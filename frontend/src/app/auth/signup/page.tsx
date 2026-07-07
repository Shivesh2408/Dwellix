import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/features/authentication/auth-shell";
import { SignupForm } from "@/features/authentication/auth-forms";

export const metadata: Metadata = {
  title: "Dwellix | Create Account",
  description: "Create your Dwellix account.",
};

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow="Create your account"
      title="Start with a premium setup."
      description="Create your secure Dwellix account, verify your email, and move into onboarding."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Already have an account? <Link href="/auth/login" className="font-medium text-primary hover:underline">Login</Link>
        </p>
      }
      backHref="/"
      backLabel="Back to home"
    >
      <SignupForm />
    </AuthShell>
  );
}
