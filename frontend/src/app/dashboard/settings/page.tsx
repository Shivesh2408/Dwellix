"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { Settings, ShieldCheck, Mail, Bell, Globe, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [theme, setTheme] = useState("light");
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchProfile = () => {
    setLoading(true);
    setError(null);
    apiClient<UserProfile>("/api/v1/auth/me")
      .then((data) => setProfile(data))
      .catch((err) => {
        console.error("Failed to load settings profile:", err);
        setError("Could not load user metadata. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setToastMessage("Settings updated successfully.");
      setTimeout(() => setToastMessage(null), 3000);
    }, 800);
  };

  if (loading) {
    return (
      <div className="flex-grow p-8 space-y-6 max-w-4xl mx-auto w-full">
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 max-w-md mx-auto h-[60vh] gap-4">
        <div className="text-sm font-bold text-destructive font-heading">Error Loading Settings</div>
        <p className="text-xs text-muted-foreground text-center">{error}</p>
        <Button onClick={fetchProfile} size="sm">Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex-grow p-8 max-w-4xl mx-auto w-full space-y-8 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg border border-emerald-500 font-medium text-sm flex items-center gap-2 animate-bounce">
          <ShieldCheck className="h-4 w-4" /> {toastMessage}
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-heading">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure your dashboard preferences, notifications, and visual styling.</p>
      </div>

      <Card className="border-border/70 rounded-2xl bg-white shadow-sm overflow-hidden p-8 space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 font-heading flex items-center gap-2">
            <Bell className="h-5 w-5 text-indigo-500" /> Notifications Settings
          </h3>
          <div className="space-y-4 divide-y divide-slate-100">
            <div className="flex justify-between items-center py-3">
              <div>
                <span className="text-sm font-bold text-slate-800 block">Email Alerts</span>
                <span className="text-xs text-muted-foreground block mt-0.5">Receive weekly reports and warranty updates.</span>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-9 h-5 rounded-full bg-slate-200 checked:bg-indigo-500 cursor-pointer appearance-none relative transition-all duration-300 before:content-[''] before:absolute before:h-4 before:w-4 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-all checked:before:translate-x-4"
              />
            </div>

            <div className="flex justify-between items-center py-3">
              <div>
                <span className="text-sm font-bold text-slate-800 block">Push Notifications</span>
                <span className="text-xs text-muted-foreground block mt-0.5">Get real-time diagnostic alerts and priority reminders.</span>
              </div>
              <input
                type="checkbox"
                checked={pushNotifications}
                onChange={(e) => setPushNotifications(e.target.checked)}
                className="w-9 h-5 rounded-full bg-slate-200 checked:bg-indigo-500 cursor-pointer appearance-none relative transition-all duration-300 before:content-[''] before:absolute before:h-4 before:w-4 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-all checked:before:translate-x-4"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 font-heading flex items-center gap-2">
            <Sun className="h-5 w-5 text-amber-500" /> Visual Theme
          </h3>
          <div className="flex gap-4">
            <button
              onClick={() => setTheme("light")}
              className={`flex-1 py-3 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${theme === "light" ? "bg-indigo-50 border-indigo-500 text-indigo-700" : "bg-white border-border/70 text-slate-700 hover:bg-slate-50"}`}
            >
              <Sun className="h-4.5 w-4.5" /> Light Mode
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex-1 py-3 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${theme === "dark" ? "bg-indigo-50 border-indigo-500 text-indigo-700" : "bg-white border-border/70 text-slate-700 hover:bg-slate-50"}`}
            >
              <Moon className="h-4.5 w-4.5" /> Dark Mode (Mock)
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-slate-100">
          <Button onClick={handleSave} loading={saving} className="rounded-xl px-6">
            Save Preferences
          </Button>
        </div>
      </Card>
    </div>
  );
}
