export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  role: string;
  emailVerified: boolean;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
};

export type AuthSession = {
  user: AuthUser;
  tokens: AuthTokens;
};

export type LoginPayload = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type SignupPayload = {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  password: string;
  confirmPassword: string;
};

export type VerifyEmailPayload = {
  token: string;
};

if (typeof window !== "undefined" && !process.env.NEXT_PUBLIC_AUTH_API_BASE_URL) {
  console.error("NEXT_PUBLIC_AUTH_API_BASE_URL is not defined.");
  throw new Error("NEXT_PUBLIC_AUTH_API_BASE_URL is not defined.");
}

const authApiBaseUrl = process.env.NEXT_PUBLIC_AUTH_API_BASE_URL;

export class AuthError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = "AuthError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${authApiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    credentials: "include",
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await response.json().catch(() => null) : await response.text().catch(() => null);

  if (!response.ok) {
    const message = typeof body === "object" && body && "message" in body ? String(body.message) : "Authentication request failed.";
    throw new AuthError(message, response.status);
  }

  return body as T;
}

export function login(payload: LoginPayload) {
  return request<AuthSession>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function signup(payload: SignupPayload) {
  return request<{ message: string; verificationToken?: string }>("/api/v1/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function logout() {
  return request<{ message: string }>("/api/v1/auth/logout", {
    method: "POST",
  });
}

export function refreshToken() {
  return request<AuthSession>("/api/v1/auth/refresh", {
    method: "POST",
  });
}

export function forgotPassword(payload: ForgotPasswordPayload) {
  return request<{ message: string }>("/api/v1/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function resetPassword(payload: ResetPasswordPayload) {
  return request<{ message: string }>("/api/v1/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function verifyEmail(payload: VerifyEmailPayload) {
  return request<{ message: string }>("/api/v1/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCurrentUser() {
  return request<{ user: AuthUser }>("/api/v1/auth/me", {
    method: "GET",
  });
}

export type TechnicianSignupPayload = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  city: string;
  experience: number;
  serviceRadius: number;
  bio: string;
  languages: string;
  specialization: string;
  inspectionCharge: number;
  profilePhotoUrl?: string;
};

export function technicianLogin(payload: LoginPayload) {
  return request<AuthSession>("/api/v1/technician/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function technicianSignup(payload: TechnicianSignupPayload) {
  return request<{ message: string }>("/api/v1/technician/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
