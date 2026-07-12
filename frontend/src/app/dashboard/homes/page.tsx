"use client";

import React, { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { Home as HomeIcon, MapPin, Building, ShieldCheck, Edit3, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

interface HomeProfile {
  id: string;
  homeName: string;
  homeType: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  setupCompleted: boolean;
}

export default function HomesPage() {
  const [home, setHome] = useState<HomeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    homeName: "",
    homeType: "Apartment",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchHome = useCallback(() => {
    setLoading(true);
    setError(null);
    apiClient<HomeProfile>("/api/v1/onboarding/home")
      .then((data) => {
        setHome(data);
        if (data) {
          setForm({
            homeName: data.homeName,
            homeType: data.homeType,
            address: data.address,
            city: data.city,
            state: data.state,
            pincode: data.pincode
          });
        }
      })
      .catch((err) => {
        console.error("Failed to load home:", err);
        setError("No registered home found. Complete onboarding to configure your home profile.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      await Promise.resolve();
      if (active) {
        fetchHome();
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [fetchHome]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await apiClient<HomeProfile>("/api/v1/onboarding/home", {
        method: "PUT",
        body: JSON.stringify(form)
      });
      setHome(updated);
      setIsEditing(false);
      setToastMessage("Home profile updated successfully.");
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error("Failed to update home:", err);
      setError("Failed to update home profile details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 space-y-6 max-w-4xl mx-auto w-full">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Card className="p-8 border-border/70 rounded-2xl bg-white space-y-6">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (error && !home) {
    return (
      <div className="flex flex-col items-center justify-center p-12 max-w-md mx-auto h-[60vh] gap-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
          <HomeIcon className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-semibold text-foreground font-heading">No Active Profile</h3>
        <p className="text-xs text-muted-foreground text-center max-w-xs">{error}</p>
        <Button onClick={fetchHome} size="sm" className="mt-2">Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 max-w-4xl mx-auto w-full space-y-8 relative">
      {/* Custom Success Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg border border-emerald-500 font-medium text-sm flex items-center gap-2 animate-bounce">
          <ShieldCheck className="h-4 w-4" /> {toastMessage}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-heading">Home Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage physical settings, metadata, and active address files.</p>
        </div>
        {!isEditing && home && (
          <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2 rounded-xl">
            <Edit3 className="h-4 w-4" />
            Modify Details
          </Button>
        )}
      </div>

      <Card className="border-border/70 rounded-2xl bg-white shadow-sm overflow-hidden p-8">
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Home Name</span>
                <Input
                  required
                  value={form.homeName}
                  onChange={(e) => setForm((prev) => ({ ...prev, homeName: e.target.value }))}
                  className="rounded-xl border-border/70"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Property Type</span>
                <select
                  value={form.homeType}
                  onChange={(e) => setForm((prev) => ({ ...prev, homeType: e.target.value }))}
                  className="w-full px-3.5 py-2 border border-border/75 rounded-xl text-sm bg-white text-slate-700 font-medium focus:outline-none cursor-pointer h-10"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Independent House">Independent House</option>
                  <option value="Condo">Condo</option>
                </select>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Street Address</span>
                <Input
                  required
                  value={form.address}
                  onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                  className="rounded-xl border-border/70"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">City</span>
                <Input
                  required
                  value={form.city}
                  onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                  className="rounded-xl border-border/70"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">State</span>
                <Input
                  required
                  value={form.state}
                  onChange={(e) => setForm((prev) => ({ ...prev, state: e.target.value }))}
                  className="rounded-xl border-border/70"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pincode</span>
                <Input
                  required
                  value={form.pincode}
                  onChange={(e) => setForm((prev) => ({ ...prev, pincode: e.target.value }))}
                  className="rounded-xl border-border/70"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <Button type="button" onClick={() => setIsEditing(false)} variant="ghost" className="rounded-xl">
                <X className="h-4.5 w-4.5 mr-1.5" />
                Cancel
              </Button>
              <Button type="submit" loading={saving} className="rounded-xl">
                <Save className="h-4.5 w-4.5 mr-1.5" />
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary-soft border border-primary/20 flex items-center justify-center text-primary">
                <HomeIcon className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{home?.homeName}</h2>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 mt-1">
                  {home?.homeType}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-slate-50/50">
                <div className="p-2.5 rounded-lg bg-white border border-border/60 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Street Address</span>
                  <span className="text-sm font-semibold text-slate-800 block mt-0.5">{home?.address}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-slate-50/50">
                <div className="p-2.5 rounded-lg bg-white border border-border/60 text-muted-foreground">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Location Details</span>
                  <span className="text-sm font-semibold text-slate-800 block mt-0.5">{home?.city}, {home?.state} - {home?.pincode}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
