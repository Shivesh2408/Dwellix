interface RefreshSubscriber {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}

let inMemoryToken: string | null = null;
let isRefreshing = false;
let refreshSubscribers: RefreshSubscriber[] = [];

if (typeof window !== "undefined" && !process.env.NEXT_PUBLIC_API_BASE_URL) {
  console.error("NEXT_PUBLIC_API_BASE_URL is not defined.");
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined.");
}

export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

function subscribeTokenRefresh(resolve: (token: string) => void, reject: (err: any) => void) {
  refreshSubscribers.push({ resolve, reject });
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((sub) => sub.resolve(token));
  refreshSubscribers = [];
}

function onRefreshFailed(err: any) {
  refreshSubscribers.forEach((sub) => sub.reject(err));
  refreshSubscribers = [];
}

export function setAccessToken(token: string | null) {
  inMemoryToken = token;
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("dwellix_access_token", token);
    } else {
      localStorage.removeItem("dwellix_access_token");
    }
  }
}

export function getAccessToken(): string | null {
  if (inMemoryToken) {
    return inMemoryToken;
  }
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem("dwellix_access_token");
    if (cached) {
      inMemoryToken = cached;
      return cached;
    }
  }
  return null;
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

  let response = await makeRequest(getAccessToken());

  if (response.status === 401) {
    // If it's already refreshing, queue the request until refresh completes
    if (isRefreshing) {
      return new Promise<T>((resolve, reject) => {
        subscribeTokenRefresh(
          async (newToken) => {
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
          },
          (err) => {
            reject(err);
          }
        );
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
      onRefreshFailed(err);
      setAccessToken(null);
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth/")) {
        window.location.href = "/auth/login";
      }
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
