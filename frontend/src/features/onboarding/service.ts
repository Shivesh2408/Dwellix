import type { OnboardingCompletePayload, OnboardingSummaryResponse } from "./types";
import { apiClient, ApiError } from "@/lib/api-client";

export class OnboardingError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = "OnboardingError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    return await apiClient<T>(path, init);
  } catch (error) {
    if (error instanceof ApiError) {
      throw new OnboardingError(error.message, error.status);
    }
    throw error;
  }
}

export function getOnboardingSummary() {
  return request<OnboardingSummaryResponse>("/api/v1/onboarding/summary", { method: "GET" });
}

export function completeOnboarding(payload: OnboardingCompletePayload) {
  return request<{ message: string; onboardingCompleted: boolean }>("/api/v1/onboarding/complete", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

