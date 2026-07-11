"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AuthShell } from "@/features/authentication/auth-shell";
import { technicianLogin, AuthError } from "@/features/authentication/auth-service";
import { setAccessToken } from "@/lib/api-client";

export default function TechnicianLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await technicianLogin(form);
      if (response.tokens?.accessToken) {
        setAccessToken(response.tokens.accessToken);
        setSuccess(true);
        setTimeout(() => {
          router.push("/technician/dashboard");
        }, 1000);
      } else {
        throw new Error("Invalid token response.");
      }
    } catch (err) {
      setError(err instanceof AuthError ? err.message : "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthShell
        eyebrow="Identity Verified"
        title="Signing you in..."
        description="Establishing a secure dispatch connection to the Dwellix Pro platform."
        statusLabel="Technician Portal"
      >
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm animate-pulse">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <p className="text-xs text-slate-500 font-semibold">Redirecting to Pro Dashboard...</p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Pro Portal Access"
      title="Technician Sign In"
      description="Access your Dwellix technician dashboard to coordinate with customers and handle dispatches."
      statusLabel="Technician Portal"
      backHref="/"
      backLabel="Back to home"
      footer={
        <p className="text-center text-xs text-slate-550 font-semibold">
          New technician?{" "}
          <Link href="/technician/signup" className="text-blue-600 hover:underline">
            Register your profile here
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-red-50 text-red-600 border border-red-100 rounded-xl font-semibold">
            {error}
          </div>
        )}

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700">Email Address *</span>
          <Input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="ramesh.kumar@dwellix.in"
            className="h-11 rounded-xl text-xs"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700">Password *</span>
          <Input
            required
            type="password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            placeholder="••••••••"
            className="h-11 rounded-xl text-xs"
          />
        </label>

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full bg-black text-white hover:bg-black/90 rounded-xl font-bold text-xs gap-1.5 mt-2 cursor-pointer shadow-md"
        >
          {loading ? "Verifying Credentials..." : "Access Dashboard"}
        </Button>
      </form>
    </AuthShell>
  );
}
