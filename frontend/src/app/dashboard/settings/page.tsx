"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { ShieldCheck, Bell, Sun, Moon, Key, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export function ModernSettings({ 
  emailNotifications, 
  setEmailNotifications, 
  pushNotifications, 
  setPushNotifications, 
  theme, 
  setTheme, 
  saving, 
  onSave 
}: {
  emailNotifications: boolean;
  setEmailNotifications: (val: boolean) => void;
  pushNotifications: boolean;
  setPushNotifications: (val: boolean) => void;
  theme: string;
  setTheme: (val: string) => void;
  saving: boolean;
  onSave: () => void;
}) {
  return (
    <div className="space-y-8 text-left">
      <Card className="border border-border/40 rounded-3xl bg-white shadow-premium p-6 md:p-8 space-y-8">
        {/* Section 1: Notifications */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <Bell className="h-4.5 w-4.5 text-indigo-500" /> Notifications Preferences
          </h3>
          <p className="text-xs text-muted-foreground font-medium">Control how Dwellix sends dispatch alerts and warranty expiry logs.</p>
          
          <div className="space-y-4 divide-y divide-slate-100">
            <div className="flex justify-between items-center py-3.5">
              <div>
                <span className="text-sm font-bold text-foreground block">Email Digest Reports</span>
                <span className="text-xs text-muted-foreground block mt-0.5">Receive weekly wellness indexes and upcoming service forecasts.</span>
              </div>
              <button 
                type="button"
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`w-11 h-6 rounded-full cursor-pointer transition-colors relative ${emailNotifications ? "bg-black" : "bg-slate-200"}`}
              >
                <span className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${emailNotifications ? "translate-x-5" : ""}`} />
              </button>
            </div>

            <div className="flex justify-between items-center pt-3.5">
              <div>
                <span className="text-sm font-bold text-foreground block">Live Dispatch Push Alerts</span>
                <span className="text-xs text-muted-foreground block mt-0.5">Get real-time browser alerts as technicians change their status.</span>
              </div>
              <button 
                type="button"
                onClick={() => setPushNotifications(!pushNotifications)}
                className={`w-11 h-6 rounded-full cursor-pointer transition-colors relative ${pushNotifications ? "bg-black" : "bg-slate-200"}`}
              >
                <span className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${pushNotifications ? "translate-x-5" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Visual Styling */}
        <div className="space-y-4 pt-8 border-t border-slate-100">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <Sun className="h-4.5 w-4.5 text-amber-500" /> Interface Styling
          </h3>
          <div className="flex gap-4">
            <button
              onClick={() => setTheme("light")}
              className={`flex-1 py-3 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${theme === "light" ? "bg-black text-white border-black" : "bg-white border-border/80 text-muted-foreground hover:text-foreground"}`}
            >
              <Sun className="h-4 w-4" /> Light Mode
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex-1 py-3 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${theme === "dark" ? "bg-black text-white border-black" : "bg-white border-border/80 text-muted-foreground hover:text-foreground"}`}
            >
              <Moon className="h-4 w-4" /> Dark Mode
            </button>
          </div>
        </div>

        {/* Save Button Deck */}
        <div className="flex justify-end pt-8 border-t border-slate-100">
          <Button onClick={onSave} loading={saving} className="rounded-xl px-6 h-11 bg-black text-white hover:bg-black/90 text-xs font-semibold">
            Save Preferences
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border border-red-200/50 rounded-3xl bg-red-50/10 p-6 md:p-8 space-y-4">
        <h3 className="text-sm font-bold text-red-700 uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="h-4.5 w-4.5 text-red-600" /> Danger Zone
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-sm font-bold text-foreground block">Delete Property Account</span>
            <span className="text-xs text-muted-foreground block">Permanently erase all appliance logs, billing metrics, and active service histories.</span>
          </div>
          <Button variant="outline" className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 text-xs font-semibold h-11 self-start sm:self-center">
            Delete Profile
          </Button>
        </div>
      </Card>
    </div>
  );
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
      <div className="flex-grow p-8 space-y-6 max-w-4xl mx-auto w-full text-left">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Card className="p-8 border-border rounded-3xl bg-white space-y-6">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-2xl" />
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
        <Button onClick={fetchProfile} size="sm" className="rounded-xl">Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex-grow p-8 max-w-4xl mx-auto w-full space-y-8 relative text-left">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white px-5 py-3.5 rounded-2xl shadow-premium border border-slate-800 font-medium text-xs flex items-center gap-2">
          <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" /> {toastMessage}
        </div>
      )}

      <div>
        <Badge className="bg-primary/5 text-primary text-[10px] uppercase font-bold tracking-widest rounded-full border-none">
          Preferences
        </Badge>
        <h1 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-foreground mt-2">Settings</h1>
        <p className="text-sm text-muted-foreground font-medium">Configure your dashboard settings, notify flags, and interface themes.</p>
      </div>

      <ModernSettings 
        emailNotifications={emailNotifications}
        setEmailNotifications={setEmailNotifications}
        pushNotifications={pushNotifications}
        setPushNotifications={setPushNotifications}
        theme={theme}
        setTheme={setTheme}
        saving={saving}
        onSave={handleSave}
      />
    </div>
  );
}
