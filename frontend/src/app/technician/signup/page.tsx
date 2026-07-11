"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AuthShell } from "@/features/authentication/auth-shell";
import { technicianSignup, type TechnicianSignupPayload, AuthError } from "@/features/authentication/auth-service";

export default function TechnicianSignupPage() {
  const router = useRouter();
  const [form, setForm] = useState<TechnicianSignupPayload>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    city: "",
    experience: 1,
    serviceRadius: 10,
    bio: "",
    languages: "English, Hindi",
    specialization: "General Appliances",
    inspectionCharge: 500,
    profilePhotoUrl: "https://res.cloudinary.com/demo/image/upload/w_150,h_150,c_fill,g_face/r_max/dpr_auto/f_auto/q_auto/v1/sample.jpg"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await technicianSignup(form);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof AuthError ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthShell
        eyebrow="Registration Complete"
        title="Welcome to Dwellix Pro"
        description="Your professional technician account was created successfully. You can now log in to access your portal."
        statusLabel="Technician Portal"
        backHref="/technician/login"
        backLabel="Go to Login"
      >
        <div className="space-y-5 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm animate-bounce">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">Setup Verified</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your details have been successfully registered under our v2.0 Technician program.
            </p>
          </div>
          <Button asChild className="h-11 px-6 bg-black text-white hover:bg-black/90 rounded-xl font-bold text-xs gap-1.5 shadow-md">
            <Link href="/technician/login">
              <span>Proceed to Login</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Join the Network"
      title="Create Pro Account"
      description="Register your technician profile to receive dispatches, manage repair queues, and track your service earnings."
      statusLabel="Technician Portal"
      backHref="/technician/login"
      backLabel="I have a Pro account"
      footer={
        <p className="text-center text-xs text-slate-500 font-semibold">
          Already registered?{" "}
          <Link href="/technician/login" className="text-blue-600 hover:underline">
            Log in here
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">Full Name *</span>
            <Input
              required
              value={form.fullName}
              onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
              placeholder="Ramesh Kumar"
              className="h-10 rounded-xl text-xs"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">Email Address *</span>
            <Input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="ramesh@dwellix.in"
              className="h-10 rounded-xl text-xs"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">Phone Number *</span>
            <Input
              required
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="+91 98765 43210"
              className="h-10 rounded-xl text-xs"
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
              className="h-10 rounded-xl text-xs"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">City *</span>
            <Input
              required
              value={form.city}
              onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
              placeholder="Delhi"
              className="h-10 rounded-xl text-xs"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">Specialization *</span>
            <Input
              required
              value={form.specialization}
              onChange={(e) => setForm((prev) => ({ ...prev, specialization: e.target.value }))}
              placeholder="AC & Cooling Specialist"
              className="h-10 rounded-xl text-xs"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">Years of Experience *</span>
            <Input
              required
              type="number"
              value={form.experience}
              onChange={(e) => setForm((prev) => ({ ...prev, experience: parseInt(e.target.value) || 1 }))}
              className="h-10 rounded-xl text-xs"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">Service Radius (km) *</span>
            <Input
              required
              type="number"
              value={form.serviceRadius}
              onChange={(e) => setForm((prev) => ({ ...prev, serviceRadius: parseFloat(e.target.value) || 10 }))}
              className="h-10 rounded-xl text-xs"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">Inspection Charge (₹) *</span>
            <Input
              required
              type="number"
              value={form.inspectionCharge}
              onChange={(e) => setForm((prev) => ({ ...prev, inspectionCharge: parseFloat(e.target.value) || 500 }))}
              className="h-10 rounded-xl text-xs"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">Languages (comma-separated) *</span>
            <Input
              required
              value={form.languages}
              onChange={(e) => setForm((prev) => ({ ...prev, languages: e.target.value }))}
              placeholder="English, Hindi"
              className="h-10 rounded-xl text-xs"
            />
          </label>

          <label className="sm:col-span-2 block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">Profile Photo URL</span>
            <Input
              value={form.profilePhotoUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, profilePhotoUrl: e.target.value }))}
              placeholder="https://example.com/avatar.jpg"
              className="h-10 rounded-xl text-xs"
            />
          </label>

          <label className="sm:col-span-2 block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">Short Bio *</span>
            <Textarea
              required
              value={form.bio}
              onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
              placeholder="Describe your technical skills, certifications, and repair experiences..."
              className="h-20 rounded-xl text-xs resize-none"
            />
          </label>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full bg-black text-white hover:bg-black/90 rounded-xl font-bold text-xs gap-1.5 mt-2 cursor-pointer shadow-md"
        >
          {loading ? "Registering Profile..." : "Register Profile"}
        </Button>
      </form>
    </AuthShell>
  );
}
