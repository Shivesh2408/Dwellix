import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/features/authentication/auth-shell";
import { LoginForm } from "@/features/authentication/auth-forms";

export const metadata: Metadata = {
  title: "Dwellix | Login",
  description: "Sign in to your Dwellix account.",
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Secure sign in"
      title="Welcome back."
      description="Sign in to manage your home, review service history, and continue your onboarding journey."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account? <Link href="/auth/signup" className="font-medium text-primary hover:underline">Create Account</Link>
        </p>
      }
      backHref="/"
      backLabel="Back to home"
    >
      <LoginForm />
    </AuthShell>
  );
}
