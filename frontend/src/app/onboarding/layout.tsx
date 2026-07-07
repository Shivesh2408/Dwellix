import type { ReactNode } from "react";
import { OnboardingProvider } from "@/features/onboarding/provider";

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return <OnboardingProvider>{children}</OnboardingProvider>;
}
