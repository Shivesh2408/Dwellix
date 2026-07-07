import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/features/authentication/auth-shell";
import { ResetPasswordForm } from "@/features/authentication/auth-forms";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Dwellix | Reset Password",
  description: "Choose a new password for your account.",
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const resolvedSearchParams = await searchParams;
  return (
    <AuthShell
      eyebrow="Choose a new password"
      title="Set a fresh password."
      description="Use a secure password you have not used before on this account."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Need another link? <Link href="/auth/forgot-password" className="font-medium text-primary hover:underline">Request reset email</Link>
        </p>
      }
      backHref="/auth/login"
      backLabel="Back to login"
    >
      <ResetPasswordForm token={resolvedSearchParams?.token ?? ""} />
    </AuthShell>
  );
}
