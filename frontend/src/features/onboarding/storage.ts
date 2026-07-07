import type { OnboardingDraft } from "./types";

const STORAGE_KEY = "dwellix.onboarding.draft";

export function createStarterDraft(): OnboardingDraft {
  return {
    homeName: "",
    homeType: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    rooms: [
      {
        id: crypto.randomUUID(),
        name: "Living Room",
        notes: "Main shared space",
        appliances: [],
      },
      {
        id: crypto.randomUUID(),
        name: "Bedroom",
        notes: "Primary rest area",
        appliances: [],
      },
    ],
  };
}

export function loadOnboardingDraft(): OnboardingDraft | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as OnboardingDraft;
  } catch {
    return null;
  }
}

export function saveOnboardingDraft(draft: OnboardingDraft) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function clearOnboardingDraft() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
