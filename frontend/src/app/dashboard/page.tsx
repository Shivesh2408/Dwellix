"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Cpu, Plus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import dynamic from "next/dynamic";
const DashboardContent = dynamic(
  () => import("@/features/dashboard/dashboard-content").then((mod) => mod.DashboardContent),
  {
    loading: () => <div className="p-8 text-center text-xs text-muted-foreground">Loading dashboard content...</div>,
    ssr: false
  }
);
import { getDashboardSummary, type DashboardSummaryResponse } from "@/features/dashboard/service";
import { apiClient, setAccessToken } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const summary = await getDashboardSummary();
      setData(summary);
      
      // If the user hasn't completed onboarding at all (no home details), redirect them
      if (summary.home === null) {
        router.push("/onboarding");
      }
    } catch (err: unknown) {
      console.error("Dashboard fetch error:", err);
      const apiErr = err as { message?: string; status?: number };
      setError(apiErr?.message ?? "Unable to load dashboard details.");
      if (apiErr?.status === 401 || apiErr?.message?.toLowerCase().includes("session expired") || apiErr?.message?.toLowerCase().includes("unauthorized")) {
        router.push("/auth/login");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get("token");
      if (token) {
        setAccessToken(token);
        router.replace("/dashboard");
      }
    }
    let active = true;
    const load = async () => {
      await Promise.resolve();
      if (active) {
        fetchDashboard();
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [router, fetchDashboard]);

  const handleLogout = () => {
    // Simply clear in-memory token and redirect
    // (the HttpOnly cookie deletion is handled by backend /logout)
    setAccessToken(null);
    apiClient("/api/v1/auth/logout", { method: "POST" })
      .finally(() => {
        router.push("/auth/login");
      });
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen bg-background">
        {/* Left Sidebar Placeholder */}
        <div className="hidden md:block w-[280px] border-r border-border bg-white p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="space-y-4 pt-10">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-xl" />
            ))}
          </div>
        </div>
        {/* Main Content Area Placeholder */}
        <div className="flex-grow flex flex-col h-full overflow-hidden">
          <div className="h-20 border-b border-border bg-white px-8 flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
          <div className="flex-1 p-8 space-y-8 overflow-y-auto">
            {/* Stats Row Placeholder */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="rounded-2xl border-border/70 p-6 bg-white/70">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-8 w-8 rounded-lg" />
                    </div>
                    <Skeleton className="h-8 w-12" />
                  </div>
                </Card>
              ))}
            </div>
            {/* Circular Progress Area Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 rounded-2xl border-border/70 p-8 bg-white flex items-center gap-8">
                <Skeleton className="h-32 w-32 rounded-full flex-shrink-0" />
                <div className="space-y-3 flex-grow">
                  <Skeleton className="h-6 w-28" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </Card>
              <Card className="rounded-2xl border-border/70 p-6 bg-white space-y-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-secondary-background gap-4">
        <div className="text-sm font-bold text-destructive">Failed to load Dashboard data</div>
        <p className="text-xs text-muted-foreground">{error}</p>
        <Button onClick={fetchDashboard} size="sm">
          Retry
        </Button>
      </div>
    );
  }

  if (!data || !data.home) {
    return null; // Will redirect via useEffect
  }

  const { home, userName, appliancesCount } = data;
  const homeSelectorOptions = [home.homeName];

  return appliancesCount === 0 ? (
    /* SECTION 8 EMPTY STATE: PREMIUM ONBOARDING REMINDER */
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-xl mx-auto">
      <div className="h-20 w-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center shadow-lg shadow-primary/5 mb-8 animate-pulse">
        <Cpu className="h-10 w-10" />
      </div>
      <h2 className="font-heading font-extrabold text-3xl tracking-tight text-foreground mb-4">
        Welcome to Your Dwellix Dashboard
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed mb-8">
        You successfully mapped your home, <strong>{home.homeName}</strong>. Now let’s add appliances to unlock the full health tracking, warranty alerts, and AI-powered recommendations.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-sm">
        <Button
          onClick={() => router.push("/onboarding/appliances")}
          className="h-11 px-6 rounded-xl font-bold gap-2 text-sm shadow-md shadow-primary/20 flex-1"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Add First Appliance</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/marketplace")}
          className="h-11 px-6 rounded-xl font-bold text-sm flex-1 border-border/80"
        >
          Browse Marketplace
        </Button>
      </div>
    </div>
  ) : (
    /* ACTIVE DASHBOARD CONTENT */
    <DashboardContent
      data={data}
      onDiagnoseClick={() => router.push("/dashboard/ai-assistant")}
      onBookClick={() => router.push("/dashboard/bookings")}
      onUploadInvoiceClick={() => router.push("/dashboard/warranty-vault")}
      onAddApplianceClick={() => router.push("/dashboard/appliances")}
      onViewMarketplaceClick={() => router.push("/dashboard/marketplace")}
    />
  );
}
