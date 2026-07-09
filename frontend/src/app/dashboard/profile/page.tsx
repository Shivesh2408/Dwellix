"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { Mail, Phone, Shield, Calendar, LogOut, CheckCircle2, UserCheck, Key, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  emailVerified: boolean;
  lastLoginAt: string | null;
}

export function ProfileOverview({ profile, onLogout }: { profile: UserProfile; onLogout: () => void }) {
  return (
    <div className="space-y-8">
      {/* Banner / Card Header */}
      <Card className="border border-border/40 rounded-3xl bg-white shadow-premium overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-black to-slate-900 relative">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_70%_20%,_rgba(37,99,235,0.15),_transparent_60%)]" />
        </div>

        <div className="px-8 pb-8 relative">
          {/* Large Avatar Block */}
          <div className="absolute -top-14 left-8 h-28 w-28 rounded-3xl bg-black text-white font-extrabold text-4xl flex items-center justify-center border-4 border-white shadow-premium">
            {profile.fullName.charAt(0).toUpperCase()}
          </div>

          <div className="pt-16 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-heading font-extrabold text-foreground flex items-center gap-3">
                {profile.fullName}
                {profile.emailVerified && (
                  <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[10px] font-bold uppercase py-0.5 px-2.5">
                    <CheckCircle2 className="h-3 w-3 mr-1 inline" /> Verified Owner
                  </Badge>
                )}
              </h2>
              <p className="text-sm text-muted-foreground font-medium">
                Role: {profile.role === "ROLE_USER" ? "Property Owner" : profile.role}
              </p>
            </div>

            <Button onClick={onLogout} variant="outline" className="rounded-xl h-11 border-border text-destructive hover:bg-destructive/5 hover:text-destructive font-semibold flex items-center gap-2 self-start md:self-center">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </Card>

      {/* Bento Grid Info Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 rounded-3xl border border-border/40 bg-white p-6 shadow-premium space-y-6 text-left">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Account Credentials</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4.5 rounded-2xl border border-border/60 bg-[#F8F9FB] flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-white border border-border/60 text-muted-foreground">
                <Mail className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">Email Address</span>
                <span className="text-sm font-semibold text-foreground break-all">{profile.email}</span>
              </div>
            </div>

            <div className="p-4.5 rounded-2xl border border-border/60 bg-[#F8F9FB] flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-white border border-border/60 text-muted-foreground">
                <Phone className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">Phone Contact</span>
                <span className="text-sm font-semibold text-foreground">{profile.phoneNumber || "Not configured"}</span>
              </div>
            </div>

            <div className="p-4.5 rounded-2xl border border-border/60 bg-[#F8F9FB] flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-white border border-border/60 text-muted-foreground">
                <Shield className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">Access Level</span>
                <span className="text-sm font-semibold text-foreground">{profile.role}</span>
              </div>
            </div>

            <div className="p-4.5 rounded-2xl border border-border/60 bg-[#F8F9FB] flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-white border border-border/60 text-muted-foreground">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">Last Verified Login</span>
                <span className="text-sm font-semibold text-foreground">
                  {profile.lastLoginAt ? new Date(profile.lastLoginAt).toLocaleDateString() : "Active Session"}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Operations Sidebar Column */}
        <Card className="rounded-3xl border border-border/40 bg-white p-6 shadow-premium space-y-6 text-left flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Security & Logs</h3>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              Verify connected devices, change security credentials, or review dynamic service logs.
            </p>
          </div>

          <div className="space-y-3 pt-6 border-t border-slate-50">
            <Button variant="outline" className="w-full h-11 rounded-xl justify-start text-xs font-semibold gap-2 border-border">
              <Key className="h-4 w-4" />
              Change Password
            </Button>
            <Button variant="outline" className="w-full h-11 rounded-xl justify-start text-xs font-semibold gap-2 border-border">
              <UserCheck className="h-4 w-4" />
              Connected Accounts
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
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
    apiClient("/api/v1/auth/logout", { method: "POST" })
      .finally(() => {
        router.push("/auth/login");
      });
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 space-y-6 max-w-5xl mx-auto text-left">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Card className="p-8 border-border rounded-3xl bg-white space-y-6">
          <div className="flex items-center gap-6">
            <Skeleton className="h-20 w-20 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center p-12 max-w-md mx-auto h-[60vh] gap-4">
        <div className="text-sm font-bold text-destructive">Error Loading Profile</div>
        <p className="text-xs text-muted-foreground text-center">{error || "User data is missing."}</p>
        <Button onClick={fetchProfile} size="sm" className="rounded-xl">Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 max-w-5xl mx-auto space-y-8 text-left">
      <div>
        <Badge className="bg-primary/5 text-primary text-[10px] uppercase font-bold tracking-widest rounded-full border-none">
          Personal Space
        </Badge>
        <h1 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-foreground mt-2">My Profile</h1>
        <p className="text-sm text-muted-foreground font-medium">Manage your personal account information and security credentials.</p>
      </div>

      <ProfileOverview profile={profile} onLogout={handleLogout} />
    </div>
  );
}
