let inMemoryToken: string | null = null;
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_AUTH_API_BASE_URL ?? "";

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

export function setAccessToken(token: string | null) {
  inMemoryToken = token;
}

export function getAccessToken(): string | null {
  return inMemoryToken;
}

export class ApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

async function refreshAccessToken(): Promise<string> {
  const response = await fetch(`${apiBaseUrl}/api/v1/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new ApiError("Session expired. Please log in again.", response.status);
  }

  const data = await response.json();
  const token = data.tokens?.accessToken;
  if (!token) {
    throw new ApiError("Invalid token response from server.");
  }

  setAccessToken(token);
  return token;
}

export async function apiClient<T>(path: string, init?: RequestInit): Promise<T> {
  const makeRequest = async (token: string | null): Promise<Response> => {
    return fetch(`${apiBaseUrl}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers ?? {}),
      },
    });
  };

  let response = await makeRequest(inMemoryToken);

  if (response.status === 401) {
    // If it's already refreshing, queue the request until refresh completes
    if (isRefreshing) {
      return new Promise<T>((resolve, reject) => {
        subscribeTokenRefresh(async (newToken) => {
          try {
            const retryResponse = await makeRequest(newToken);
            if (!retryResponse.ok) {
              const body = await retryResponse.json().catch(() => null);
              const msg = body?.message ?? "API request failed after refresh.";
              reject(new ApiError(msg, retryResponse.status));
            } else {
              const body = await retryResponse.json();
              resolve(body as T);
            }
          } catch (err) {
            reject(err);
          }
        });
      });
    }

    isRefreshing = true;

    try {
      const newToken = await refreshAccessToken();
      isRefreshing = false;
      onRefreshed(newToken);

      // Retry the original request
      response = await makeRequest(newToken);
    } catch (err) {
      isRefreshing = false;
      setAccessToken(null);
      throw err;
    }
  }

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await response.json().catch(() => null) : await response.text().catch(() => null);

  if (!response.ok) {
    const message = typeof body === "object" && body && "message" in body ? String(body.message) : "API request failed.";
    throw new ApiError(message, response.status);
  }

  return body as T;
}
