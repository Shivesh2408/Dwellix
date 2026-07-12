"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import {
  ShieldCheck,
  Bell,
  Sun,
  Moon,
  Key,
  ShieldAlert,
  Search,
  User,
  Mail,
  Phone,
  Layout,
  Languages,
  Sliders,
  Sparkles,
  Share2,
  Database,
  Activity,
  HardDrive,
  Lock,
  Check,
  AlertTriangle,
  Globe,
  Calendar,
  DollarSign,
  Cloud,
  MessageSquare,
  Settings,
  Laptop,
  CheckCircle,
  FileText,
  Clock,
  X,
  CreditCard,
  AlertOctagon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

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
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active section in sidebar
  const [activeSection, setActiveSection] = useState("Account");
  const [searchQuery, setSearchQuery] = useState("");

  // States for Settings (using existing and extra requested sections)
  // Section 1: Account
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Section 2: Appearance
  const [accentColor, setAccentColor] = useState("blue");
  const [density, setDensity] = useState("comfortable");
  const [fontSize, setFontSize] = useState("medium");

  // Section 3: Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [warrantyAlerts, setWarrantyAlerts] = useState(true);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState(true);
  const [bookingAlerts, setBookingAlerts] = useState(true);
  const [aiRecommendations, setAiRecommendations] = useState(true);

  // Section 4: Security
  const [twoFactor, setTwoFactor] = useState(false);

  // Section 6: AI Settings
  const [aiPersonality, setAiPersonality] = useState("helpful");
  const [responseLength, setResponseLength] = useState("medium");
  const [smartSuggestions, setSmartSuggestions] = useState(true);
  const [autoMaintenance, setAutoMaintenance] = useState(true);
  const [applianceMonitoring, setApplianceMonitoring] = useState(true);

  // Section 7: Integrations
  const [integrationGoogle, setIntegrationGoogle] = useState(true);
  const [integrationCloudinary, setIntegrationCloudinary] = useState(true);
  const [integrationCalendar, setIntegrationCalendar] = useState(false);
  const [integrationEmail, setIntegrationEmail] = useState(true);
  const [integrationWhatsApp, setIntegrationWhatsApp] = useState(false);

  // Section 8: Language & Region
  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("Asia/Kolkata (UTC+05:30)");
  const [currency, setCurrency] = useState("INR (₹)");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");

  // Fetch initial profile data
  const fetchProfile = useCallback(() => {
    setLoading(true);
    setError(null);
    apiClient<UserProfile>("/api/v1/auth/me")
      .then((data) => {
        setProfile(data);
        setFullName(data.fullName);
        setEmail(data.email);
      })
      .catch((err) => {
        console.error("Failed to load settings profile:", err);
        setError("Could not load user metadata. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let active = true;
    const init = async () => {
      await Promise.resolve();
      if (!active) return;

      fetchProfile();

      // Cache retrieval to persist settings locally
      const cachedPhone = localStorage.getItem("dwellix_settings_phone");
      const cachedAccent = localStorage.getItem("dwellix_settings_accent");
      const cachedDensity = localStorage.getItem("dwellix_settings_density");
      const cachedFont = localStorage.getItem("dwellix_settings_font");
      const cachedSMS = localStorage.getItem("dwellix_settings_sms");
      const cachedWarranty = localStorage.getItem("dwellix_settings_warranty");
      const cachedMaint = localStorage.getItem("dwellix_settings_maint");
      const cachedBook = localStorage.getItem("dwellix_settings_book");
      const cachedAIRecommendations = localStorage.getItem("dwellix_settings_airec");
      const cached2FA = localStorage.getItem("dwellix_settings_2fa");
      const cachedPersonality = localStorage.getItem("dwellix_settings_aipersonality");
      const cachedLength = localStorage.getItem("dwellix_settings_ailength");
      const cachedSuggestions = localStorage.getItem("dwellix_settings_aisuggestions");
      const cachedAutoMaint = localStorage.getItem("dwellix_settings_auto_maint");
      const cachedMonitoring = localStorage.getItem("dwellix_settings_monitoring");
      const cachedGoogle = localStorage.getItem("dwellix_settings_google");
      const cachedCloudinary = localStorage.getItem("dwellix_settings_cloudinary");
      const cachedCalendar = localStorage.getItem("dwellix_settings_calendar");
      const cachedEmail = localStorage.getItem("dwellix_settings_email");
      const cachedWhatsApp = localStorage.getItem("dwellix_settings_whatsapp");
      const cachedLang = localStorage.getItem("dwellix_settings_lang");
      const cachedTz = localStorage.getItem("dwellix_settings_tz");
      const cachedCurrency = localStorage.getItem("dwellix_settings_currency");
      const cachedDateFormat = localStorage.getItem("dwellix_settings_dateformat");

      if (cachedPhone) setPhone(cachedPhone);
      if (cachedAccent) setAccentColor(cachedAccent);
      if (cachedDensity) setDensity(cachedDensity);
      if (cachedFont) setFontSize(cachedFont);
      if (cachedSMS) setSmsNotifications(cachedSMS === "true");
      if (cachedWarranty) setWarrantyAlerts(cachedWarranty === "true");
      if (cachedMaint) setMaintenanceAlerts(cachedMaint === "true");
      if (cachedBook) setBookingAlerts(cachedBook === "true");
      if (cachedAIRecommendations) setAiRecommendations(cachedAIRecommendations === "true");
      if (cached2FA) setTwoFactor(cached2FA === "true");
      if (cachedPersonality) setAiPersonality(cachedPersonality);
      if (cachedLength) setResponseLength(cachedLength);
      if (cachedSuggestions) setSmartSuggestions(cachedSuggestions === "true");
      if (cachedAutoMaint) setAutoMaintenance(cachedAutoMaint === "true");
      if (cachedMonitoring) setApplianceMonitoring(cachedMonitoring === "true");
      if (cachedGoogle) setIntegrationGoogle(cachedGoogle === "true");
      if (cachedCloudinary) setIntegrationCloudinary(cachedCloudinary === "true");
      if (cachedCalendar) setIntegrationCalendar(cachedCalendar === "true");
      if (cachedEmail) setIntegrationEmail(cachedEmail === "true");
      if (cachedWhatsApp) setIntegrationWhatsApp(cachedWhatsApp === "true");
      if (cachedLang) setLanguage(cachedLang);
      if (cachedTz) setTimezone(cachedTz);
      if (cachedCurrency) setCurrency(cachedCurrency);
      if (cachedDateFormat) setDateFormat(cachedDateFormat);
    };
    init();
    return () => {
      active = false;
    };
  }, [fetchProfile]);

  const handleSave = () => {
    setSaving(true);

    // Save variables to localStorage
    localStorage.setItem("dwellix_settings_phone", phone);
    localStorage.setItem("dwellix_settings_accent", accentColor);
    localStorage.setItem("dwellix_settings_density", density);
    localStorage.setItem("dwellix_settings_font", fontSize);
    localStorage.setItem("dwellix_settings_sms", smsNotifications.toString());
    localStorage.setItem("dwellix_settings_warranty", warrantyAlerts.toString());
    localStorage.setItem("dwellix_settings_maint", maintenanceAlerts.toString());
    localStorage.setItem("dwellix_settings_book", bookingAlerts.toString());
    localStorage.setItem("dwellix_settings_airec", aiRecommendations.toString());
    localStorage.setItem("dwellix_settings_2fa", twoFactor.toString());
    localStorage.setItem("dwellix_settings_aipersonality", aiPersonality);
    localStorage.setItem("dwellix_settings_ailength", responseLength);
    localStorage.setItem("dwellix_settings_aisuggestions", smartSuggestions.toString());
    localStorage.setItem("dwellix_settings_auto_maint", autoMaintenance.toString());
    localStorage.setItem("dwellix_settings_monitoring", applianceMonitoring.toString());
    localStorage.setItem("dwellix_settings_google", integrationGoogle.toString());
    localStorage.setItem("dwellix_settings_cloudinary", integrationCloudinary.toString());
    localStorage.setItem("dwellix_settings_calendar", integrationCalendar.toString());
    localStorage.setItem("dwellix_settings_email", integrationEmail.toString());
    localStorage.setItem("dwellix_settings_whatsapp", integrationWhatsApp.toString());
    localStorage.setItem("dwellix_settings_lang", language);
    localStorage.setItem("dwellix_settings_tz", timezone);
    localStorage.setItem("dwellix_settings_currency", currency);
    localStorage.setItem("dwellix_settings_dateformat", dateFormat);

    setTimeout(() => {
      setSaving(false);
      setToastMessage("Settings updated successfully.");
      setTimeout(() => setToastMessage(null), 3000);
    }, 800);
  };

  // Sections navigation configurations
  const sectionsList = [
    { name: "Account", icon: <User className="h-4 w-4" /> },
    { name: "Appearance", icon: <Layout className="h-4 w-4" /> },
    { name: "Notifications", icon: <Bell className="h-4 w-4" /> },
    { name: "Security", icon: <Lock className="h-4 w-4" /> },
    { name: "Privacy", icon: <ShieldCheck className="h-4 w-4" /> },
    { name: "AI Settings", icon: <Sparkles className="h-4 w-4" /> },
    { name: "Integrations", icon: <Share2 className="h-4 w-4" /> },
    { name: "Language & Region", icon: <Globe className="h-4 w-4" /> },
    { name: "Storage", icon: <HardDrive className="h-4 w-4" /> },
    { name: "Danger Zone", icon: <ShieldAlert className="h-4 w-4 text-red-500" /> }
  ];

  // Search filter across sidebar sections
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sectionsList;
    const q = searchQuery.toLowerCase();
    return sectionsList.filter(
      (sec) => sec.name.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      await Promise.resolve();
      if (!active) return;
      // If active section is no longer visible in filtered list, reset active selection
      if (filteredSections.length > 0 && !filteredSections.find(s => s.name === activeSection)) {
        setActiveSection(filteredSections[0].name);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [filteredSections, activeSection]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-6 text-left font-sans">
        <div className="space-y-2 animate-pulse">
          <div className="h-8 bg-slate-200 rounded-md w-48" />
          <div className="h-4 bg-slate-200 rounded-md w-72" />
        </div>
        <Card className="p-8 border-slate-100 rounded-3xl bg-white space-y-6 animate-pulse">
          <div className="h-6 bg-slate-150 rounded w-1/4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-slate-100 rounded-2xl w-full" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-12 max-w-md mx-auto text-left gap-4 font-sans">
        <AlertOctagon className="h-10 w-10 text-rose-500" />
        <div className="text-base font-extrabold text-foreground font-heading">Error Loading Settings</div>
        <p className="text-xs text-slate-500 text-center leading-relaxed">{error}</p>
        <Button onClick={fetchProfile} size="sm" className="bg-slate-900 text-white rounded-xl px-5 h-9 font-bold cursor-pointer">
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 text-left font-sans relative overflow-hidden">
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
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <Badge className="bg-primary-soft/80 text-primary text-[10px] uppercase font-bold tracking-widest rounded-full border-primary/20/30 px-2.5 py-0.5">
              Dashboard Config
            </Badge>
            <h1 className="text-2xl sm:text-4xl font-heading font-extrabold tracking-tight text-foreground">
              Settings
            </h1>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl font-bold text-xs h-10 px-5 bg-primary hover:bg-primary-hover text-white cursor-pointer transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            {saving ? (
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </span>
            ) : (
              <>
                <Check className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>

        {/* macOS Two-Column Panel Layout */}
        <div className="grid grid-cols-1 md:grid-cols-10 gap-6 items-start">
          
          {/* LEFT COLUMN: macOS Sidebar Selection Pane (3 Columns) */}
          <div className="md:col-span-3 space-y-4">
            
            {/* Search Settings Card */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search settings..."
                className="pl-9 h-10 rounded-2xl border-slate-150 focus:ring-primary focus:border-primary text-xs sm:text-sm bg-white"
              />
            </div>

            {/* Sidebar List */}
            <Card className="bg-white border border-border rounded-[24px] p-2.5 shadow-sm space-y-1.5">
              {filteredSections.map((sec) => {
                const isActive = activeSection === sec.name;
                return (
                  <button
                    key={sec.name}
                    type="button"
                    onClick={() => setActiveSection(sec.name)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-slate-950 text-white font-extrabold shadow-sm"
                        : "text-slate-650 hover:bg-slate-50"
                    }`}
                  >
                    <span className={isActive ? "text-white" : "text-slate-400"}>
                      {sec.icon}
                    </span>
                    <span>{sec.name}</span>
                  </button>
                );
              })}
            </Card>
          </div>

          {/* RIGHT COLUMN: Tab Panel Configuration Options (7 Columns) */}
          <div className="md:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                
                {/* 1. Account Settings */}
                {activeSection === "Account" && (
                  <Card className="bg-white border border-border rounded-[24px] p-6 shadow-sm space-y-6">
                    <div className="border-b border-slate-50 pb-3 flex items-center gap-2">
                      <User className="h-4.5 w-4.5 text-primary" />
                      <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">Account details</h3>
                    </div>

                    {/* Photo upload row */}
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full overflow-hidden bg-slate-900 text-white font-bold text-xl flex items-center justify-center border-2 border-slate-200">
                        {fullName ? fullName.charAt(0).toUpperCase() : "?"}
                      </div>
                      <div className="space-y-1 text-left">
                        <span className="text-xs font-bold text-slate-700 block">Avatar Photo</span>
                        <p className="text-[10px] text-slate-400 leading-none">Upload PNG, JPEG formats.</p>
                        <Button size="sm" variant="outline" className="h-7 text-[10px] font-bold rounded-lg border-slate-200 mt-1 cursor-pointer">
                          Change photo
                        </Button>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Full Name *</label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50/50 text-xs px-3 focus:outline-none focus:ring-1 focus:ring-primary font-semibold text-slate-750"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Email Address *</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50/50 text-xs px-3 focus:outline-none focus:ring-1 focus:ring-primary font-semibold text-slate-750"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Phone Contact</label>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. 9876543210"
                          className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50/50 text-xs px-3 focus:outline-none focus:ring-1 focus:ring-primary font-semibold text-slate-750"
                        />
                      </div>
                    </div>
                  </Card>
                )}

                {/* 2. Appearance Config */}
                {activeSection === "Appearance" && (
                  <Card className="bg-white border border-border rounded-[24px] p-6 shadow-sm space-y-6">
                    <div className="border-b border-slate-50 pb-3 flex items-center gap-2">
                      <Layout className="h-4.5 w-4.5 text-primary" />
                      <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">Interface appearance</h3>
                    </div>

                    {/* Accent Colors */}
                    <div className="space-y-2 pt-2 border-t border-slate-50">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Accent Color</span>
                      <div className="flex gap-2.5">
                        {["blue", "indigo", "purple", "emerald", "rose"].map((color) => {
                          const isSelected = accentColor === color;
                          const bgMap: { [key: string]: string } = {
                            blue: "bg-primary-soft0",
                            indigo: "bg-primary-soft0",
                            purple: "bg-purple-500",
                            emerald: "bg-emerald-500",
                            rose: "bg-rose-500"
                          };
                          return (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setAccentColor(color)}
                              className={`w-7 h-7 rounded-full ${bgMap[color]} relative flex items-center justify-center border border-white shadow-sm cursor-pointer`}
                              title={color}
                            >
                              {isSelected && <Check className="h-3.5 w-3.5 text-white font-extrabold" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Density and Font Size */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 text-xs">
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">UI Density</span>
                        <select
                          value={density}
                          onChange={(e) => setDensity(e.target.value)}
                          className="w-full h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none text-slate-700 cursor-pointer"
                        >
                          <option value="comfortable">Comfortable</option>
                          <option value="compact">Compact</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Font Size</span>
                        <select
                          value={fontSize}
                          onChange={(e) => setFontSize(e.target.value)}
                          className="w-full h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none text-slate-700 cursor-pointer"
                        >
                          <option value="small">Small (13px)</option>
                          <option value="medium">Medium (14px)</option>
                          <option value="large">Large (16px)</option>
                        </select>
                      </div>
                    </div>
                  </Card>
                )}

                {/* 3. Notifications Config */}
                {activeSection === "Notifications" && (
                  <Card className="bg-white border border-border rounded-[24px] p-6 shadow-sm space-y-5">
                    <div className="border-b border-slate-50 pb-3 flex items-center gap-2">
                      <Bell className="h-4.5 w-4.5 text-primary" />
                      <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">Dispatch & alerts channels</h3>
                    </div>

                    {/* Toggle deck */}
                    <div className="space-y-4 divide-y divide-slate-50 text-xs sm:text-sm">
                      {/* Email notifications */}
                      <div className="flex justify-between items-center py-2.5">
                        <div className="space-y-0.5 text-left">
                          <span className="font-bold text-slate-800 block">Email digests</span>
                          <span className="text-[10px] text-slate-400 block">Receive weekly repair indexes and reports.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEmailNotifications(!emailNotifications)}
                          className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                            emailNotifications ? "bg-primary" : "bg-slate-200"
                          }`}
                        >
                          <span className={`absolute top-0.75 w-4 h-4 rounded-full bg-white shadow transition-transform ${emailNotifications ? "translate-x-5" : "translate-x-0.75"}`} />
                        </button>
                      </div>

                      {/* Push notifications */}
                      <div className="flex justify-between items-center pt-3.5 pb-2.5">
                        <div className="space-y-0.5 text-left">
                          <span className="font-bold text-slate-800 block">Browser Push notifications</span>
                          <span className="text-[10px] text-slate-400 block">Instant alerts inside your browser view.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPushNotifications(!pushNotifications)}
                          className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                            pushNotifications ? "bg-primary" : "bg-slate-200"
                          }`}
                        >
                          <span className={`absolute top-0.75 w-4 h-4 rounded-full bg-white shadow transition-transform ${pushNotifications ? "translate-x-5" : "translate-x-0.75"}`} />
                        </button>
                      </div>

                      {/* SMS notifications */}
                      <div className="flex justify-between items-center pt-3.5 pb-2.5">
                        <div className="space-y-0.5 text-left">
                          <span className="font-bold text-slate-800 block">SMS text alerts</span>
                          <span className="text-[10px] text-slate-400 block">Receive mobile verification key codes.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSmsNotifications(!smsNotifications)}
                          className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                            smsNotifications ? "bg-primary" : "bg-slate-200"
                          }`}
                        >
                          <span className={`absolute top-0.75 w-4 h-4 rounded-full bg-white shadow transition-transform ${smsNotifications ? "translate-x-5" : "translate-x-0.75"}`} />
                        </button>
                      </div>

                      {/* Warranty Alerts */}
                      <div className="flex justify-between items-center pt-3.5 pb-2.5">
                        <div className="space-y-0.5 text-left">
                          <span className="font-bold text-slate-800 block">Warranty Expire Warnings</span>
                          <span className="text-[10px] text-slate-400 block">Alerts before warranties elapse.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setWarrantyAlerts(!warrantyAlerts)}
                          className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                            warrantyAlerts ? "bg-primary" : "bg-slate-200"
                          }`}
                        >
                          <span className={`absolute top-0.75 w-4 h-4 rounded-full bg-white shadow transition-transform ${warrantyAlerts ? "translate-x-5" : "translate-x-0.75"}`} />
                        </button>
                      </div>

                      {/* Maintenance Alerts */}
                      <div className="flex justify-between items-center pt-3.5 pb-2.5">
                        <div className="space-y-0.5 text-left">
                          <span className="font-bold text-slate-800 block">Maintenance Schedules</span>
                          <span className="text-[10px] text-slate-400 block">Filter upcoming cleanup checkups alerts.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setMaintenanceAlerts(!maintenanceAlerts)}
                          className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                            maintenanceAlerts ? "bg-primary" : "bg-slate-200"
                          }`}
                        >
                          <span className={`absolute top-0.75 w-4 h-4 rounded-full bg-white shadow transition-transform ${maintenanceAlerts ? "translate-x-5" : "translate-x-0.75"}`} />
                        </button>
                      </div>

                      {/* Booking Alerts */}
                      <div className="flex justify-between items-center pt-3.5 pb-2.5">
                        <div className="space-y-0.5 text-left">
                          <span className="font-bold text-slate-800 block">Booking Dispatch Updates</span>
                          <span className="text-[10px] text-slate-400 block">Realtime tech assignments and status updates.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setBookingAlerts(!bookingAlerts)}
                          className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                            bookingAlerts ? "bg-primary" : "bg-slate-200"
                          }`}
                        >
                          <span className={`absolute top-0.75 w-4 h-4 rounded-full bg-white shadow transition-transform ${bookingAlerts ? "translate-x-5" : "translate-x-0.75"}`} />
                        </button>
                      </div>

                      {/* AI Recommendations */}
                      <div className="flex justify-between items-center pt-3.5">
                        <div className="space-y-0.5 text-left">
                          <span className="font-bold text-slate-800 block">AI Smart Insights</span>
                          <span className="text-[10px] text-slate-400 block">Recommendations for power efficiency updates.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAiRecommendations(!aiRecommendations)}
                          className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                            aiRecommendations ? "bg-primary" : "bg-slate-200"
                          }`}
                        >
                          <span className={`absolute top-0.75 w-4 h-4 rounded-full bg-white shadow transition-transform ${aiRecommendations ? "translate-x-5" : "translate-x-0.75"}`} />
                        </button>
                      </div>
                    </div>
                  </Card>
                )}

                {/* 4. Security Options */}
                {activeSection === "Security" && (
                  <Card className="bg-white border border-border rounded-[24px] p-6 shadow-sm space-y-6">
                    <div className="border-b border-slate-50 pb-3 flex items-center gap-2">
                      <Lock className="h-4.5 w-4.5 text-primary" />
                      <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">Security Credentials</h3>
                    </div>

                    <div className="space-y-5">
                      {/* Password change mock */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                        <div className="space-y-0.5 text-left">
                          <span className="text-xs font-bold text-slate-800 block">Login Password</span>
                          <p className="text-[10px] text-slate-400 leading-tight">Update your login security credentials password.</p>
                        </div>
                        <Button
                          onClick={() => setToastMessage("Password link emailed.")}
                          className="h-9 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
                        >
                          Change Password
                        </Button>
                      </div>

                      {/* 2FA Toggle switch */}
                      <div className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                        <div className="space-y-0.5 text-left pr-4">
                          <span className="text-xs font-bold text-slate-800 block">Two-Factor Authentication (2FA)</span>
                          <p className="text-[10px] text-slate-400 leading-snug">Secure dashboard actions with SMS code verification.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setTwoFactor(!twoFactor);
                            setToastMessage(twoFactor ? "2FA disabled." : "2FA enabled.");
                          }}
                          className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                            twoFactor ? "bg-primary" : "bg-slate-200"
                          }`}
                        >
                          <span className={`absolute top-0.75 w-4 h-4 rounded-full bg-white shadow transition-transform ${twoFactor ? "translate-x-5" : "translate-x-0.75"}`} />
                        </button>
                      </div>

                      {/* Trusted Devices mock */}
                      <div className="space-y-2">
                        <span className="text-[10px] text-slate-400 uppercase font-extrabold block">Trusted Devices & Session History</span>
                        <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100 text-[11px] font-sans">
                          <div className="p-3 flex items-center justify-between bg-slate-50/50">
                            <div>
                              <span className="font-bold text-slate-800 block">MacBook Pro &bull; Safari</span>
                              <span className="text-[9px] text-slate-400">Mumbai, India &bull; IP: 192.168.1.1</span>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase">Current</span>
                          </div>

                          <div className="p-3 flex items-center justify-between opacity-70">
                            <div>
                              <span className="font-bold text-slate-800 block">Chrome Browser &bull; Windows 11</span>
                              <span className="text-[9px] text-slate-400">Delhi, India &bull; Login: July 09, 2026</span>
                            </div>
                            <span className="text-[9px] text-slate-400 font-bold">Trusted</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* 5. Privacy Options */}
                {activeSection === "Privacy" && (
                  <Card className="bg-white border border-border rounded-[24px] p-6 shadow-sm space-y-6">
                    <div className="border-b border-slate-50 pb-3 flex items-center gap-2">
                      <ShieldCheck className="h-4.5 w-4.5 text-primary" />
                      <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">Privacy & Consent</h3>
                    </div>

                    <div className="space-y-4 text-xs">
                      {/* Telemetry switch */}
                      <div className="flex justify-between items-center p-3.5 bg-slate-50 border border-slate-100/50 rounded-2xl">
                        <div className="space-y-0.5 text-left pr-4">
                          <span className="font-bold text-slate-850 block">Share usage analytics data</span>
                          <span className="text-[10px] text-slate-450 block leading-tight">Help improve Dwellix algorithms with appliance diagnostic logs.</span>
                        </div>
                        <button type="button" className="w-10 h-5.5 rounded-full bg-primary relative cursor-pointer">
                          <span className="absolute top-0.75 left-5 w-4 h-4 rounded-full bg-white shadow" />
                        </button>
                      </div>

                      {/* Backup data trigger */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                        <div className="space-y-0.5 text-left">
                          <span className="text-xs font-bold text-slate-800 block">Download my data archive</span>
                          <p className="text-[10px] text-slate-400 leading-tight">Export a complete JSON backup of warranties and dispatch history.</p>
                        </div>
                        <Button
                          onClick={() => setToastMessage("Data packaging started.")}
                          className="h-9 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
                        >
                          Request Download
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

                {/* 6. AI Settings Config */}
                {activeSection === "AI Settings" && (
                  <Card className="bg-white border border-border rounded-[24px] p-6 shadow-sm space-y-6">
                    <div className="border-b border-slate-50 pb-3 flex items-center gap-2">
                      <Sparkles className="h-4.5 w-4.5 text-primary" />
                      <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">Gemini AI Engine Settings</h3>
                    </div>

                    <div className="space-y-4 text-xs font-sans">
                      {/* AI Personality select */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block">AI Assistant Persona</span>
                        <select
                          value={aiPersonality}
                          onChange={(e) => setAiPersonality(e.target.value)}
                          className="w-full h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none text-slate-700 cursor-pointer"
                        >
                          <option value="helpful">Helpful & Professional</option>
                          <option value="casual">Friendly & Conversational</option>
                          <option value="technical">Highly Technical (Engineering)</option>
                        </select>
                      </div>

                      {/* AI response length */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block">Response format detail</span>
                        <select
                          value={responseLength}
                          onChange={(e) => setResponseLength(e.target.value)}
                          className="w-full h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none text-slate-700 cursor-pointer"
                        >
                          <option value="short">Brief & Concise</option>
                          <option value="medium">Balanced Response</option>
                          <option value="detailed">In-Depth Walkthroughs</option>
                        </select>
                      </div>

                      {/* Switch options */}
                      <div className="space-y-3.5 divide-y divide-slate-100 pt-2 border-t border-slate-50">
                        {/* smart suggestions */}
                        <div className="flex justify-between items-center py-2">
                          <div className="space-y-0.5 text-left">
                            <span className="font-bold text-slate-800 block">Smart diagnostics tips suggestions</span>
                            <span className="text-[10px] text-slate-400 block">Show automatic suggestions in dashboard widgets.</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSmartSuggestions(!smartSuggestions)}
                            className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                              smartSuggestions ? "bg-primary" : "bg-slate-200"
                            }`}
                          >
                            <span className={`absolute top-0.75 w-4 h-4 rounded-full bg-white shadow transition-transform ${smartSuggestions ? "translate-x-5" : "translate-x-0.75"}`} />
                          </button>
                        </div>

                        {/* auto maintenance */}
                        <div className="flex justify-between items-center pt-3 pb-2">
                          <div className="space-y-0.5 text-left">
                            <span className="font-bold text-slate-800 block">Auto Maintenance Alerts Detection</span>
                            <span className="text-[10px] text-slate-400 block">Gemini filters user appliance logs for early failure detection warnings.</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setAutoMaintenance(!autoMaintenance)}
                            className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                              autoMaintenance ? "bg-primary" : "bg-slate-200"
                            }`}
                          >
                            <span className={`absolute top-0.75 w-4 h-4 rounded-full bg-white shadow transition-transform ${autoMaintenance ? "translate-x-5" : "translate-x-0.75"}`} />
                          </button>
                        </div>

                        {/* auto monitoring */}
                        <div className="flex justify-between items-center pt-3">
                          <div className="space-y-0.5 text-left">
                            <span className="font-bold text-slate-800 block">Continuous Appliance Diagnostics logs</span>
                            <span className="text-[10px] text-slate-400 block">Continuously monitors utility load outputs for faults.</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setApplianceMonitoring(!applianceMonitoring)}
                            className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                              applianceMonitoring ? "bg-primary" : "bg-slate-200"
                            }`}
                          >
                            <span className={`absolute top-0.75 w-4 h-4 rounded-full bg-white shadow transition-transform ${applianceMonitoring ? "translate-x-5" : "translate-x-0.75"}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* 7. Integrations Panel */}
                {activeSection === "Integrations" && (
                  <Card className="bg-white border border-border rounded-[24px] p-6 shadow-sm space-y-6">
                    <div className="border-b border-slate-50 pb-3 flex items-center gap-2">
                      <Share2 className="h-4.5 w-4.5 text-primary" />
                      <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">Connected Services</h3>
                    </div>

                    <div className="space-y-4">
                      {/* Google */}
                      <div className="flex justify-between items-center p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs sm:text-sm">
                        <div className="flex items-start gap-3">
                          <span className="p-2 rounded-xl bg-white border border-slate-100 text-slate-400 mt-0.5 font-bold">G</span>
                          <div className="space-y-0.5 text-left">
                            <span className="font-bold text-slate-800 block">Google Login API</span>
                            <span className="text-[10px] text-slate-450 block">SSO integration for seamless profile accesses.</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIntegrationGoogle(!integrationGoogle);
                            setToastMessage(integrationGoogle ? "Google Sign-in unlinked." : "Google Sign-in linked.");
                          }}
                          className={`text-[10px] font-extrabold uppercase tracking-wide px-3 py-1.5 rounded-xl border cursor-pointer transition-colors ${
                            integrationGoogle ? "text-slate-500 border-slate-250 hover:bg-slate-100" : "bg-primary text-white border-primary"
                          }`}
                        >
                          {integrationGoogle ? "Disconnect" : "Link"}
                        </button>
                      </div>

                      {/* Cloudinary */}
                      <div className="flex justify-between items-center p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs sm:text-sm">
                        <div className="flex items-start gap-3">
                          <span className="p-2 rounded-xl bg-white border border-slate-100 text-primary mt-0.5">
                            <Cloud className="h-4.5 w-4.5" />
                          </span>
                          <div className="space-y-0.5 text-left">
                            <span className="font-bold text-slate-800 block">Cloudinary Media CDN</span>
                            <span className="text-[10px] text-slate-450 block">Used for storing warranty images and appliance receipts.</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIntegrationCloudinary(!integrationCloudinary);
                            setToastMessage(integrationCloudinary ? "Cloudinary CDN unlinked." : "Cloudinary CDN linked.");
                          }}
                          className={`text-[10px] font-extrabold uppercase tracking-wide px-3 py-1.5 rounded-xl border cursor-pointer transition-colors ${
                            integrationCloudinary ? "text-slate-500 border-slate-250 hover:bg-slate-100" : "bg-primary text-white border-primary"
                          }`}
                        >
                          {integrationCloudinary ? "Disconnect" : "Link"}
                        </button>
                      </div>

                      {/* Google Calendar */}
                      <div className="flex justify-between items-center p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs sm:text-sm">
                        <div className="flex items-start gap-3">
                          <span className="p-2 rounded-xl bg-white border border-slate-100 text-primary mt-0.5">
                            <Calendar className="h-4.5 w-4.5" />
                          </span>
                          <div className="space-y-0.5 text-left">
                            <span className="font-bold text-slate-800 block">Google Calendar Sync</span>
                            <span className="text-[10px] text-slate-450 block">Sync scheduled maintenance dispatches to calendar.</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIntegrationCalendar(!integrationCalendar);
                            setToastMessage(integrationCalendar ? "Calendar sync unlinked." : "Calendar sync linked.");
                          }}
                          className={`text-[10px] font-extrabold uppercase tracking-wide px-3 py-1.5 rounded-xl border cursor-pointer transition-colors ${
                            integrationCalendar ? "text-slate-500 border-slate-250 hover:bg-slate-100" : "bg-primary text-white border-primary"
                          }`}
                        >
                          {integrationCalendar ? "Disconnect" : "Link"}
                        </button>
                      </div>

                      {/* WhatsApp Alerts */}
                      <div className="flex justify-between items-center p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs sm:text-sm">
                        <div className="flex items-start gap-3">
                          <span className="p-2 rounded-xl bg-white border border-slate-100 text-emerald-600 mt-0.5">
                            <MessageSquare className="h-4.5 w-4.5" />
                          </span>
                          <div className="space-y-0.5 text-left">
                            <span className="font-bold text-slate-800 block">WhatsApp alerts channel</span>
                            <span className="text-[10px] text-slate-450 block">Receive instant technician contact cards on WhatsApp.</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIntegrationWhatsApp(!integrationWhatsApp);
                            setToastMessage(integrationWhatsApp ? "WhatsApp notifications unlinked." : "WhatsApp notifications linked.");
                          }}
                          className={`text-[10px] font-extrabold uppercase tracking-wide px-3 py-1.5 rounded-xl border cursor-pointer transition-colors ${
                            integrationWhatsApp ? "text-slate-500 border-slate-250 hover:bg-slate-100" : "bg-primary text-white border-primary"
                          }`}
                        >
                          {integrationWhatsApp ? "Disconnect" : "Link"}
                        </button>
                      </div>
                    </div>
                  </Card>
                )}

                {/* 8. Language & Region Options */}
                {activeSection === "Language & Region" && (
                  <Card className="bg-white border border-border rounded-[24px] p-6 shadow-sm space-y-6">
                    <div className="border-b border-slate-50 pb-3 flex items-center gap-2">
                      <Globe className="h-4.5 w-4.5 text-primary" />
                      <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">Locale & regional parameters</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      {/* Language selection */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                          <Languages className="h-3.5 w-3.5 text-slate-400" /> Default Language
                        </span>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none text-slate-700 cursor-pointer"
                        >
                          <option value="English">English</option>
                          <option value="Hindi">Hindi (हिन्दी)</option>
                          <option value="Marathi">Marathi (मराठी)</option>
                        </select>
                      </div>

                      {/* Timezone selection */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-slate-400" /> Time Zone
                        </span>
                        <select
                          value={timezone}
                          onChange={(e) => setTimezone(e.target.value)}
                          className="w-full h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none text-slate-700 cursor-pointer"
                        >
                          <option value="Asia/Kolkata (UTC+05:30)">Asia/Kolkata (UTC+05:30)</option>
                          <option value="America/New_York (UTC-05:00)">America/New_York (UTC-05:00)</option>
                        </select>
                      </div>

                      {/* Currency selection */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                          <DollarSign className="h-3.5 w-3.5 text-slate-400" /> Currency Symbol
                        </span>
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          className="w-full h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none text-slate-700 cursor-pointer"
                        >
                          <option value="INR (₹)">INR (₹)</option>
                          <option value="USD ($)">USD ($)</option>
                        </select>
                      </div>

                      {/* Date Format selection */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" /> Date format type
                        </span>
                        <select
                          value={dateFormat}
                          onChange={(e) => setDateFormat(e.target.value)}
                          className="w-full h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none text-slate-700 cursor-pointer"
                        >
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        </select>
                      </div>
                    </div>
                  </Card>
                )}

                {/* 9. Storage Usage Config */}
                {activeSection === "Storage" && (
                  <Card className="bg-white border border-border rounded-[24px] p-6 shadow-sm space-y-6">
                    <div className="border-b border-slate-50 pb-3 flex items-center gap-2">
                      <HardDrive className="h-4.5 w-4.5 text-primary" />
                      <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">Cloud Storage logs usage</h3>
                    </div>

                    <div className="space-y-5 text-xs font-sans">
                      {/* Storage Progress bar bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-slate-500 font-bold">
                          <span>Total Allocation Used</span>
                          <span className="text-slate-800 font-extrabold">2.4 GB / 10 GB (24%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                          <div className="h-full bg-primary-soft0" style={{ width: "12%" }} title="Images: 1.2 GB" />
                          <div className="h-full bg-emerald-500" style={{ width: "8%" }} title="Documents: 0.8 GB" />
                          <div className="h-full bg-amber-500" style={{ width: "4%" }} title="Warranties: 0.4 GB" />
                        </div>
                      </div>

                      {/* Legend grid */}
                      <div className="grid grid-cols-3 gap-4 pt-2 text-left">
                        <div className="space-y-0.5 border-l-2 border-l-primary pl-2">
                          <span className="text-[9px] text-slate-400 uppercase font-extrabold">Images</span>
                          <span className="font-bold text-slate-750 block">1.2 GB (12%)</span>
                        </div>
                        <div className="space-y-0.5 border-l-2 border-l-emerald-500 pl-2">
                          <span className="text-[9px] text-slate-400 uppercase font-extrabold">Documents</span>
                          <span className="font-bold text-slate-750 block">0.8 GB (8%)</span>
                        </div>
                        <div className="space-y-0.5 border-l-2 border-l-amber-500 pl-2">
                          <span className="text-[9px] text-slate-400 uppercase font-extrabold">Warranties</span>
                          <span className="font-bold text-slate-750 block">0.4 GB (4%)</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* 10. Danger Zone Option */}
                {activeSection === "Danger Zone" && (
                  <Card className="border border-rose-200/50 rounded-[24px] bg-rose-50/10 p-6 shadow-sm space-y-6">
                    <div className="border-b border-rose-100 pb-3 flex items-center gap-2">
                      <ShieldAlert className="h-4.5 w-4.5 text-rose-600 animate-pulse" />
                      <h3 className="text-sm font-extrabold uppercase tracking-wider text-rose-700">Danger parameters zone</h3>
                    </div>

                    <div className="space-y-4 text-xs font-sans text-left">
                      {/* Logout devices */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-100/50">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-800 block">Sign Out of all other browser sessions</span>
                          <p className="text-[10px] text-slate-450 leading-tight">Clears all security tokens on other active connected computers.</p>
                        </div>
                        <Button
                          onClick={() => setToastMessage("Logged out from other sessions.")}
                          className="h-9 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold bg-white cursor-pointer"
                        >
                          Logout All Sessions
                        </Button>
                      </div>

                      {/* Delete account profile */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
                        <div className="space-y-0.5">
                          <span className="font-bold text-rose-800 block">Permanently erase Dwellix Account profile</span>
                          <p className="text-[10px] text-slate-450 leading-tight">Removes registered warranties, invoice sheets and repair logs.</p>
                        </div>
                        <Button
                          onClick={() => alert("Deleting account...")}
                          className="h-9 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
                        >
                          Delete Profile Account
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
