"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { User, Mail, Phone, Shield, Calendar, LogOut, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  emailVerified: boolean;
  lastLoginAt: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = () => {
    setLoading(true);
    setError(null);
    apiClient<UserProfile>("/api/v1/auth/me")
      .then((data) => setProfile(data))
      .catch((err) => {
        console.error("Failed to load profile:", err);
        setError("Failed to retrieve profile information. Please log in again.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    fetch("/api/v1/auth/logout", { method: "POST", credentials: "include" })
      .finally(() => {
        router.push("/auth/login");
      });
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 space-y-6 max-w-4xl mx-auto">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Card className="p-8 border-border/70 rounded-2xl bg-white space-y-6">
          <div className="flex items-center gap-6">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center p-12 max-w-md mx-auto h-[60vh] gap-4">
        <div className="text-sm font-bold text-destructive">Error Loading Profile</div>
        <p className="text-xs text-muted-foreground text-center">{error || "User data is missing."}</p>
        <Button onClick={fetchProfile} size="sm">Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-heading">My Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account information and preferences.</p>
      </div>

      <Card className="border-border/70 rounded-2xl bg-white shadow-sm overflow-hidden">
        {/* Banner header with decorative background */}
        <div className="h-32 bg-gradient-to-r from-primary/10 via-indigo-500/10 to-cyan-500/10 relative" />

        <div className="px-8 pb-8 relative">
          {/* Avatar override */}
          <div className="absolute -top-12 left-8 h-24 w-24 rounded-2xl bg-primary text-white font-extrabold text-3xl flex items-center justify-center border-4 border-white shadow-md">
            {profile.fullName.charAt(0).toUpperCase()}
          </div>

          <div className="pt-16 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2.5">
                {profile.fullName}
                {profile.emailVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="h-3 w-3" /> Verified
                  </span>
                )}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">{profile.role === "ROLE_USER" ? "Home Owner" : profile.role}</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="gap-2 text-destructive hover:bg-destructive/5 hover:text-destructive self-start md:self-center">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-border/70">
            <div className="flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-slate-50/50">
              <div className="p-2.5 rounded-lg bg-white border border-border/60 text-muted-foreground">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Email Address</span>
                <span className="text-sm font-semibold text-slate-800 block mt-0.5">{profile.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-slate-50/50">
              <div className="p-2.5 rounded-lg bg-white border border-border/60 text-muted-foreground">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Phone Number</span>
                <span className="text-sm font-semibold text-slate-800 block mt-0.5">{profile.phoneNumber || "Not provided"}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-slate-50/50">
              <div className="p-2.5 rounded-lg bg-white border border-border/60 text-muted-foreground">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Security Role</span>
                <span className="text-sm font-semibold text-slate-800 block mt-0.5">{profile.role}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-slate-50/50">
              <div className="p-2.5 rounded-lg bg-white border border-border/60 text-muted-foreground">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Last Session Active</span>
                <span className="text-sm font-semibold text-slate-800 block mt-0.5">
                  {profile.lastLoginAt ? new Date(profile.lastLoginAt).toLocaleString() : "First login session"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
