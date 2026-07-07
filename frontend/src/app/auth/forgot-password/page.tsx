import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/features/authentication/auth-shell";
import { ForgotPasswordForm } from "@/features/authentication/auth-forms";

export const metadata: Metadata = {
  title: "Dwellix | Forgot Password",
  description: "Request a password reset link.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Password recovery"
      title="Reset access in a secure way."
      description="Enter your email address and we&apos;ll prepare a password reset flow for your account."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Remembered it already? <Link href="/auth/login" className="font-medium text-primary hover:underline">Return to login</Link>
        </p>
      }
      backHref="/auth/login"
      backLabel="Back to login"
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
