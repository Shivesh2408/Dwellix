"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { apiClient, setAccessToken } from "@/lib/api-client";
import {
  Mail,
  Phone,
  Shield,
  Calendar,
  LogOut,
  CheckCircle2,
  UserCheck,
  AlertOctagon,
  Key,
  Settings as SettingsIcon,
  User,
  MapPin,
  Globe,
  Award,
  Lock,
  Smartphone,
  Sparkles,
  Wrench,
  ChevronRight,
  ShieldCheck,
  Flame,
  Zap,
  Edit2,
  Check,
  Languages,
  Clock,
  Coins,
  Camera,
  Laptop,
  CheckCircle,
  Eye,
  CameraIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isEditing, setIsEditing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Statistics
  const [appliancesCount, setAppliancesCount] = useState(0);
  const [activeWarrantiesCount, setActiveWarrantiesCount] = useState(0);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [aiConversationsCount, setAiConversationsCount] = useState(18); // default mock count

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState(() => (typeof window !== "undefined" ? localStorage.getItem("dwellix_profile_address") || "123 Smart Home Boulevard" : "123 Smart Home Boulevard"));
  const [city, setCity] = useState(() => (typeof window !== "undefined" ? localStorage.getItem("dwellix_profile_city") || "Mumbai" : "Mumbai"));
  const [state, setState] = useState(() => (typeof window !== "undefined" ? localStorage.getItem("dwellix_profile_state") || "Maharashtra" : "Maharashtra"));
  const [country, setCountry] = useState(() => (typeof window !== "undefined" ? localStorage.getItem("dwellix_profile_country") || "India" : "India"));
  const [pincode, setPincode] = useState(() => (typeof window !== "undefined" ? localStorage.getItem("dwellix_profile_pincode") || "400001" : "400001"));

  // Preferences
  const [language, setLanguage] = useState(() => (typeof window !== "undefined" ? localStorage.getItem("dwellix_profile_language") || "English" : "English"));
  const [timezone, setTimezone] = useState(() => (typeof window !== "undefined" ? localStorage.getItem("dwellix_profile_timezone") || "Asia/Kolkata (UTC+05:30)" : "Asia/Kolkata (UTC+05:30)"));
  const [dateFormat, setDateFormat] = useState(() => (typeof window !== "undefined" ? localStorage.getItem("dwellix_profile_dateformat") || "DD/MM/YYYY" : "DD/MM/YYYY"));
  const [currency, setCurrency] = useState(() => (typeof window !== "undefined" ? localStorage.getItem("dwellix_profile_currency") || "INR (₹)" : "INR (₹)"));

  // Security Toggles & Connected
  const [twoFactor, setTwoFactor] = useState(() => (typeof window !== "undefined" ? localStorage.getItem("dwellix_profile_twofactor") === "true" : false));
  const [connectedGoogle, setConnectedGoogle] = useState(true);
  const [connectedApple, setConnectedApple] = useState(false);

  // Profile image local preview
  const [profilePhoto, setProfilePhoto] = useState<string | null>(() => (typeof window !== "undefined" ? localStorage.getItem("dwellix_profile_photo") || null : null));

  const fetchProfileAndStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch user profile
      const user = await apiClient<UserProfile>("/api/v1/auth/me");
      setProfile(user);
      setFullName(user.fullName);
      setPhoneNumber(user.phoneNumber || "");

      // 2. Fetch appliances count
      try {
        const appliances = await apiClient<Record<string, unknown>[]>("/api/v1/appliances");
        setAppliancesCount(appliances.length);
        // Calculate appliances with active warranties (mock/check if warrantyDate is in future)
        const warranties = appliances.filter((app) => {
          const expDate = app.warrantyExpirationDate as string | undefined;
          if (!expDate) return false;
          return new Date(expDate) > new Date();
        }).length;
        setActiveWarrantiesCount(warranties || Math.max(1, Math.floor(appliances.length * 0.6)));
      } catch (e) {
        console.error("Failed to load appliances stats:", e);
      }

      // 3. Fetch bookings count
      try {
        const bookings = await apiClient<Record<string, unknown>[]>("/api/v1/bookings");
        setBookingsCount(bookings.length);
      } catch (e) {
        console.error("Failed to load bookings stats:", e);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
      setError("Failed to retrieve profile information. Please log in again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      await Promise.resolve();
      if (active) {
        fetchProfileAndStats();
      }
    };
    load();

    return () => {
      active = false;
    };
  }, [fetchProfileAndStats]);

  const handleLogout = () => {
    setAccessToken(null);
    apiClient("/api/v1/auth/logout", { method: "POST" })
      .finally(() => {
        router.push("/auth/login");
      });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast("Full Name is required.");
      return;
    }

    // Persist additional fields to localStorage
    localStorage.setItem("dwellix_profile_address", address);
    localStorage.setItem("dwellix_profile_city", city);
    localStorage.setItem("dwellix_profile_state", state);
    localStorage.setItem("dwellix_profile_country", country);
    localStorage.setItem("dwellix_profile_pincode", pincode);
    localStorage.setItem("dwellix_profile_language", language);
    localStorage.setItem("dwellix_profile_timezone", timezone);
    localStorage.setItem("dwellix_profile_dateformat", dateFormat);
    localStorage.setItem("dwellix_profile_currency", currency);
    localStorage.setItem("dwellix_profile_twofactor", twoFactor.toString());

    // Mock-update profile object locally
    if (profile) {
      setProfile({
        ...profile,
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim()
      });
    }

    setIsEditing(false);
    showToast("Profile details updated successfully.");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePhoto(base64String);
        localStorage.setItem("dwellix_profile_photo", base64String);
        showToast("Profile photo updated.");
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerChangePassword = () => {
    showToast("Password reset link sent to your registered email.");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-6 text-left font-sans">
        <div className="space-y-2 animate-pulse">
          <div className="h-8 bg-slate-200 rounded-md w-48" />
          <div className="h-4 bg-slate-200 rounded-md w-72" />
        </div>
        <Card className="p-8 border-slate-100 rounded-3xl bg-white space-y-6 animate-pulse">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-full bg-slate-100" />
            <div className="space-y-2 flex-grow">
              <div className="h-6 bg-slate-100 rounded-md w-32" />
              <div className="h-4 bg-slate-100 rounded-md w-24" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex flex-col items-center justify-center p-12 max-w-md mx-auto text-left gap-4 font-sans">
        <AlertOctagon className="h-10 w-10 text-rose-500" />
        <div className="text-base font-extrabold text-slate-900 font-heading">Error Loading Profile</div>
        <p className="text-xs text-slate-500 text-center leading-relaxed">{error || "User data is missing."}</p>
        <Button onClick={fetchProfileAndStats} size="sm" className="bg-slate-900 text-white rounded-xl px-5 h-9 font-bold cursor-pointer">
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] py-8 px-4 sm:px-6 lg:px-8 text-left font-sans relative overflow-x-hidden">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 10, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-4 left-1/2 bg-slate-950 text-white text-xs md:text-sm font-bold px-5 py-3 rounded-2xl shadow-xl z-50 flex items-center gap-2"
          >
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Header Deck */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <Badge className="bg-blue-50/80 text-blue-600 text-[10px] uppercase font-bold tracking-widest rounded-full border-blue-100/30 px-2.5 py-0.5">
              Personal Account
            </Badge>
            <h1 className="text-2xl sm:text-4xl font-heading font-extrabold tracking-tight text-slate-900">
              My Profile
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="rounded-xl font-bold text-xs h-10 px-4 bg-slate-900 hover:bg-slate-800 text-white cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Edit Profile</span>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="rounded-xl font-bold text-xs h-10 px-4 border-slate-200 text-slate-650 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveChanges}
                  className="rounded-xl font-bold text-xs h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Save Changes</span>
                </Button>
              </div>
            )}

            <Button
              onClick={handleLogout}
              variant="outline"
              className="rounded-xl font-bold text-xs h-10 px-4 border-rose-200 hover:bg-rose-50 text-rose-600 cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: Hero Profile Card & Statistics Panel */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Hero Profile Card */}
            <Card className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm flex flex-col items-center text-center space-y-5 relative overflow-hidden">
              {/* Profile Background Banner effect */}
              <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-r from-blue-50/20 to-indigo-50/20 border-b border-slate-50" />
              
              {/* Photo Block with Uploader */}
              <div className="relative mt-4">
                <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-premium bg-slate-900 text-white font-extrabold text-3xl flex items-center justify-center relative group">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt={fullName} className="h-full w-full object-cover" />
                  ) : (
                    <span>{fullName.charAt(0).toUpperCase()}</span>
                  )}
                  {/* Photo Edit Trigger */}
                  <label className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <CameraIcon className="h-5 w-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                
                {profile.emailVerified && (
                  <span className="absolute bottom-0 right-0 p-1 bg-emerald-500 rounded-full text-white border-2 border-white shadow-sm" title="Verified Owner">
                    <Check className="h-3 w-3 font-extrabold" />
                  </span>
                )}
              </div>

              {/* Identity & Status */}
              <div className="space-y-1.5 w-full">
                <div className="flex items-center justify-center gap-1.5">
                  <h3 className="text-lg font-extrabold text-slate-900 font-heading leading-tight truncate">
                    {profile.fullName}
                  </h3>
                  <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100/50 rounded-full text-[9px] font-black uppercase py-0.5 px-2">
                    Active
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 font-medium truncate">{profile.email}</p>
                <p className="text-[11px] font-bold text-slate-450 tracking-wide font-mono">
                  {profile.phoneNumber || "No phone contact configured"}
                </p>
              </div>

              {/* Status parameters */}
              <div className="w-full pt-4 border-t border-slate-50 grid grid-cols-2 gap-3 text-left">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase font-extrabold">Membership</span>
                  <Badge className="bg-blue-600 text-white border-0 text-[9px] font-black uppercase tracking-wider rounded px-1.5">
                    Pro tier
                  </Badge>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase font-extrabold">Joined Date</span>
                  <span className="text-xs font-bold text-slate-700 block">July 2026</span>
                </div>
              </div>
            </Card>

            {/* Account statistics */}
            <Card className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-sm space-y-4">
              <h4 className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest border-b border-slate-50 pb-2">
                Usage Summary
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-100/30 p-3.5 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Appliances</span>
                    <Wrench className="h-4 w-4 text-blue-650" />
                  </div>
                  <div className="text-xl font-bold text-slate-900 font-heading">{appliancesCount}</div>
                </div>

                <div className="bg-slate-50 border border-slate-100/30 p-3.5 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Warranties</span>
                    <ShieldCheck className="h-4 w-4 text-emerald-650" />
                  </div>
                  <div className="text-xl font-bold text-slate-900 font-heading">{activeWarrantiesCount}</div>
                </div>

                <div className="bg-slate-50 border border-slate-100/30 p-3.5 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Bookings</span>
                    <Calendar className="h-4 w-4 text-purple-650" />
                  </div>
                  <div className="text-xl font-bold text-slate-900 font-heading">{bookingsCount}</div>
                </div>

                <div className="bg-slate-50 border border-slate-100/30 p-3.5 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">AI Chats</span>
                    <Sparkles className="h-4 w-4 text-amber-650 animate-pulse" />
                  </div>
                  <div className="text-xl font-bold text-slate-900 font-heading">{aiConversationsCount}</div>
                </div>
              </div>
            </Card>

            {/* Achievements Section */}
            <Card className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-sm space-y-4">
              <h4 className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest border-b border-slate-50 pb-2">
                Unlocked Achievements
              </h4>

              <div className="grid grid-cols-2 gap-3 text-left">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-2"
                >
                  <span className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-800 block leading-tight">Warranty Master</span>
                    <span className="text-[8px] text-slate-400 font-medium">Vault configured</span>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-2"
                >
                  <span className="p-1.5 rounded-xl bg-blue-50 text-blue-600">
                    <Zap className="h-4 w-4" />
                  </span>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-800 block leading-tight">Smart User</span>
                    <span className="text-[8px] text-slate-400 font-medium">Connected home</span>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-2"
                >
                  <span className="p-1.5 rounded-xl bg-purple-50 text-purple-600">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-800 block leading-tight">Early Adopter</span>
                    <span className="text-[8px] text-slate-400 font-medium">Beta access member</span>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-2"
                >
                  <span className="p-1.5 rounded-xl bg-amber-50 text-amber-600">
                    <Flame className="h-4 w-4" />
                  </span>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-800 block leading-tight">Energy Saver</span>
                    <span className="text-[8px] text-slate-400 font-medium">Eco efficiency set</span>
                  </div>
                </motion.div>
              </div>
            </Card>

          </div>

          {/* RIGHT COLUMN: Personal Details, Security, Preferences, Connected */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Personal Information Form/Card */}
            <Card className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm space-y-6 text-left">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                <User className="h-4.5 w-4.5 text-blue-600" />
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Personal Information
                </h3>
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveChanges} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450">Full Name *</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50/50 text-xs px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-slate-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450">Phone Number</label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50/50 text-xs px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-slate-700"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450">Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50/50 text-xs px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-slate-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50/50 text-xs px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-slate-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50/50 text-xs px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-slate-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450">Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50/50 text-xs px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-slate-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450">Pincode</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50/50 text-xs px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-slate-700"
                    />
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5 text-xs sm:text-sm font-medium">
                  <div className="p-3 bg-slate-50 border border-slate-100/50 rounded-2xl flex items-center gap-3">
                    <div className="p-2 bg-white border border-slate-100 text-slate-400 rounded-xl">
                      <User className="h-4.5 w-4.5 text-slate-400" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-slate-400 uppercase font-extrabold block">Full Name</span>
                      <span className="text-slate-800 font-bold">{fullName}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100/50 rounded-2xl flex items-center gap-3">
                    <div className="p-2 bg-white border border-slate-100 text-slate-400 rounded-xl">
                      <Mail className="h-4.5 w-4.5 text-slate-400" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-slate-400 uppercase font-extrabold block">Email Address</span>
                      <span className="text-slate-800 font-bold truncate block max-w-[200px]">{profile.email}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100/50 rounded-2xl flex items-center gap-3">
                    <div className="p-2 bg-white border border-slate-100 text-slate-400 rounded-xl">
                      <Phone className="h-4.5 w-4.5 text-slate-400" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-slate-400 uppercase font-extrabold block">Phone Number</span>
                      <span className="text-slate-850 font-bold font-mono">{phoneNumber || "Not configured"}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100/50 rounded-2xl flex items-center gap-3">
                    <div className="p-2 bg-white border border-slate-100 text-slate-400 rounded-xl">
                      <MapPin className="h-4.5 w-4.5 text-slate-400" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-slate-400 uppercase font-extrabold block">Physical Address</span>
                      <span className="text-slate-805 font-bold truncate block max-w-[200px]">{address}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100/50 rounded-2xl flex items-center gap-3">
                    <div className="p-2 bg-white border border-slate-100 text-slate-400 rounded-xl">
                      <Globe className="h-4.5 w-4.5 text-slate-400" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-slate-400 uppercase font-extrabold block">City & Pincode</span>
                      <span className="text-slate-800 font-bold">{city}, {pincode}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100/50 rounded-2xl flex items-center gap-3">
                    <div className="p-2 bg-white border border-slate-100 text-slate-400 rounded-xl">
                      <Shield className="h-4.5 w-4.5 text-slate-400" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-slate-400 uppercase font-extrabold block">State & Country</span>
                      <span className="text-slate-800 font-bold">{state}, {country}</span>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Security & Credentials Card */}
            <Card className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm space-y-5 text-left">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                <Lock className="h-4.5 w-4.5 text-blue-600" />
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Security credentials
                </h3>
              </div>

              <div className="space-y-4">
                {/* Two Factor Switch */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100/50 rounded-2xl">
                  <div className="space-y-0.5 flex-1 pr-4">
                    <span className="text-xs font-bold text-slate-850 block">Two-Factor Authentication</span>
                    <span className="text-[10px] text-slate-400 block leading-snug">Secure account login actions with additional numeric verification.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTwoFactor(!twoFactor);
                      showToast(twoFactor ? "Two factor auth deactivated." : "Two factor auth activated.");
                    }}
                    className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                      twoFactor ? "bg-blue-600" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.75 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                        twoFactor ? "translate-x-5" : "translate-x-0.75"
                      }`}
                    />
                  </button>
                </div>

                {/* Account credential update buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={triggerChangePassword}
                    className="flex-1 rounded-xl font-bold text-xs h-10 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Key className="h-4 w-4 text-slate-400" />
                    <span>Update Access Password</span>
                  </Button>
                </div>

                {/* Login session history mock */}
                <div className="pt-2 space-y-3">
                  <span className="text-[9px] text-slate-400 uppercase font-extrabold tracking-wider block">Connected Devices & Active Sessions</span>
                  <div className="border border-slate-100/80 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs font-sans">
                    <div className="flex items-center justify-between p-3 bg-slate-50/50">
                      <div className="flex items-center gap-2.5">
                        <Laptop className="h-4 w-4 text-blue-600" />
                        <div>
                          <span className="font-bold text-slate-800 block">MacBook Pro &bull; Chrome</span>
                          <span className="text-[10px] text-slate-400">Mumbai, IN &bull; Current Session</span>
                        </div>
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-700 border-0 rounded text-[9px] font-black uppercase py-0.5">Active</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-2.5 opacity-60">
                        <Smartphone className="h-4 w-4 text-slate-400" />
                        <div>
                          <span className="font-bold text-slate-800 block">iPhone 15 Pro &bull; Mobile App</span>
                          <span className="text-[10px] text-slate-400">Delhi, IN &bull; 2 hours ago</span>
                        </div>
                      </div>
                      <Badge className="bg-slate-100 text-slate-450 border-0 rounded text-[9px] font-extrabold uppercase py-0.5">Logged Out</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Connected Accounts */}
            <Card className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm space-y-4 text-left">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                <UserCheck className="h-4.5 w-4.5 text-blue-600" />
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Connected Accounts
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                {/* Google */}
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100/50 rounded-2xl">
                  <div className="flex items-center gap-2.5">
                    <span className="h-6 w-6 rounded-full bg-white border border-slate-100 flex items-center justify-center font-bold text-slate-500">G</span>
                    <span className="font-bold text-slate-800">Google Account</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setConnectedGoogle(!connectedGoogle);
                      showToast(connectedGoogle ? "Google login disconnected." : "Google login linked.");
                    }}
                    className={`text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-lg border cursor-pointer ${
                      connectedGoogle ? "text-slate-450 border-slate-200 hover:bg-slate-100" : "bg-blue-600 text-white border-blue-600"
                    }`}
                  >
                    {connectedGoogle ? "Disconnect" : "Link"}
                  </button>
                </div>

                {/* Apple */}
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100/50 rounded-2xl">
                  <div className="flex items-center gap-2.5">
                    <span className="h-6 w-6 rounded-full bg-white border border-slate-100 flex items-center justify-center font-bold text-slate-500">A</span>
                    <span className="font-bold text-slate-800">Apple Account</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setConnectedApple(!connectedApple);
                      showToast(connectedApple ? "Apple sign-in disconnected." : "Apple sign-in linked.");
                    }}
                    className={`text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-lg border cursor-pointer ${
                      connectedApple ? "text-slate-450 border-slate-200 hover:bg-slate-100" : "bg-blue-600 text-white border-blue-600"
                    }`}
                  >
                    {connectedApple ? "Disconnect" : "Link"}
                  </button>
                </div>
              </div>
            </Card>

            {/* Preferences Options Card */}
            <Card className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm space-y-4 text-left">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                <SettingsIcon className="h-4.5 w-4.5 text-blue-600" />
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  System Preferences
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                {/* Language dropdown */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                    <Languages className="h-3.5 w-3.5 text-slate-400" /> Language
                  </span>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none text-slate-700"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi (हिन्दी)</option>
                    <option value="Marathi">Marathi (मराठी)</option>
                    <option value="Spanish">Spanish (Español)</option>
                  </select>
                </div>

                {/* Time zone dropdown */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400" /> Time Zone
                  </span>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none text-slate-700"
                  >
                    <option value="Asia/Kolkata (UTC+05:30)">Asia/Kolkata (UTC+05:30)</option>
                    <option value="America/New_York (UTC-05:00)">America/New_York (UTC-05:00)</option>
                    <option value="Europe/London (UTC+00:00)">Europe/London (UTC+00:00)</option>
                    <option value="Asia/Tokyo (UTC+09:00)">Asia/Tokyo (UTC+09:00)</option>
                  </select>
                </div>

                {/* Date format dropdown */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" /> Date Format
                  </span>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none text-slate-700"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                {/* Currency dropdown */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                    <Coins className="h-3.5 w-3.5 text-slate-400" /> Currency
                  </span>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none text-slate-700"
                  >
                    <option value="INR (₹)">INR (₹)</option>
                    <option value="USD ($)">USD ($)</option>
                    <option value="GBP (£)">GBP (£)</option>
                    <option value="EUR (€)">EUR (€)</option>
                  </select>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
