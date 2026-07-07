import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/features/authentication/auth-shell";
import { VerifyEmailView } from "@/features/authentication/auth-forms";

type VerifyEmailPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Dwellix | Verify Email",
  description: "Verify your email address.",
};

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const resolvedSearchParams = await searchParams;
  return (
    <AuthShell
      eyebrow="Email verification"
      title="Verify your email address."
      description="Confirm your mailbox to complete account activation and continue into onboarding."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Back to <Link href="/auth/login" className="font-medium text-primary hover:underline">Login</Link>
        </p>
      }
      backHref="/auth/login"
      backLabel="Back to login"
    >
      <VerifyEmailView token={resolvedSearchParams?.token} />
    </AuthShell>
  );
}
