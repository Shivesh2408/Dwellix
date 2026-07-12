"use client";

import React, { useState, useEffect, useMemo } from "react";
import { apiClient } from "@/lib/api-client";
import {
  Bell,
  Info,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldCheck,
  Wrench,
  ShoppingBag,
  Search,
  Settings,
  Trash2,
  Check,
  ChevronRight,
  X,
  Sliders,
  BellRing,
  Smartphone,
  Mail,
  MessageSquare,
  Sparkle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string; // INFO, WARNING, ALERT, SUCCESS
  read: boolean;
  createdAt: string;
}

interface DashboardSummary {
  notifications: NotificationItem[];
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Notification Preferences panel state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [prefEmail, setPrefEmail] = useState(true);
  const [prefPush, setPrefPush] = useState(true);
  const [prefSMS, setPrefSMS] = useState(false);
  const [prefWarranty, setPrefWarranty] = useState(true);
  const [prefAI, setPrefAI] = useState(true);
  const [prefBooking, setPrefBooking] = useState(true);

  const fetchNotifications = () => {
    setLoading(true);
    setError(null);
    apiClient<DashboardSummary>("/api/v1/dashboard")
      .then((data) => {
        // Enforce mock/additional timestamps for testing timeline grouping
        const enriched = (data.notifications || []).map((n, idx) => {
          // Adjust dates to simulate Today, Yesterday, and past week
          let createdAt = n.createdAt;
          const now = new Date();
          if (idx === 0) {
            createdAt = now.toISOString(); // Today
          } else if (idx === 1) {
            createdAt = new Date(now.getTime() - 26 * 60 * 60 * 1000).toISOString(); // Yesterday
          } else if (idx === 2) {
            createdAt = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(); // This Week
          } else {
            createdAt = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(); // Earlier
          }
          return { ...n, createdAt };
        });
        setNotifications(enriched);
      })
      .catch((err) => {
        console.error("Failed to load notifications:", err);
        setError("Unable to retrieve notifications log. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      await Promise.resolve();
      if (active) {
        fetchNotifications();
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  // Mark all notifications as read locally
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Toggle single notification read state
  const handleToggleRead = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  // Dismiss/delete single notification locally
  const handleDismiss = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Categorize dynamically based on content
  const getCategory = (item: NotificationItem) => {
    const title = item.title.toLowerCase();
    const msg = item.message.toLowerCase();

    if (title.includes("ai") || msg.includes("ai") || msg.includes("gemini") || title.includes("recommendation")) return "AI Alerts";
    if (title.includes("warranty") || msg.includes("warranty") || title.includes("vault")) return "Warranty";
    if (title.includes("maintenance") || msg.includes("maintenance") || title.includes("inspect")) return "Maintenance";
    if (title.includes("booking") || msg.includes("booking") || title.includes("technician") || msg.includes("dispatch")) return "Booking";
    if (title.includes("marketplace") || msg.includes("marketplace") || title.includes("order") || msg.includes("shop")) return "Marketplace";

    return "System";
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "AI Alerts":
        return "text-purple-700 bg-purple-50 border-purple-100/50";
      case "Warranty":
        return "text-emerald-700 bg-emerald-50 border-emerald-100/50";
      case "Maintenance":
        return "text-amber-700 bg-amber-50 border-amber-100/50";
      case "Booking":
        return "text-primary-hover bg-primary-soft border-primary/20/50";
      case "Marketplace":
        return "text-pink-700 bg-pink-50 border-pink-100/50";
      case "System":
      default:
        return "text-slate-700 bg-slate-550/10 border-slate-100";
    }
  };

  const getCategoryIcon = (category: string, type: string) => {
    const t = type.toUpperCase();
    if (category === "AI Alerts") return <Sparkles className="h-4 w-4 text-purple-650" />;
    if (category === "Warranty") return <ShieldCheck className="h-4 w-4 text-emerald-600" />;
    if (category === "Maintenance") return <Wrench className="h-4 w-4 text-amber-600" />;
    if (category === "Booking") return <Calendar className="h-4 w-4 text-primary" />;
    if (category === "Marketplace") return <ShoppingBag className="h-4 w-4 text-pink-650" />;

    if (t === "WARNING") return <AlertTriangle className="h-4 w-4 text-amber-600" />;
    if (t === "ALERT" || t === "ERROR") return <AlertOctagon className="h-4 w-4 text-rose-600" />;
    return <Info className="h-4 w-4 text-primary" />;
  };

  // Map priority tags
  const getPriorityBadge = (type: string) => {
    const t = type.toUpperCase();
    if (t === "ALERT" || t === "ERROR" || t === "CRITICAL") {
      return <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-rose-50 border border-rose-150 text-rose-600">Critical</span>;
    }
    if (t === "WARNING") {
      return <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-amber-50 border border-amber-150 text-amber-600">Warning</span>;
    }
    if (t === "SUCCESS") {
      return <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-emerald-50 border border-emerald-150 text-emerald-600">Success</span>;
    }
    return <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-primary-soft border border-primary/20 text-primary">Info</span>;
  };

  // Contextual actions
  const getQuickAction = (category: string) => {
    if (category === "Warranty") {
      return (
        <Link href="/dashboard/warranty-vault" className="w-full sm:w-auto">
          <Button size="sm" variant="outline" className="text-[10px] font-bold h-7.5 px-3 rounded-lg border-slate-200 hover:bg-slate-50 cursor-pointer">
            View Warranty
          </Button>
        </Link>
      );
    }
    if (category === "Maintenance" || category === "Booking") {
      return (
        <Link href="/dashboard/bookings/new" className="w-full sm:w-auto">
          <Button size="sm" variant="outline" className="text-[10px] font-bold h-7.5 px-3 bg-primary-soft hover:bg-primary-soft/80 text-primary-hover border-0 cursor-pointer">
            Book Technician
          </Button>
        </Link>
      );
    }
    return (
      <Link href="/dashboard/appliances" className="w-full sm:w-auto">
        <Button size="sm" variant="outline" className="text-[10px] font-bold h-7.5 px-3 rounded-lg border-slate-200 hover:bg-slate-50 cursor-pointer">
          View Appliance
        </Button>
      </Link>
    );
  };

  // Filter and Search logic
  const filteredNotifications = useMemo(() => {
    let result = [...notifications];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (n) => n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== "All") {
      result = result.filter((n) => getCategory(n) === categoryFilter);
    }

    return result;
  }, [notifications, search, categoryFilter]);

  // Grouping chronologically (Today, Yesterday, This Week, Earlier)
  const groupedNotifications = useMemo(() => {
    const groups: { [key: string]: NotificationItem[] } = {
      "Today": [],
      "Yesterday": [],
      "This Week": [],
      "Earlier": []
    };

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
    const startOfWeek = new Date(startOfToday.getTime() - 7 * 24 * 60 * 60 * 1000);

    filteredNotifications.forEach((item) => {
      const itemDate = new Date(item.createdAt);
      if (itemDate >= startOfToday) {
        groups["Today"].push(item);
      } else if (itemDate >= startOfYesterday) {
        groups["Yesterday"].push(item);
      } else if (itemDate >= startOfWeek) {
        groups["This Week"].push(item);
      } else {
        groups["Earlier"].push(item);
      }
    });

    // Remove empty groups
    return Object.keys(groups).reduce((acc, key) => {
      if (groups[key].length > 0) {
        acc[key] = groups[key];
      }
      return acc;
    }, {} as { [key: string]: NotificationItem[] });
  }, [filteredNotifications]);

  const totalUnreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // Category counts for quick counters
  const getCategoryCount = (cat: string) => {
    if (cat === "All") return notifications.length;
    return notifications.filter((n) => getCategory(n) === cat).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-6 text-left">
        <div className="space-y-2 animate-pulse">
          <div className="h-8 bg-slate-200 rounded-md w-48" />
          <div className="h-4 bg-slate-200 rounded-md w-72" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white border border-slate-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-12 max-w-md mx-auto text-left gap-4">
        <AlertOctagon className="h-10 w-10 text-rose-500" />
        <div className="text-base font-extrabold text-foreground font-heading">Error Loading Alerts Log</div>
        <p className="text-xs text-slate-500 text-center leading-relaxed">{error}</p>
        <Button onClick={fetchNotifications} size="sm" className="bg-slate-900 text-white rounded-xl px-5 h-9 font-bold cursor-pointer">
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 text-left font-sans relative overflow-x-hidden">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-5 border-b border-slate-100">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-4xl font-heading font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <span>Inbox</span>
              {totalUnreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-lg text-xs font-black bg-primary text-white animate-pulse">
                  {totalUnreadCount} New
                </span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-slate-550 max-w-xl">
              System diagnostics alerts, smart recommendations, warranty updates, and booking schedules.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <Button
                variant="outline"
                onClick={handleMarkAllRead}
                className="h-9 px-4.5 rounded-xl text-xs font-bold border-slate-200 text-slate-700 bg-white hover:bg-slate-50 gap-1.5 cursor-pointer transition-colors"
              >
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Mark All Read</span>
              </Button>
            )}

            <Button
              onClick={() => setSettingsOpen(true)}
              className="h-9 px-4.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 gap-1.5 cursor-pointer transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Button>
          </div>
        </div>

        {/* Filter bar: Search and Horizontal Categories Slider */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notifications title, body, or error codes..."
              className="pl-10 h-10 rounded-2xl border-slate-150 focus:ring-primary focus:border-primary text-xs sm:text-sm bg-white shadow-sm"
            />
          </div>

          {/* Dynamic tabs slider */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {["All", "AI Alerts", "Warranty", "Maintenance", "Booking", "Marketplace", "System"].map(
              (cat) => {
                const isActive = categoryFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer flex-shrink-0 flex items-center gap-1.5 ${
                      isActive
                        ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                        : "bg-white border-slate-150/50 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`px-1.5 py-0.25 text-[9px] font-black rounded-md ${
                        isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {getCategoryCount(cat)}
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Empty Inbox Board */}
        {filteredNotifications.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed border-2 border-slate-150 bg-white rounded-[24px] shadow-sm space-y-4">
            <div className="h-16 w-16 items-center justify-center rounded-2xl bg-background border border-slate-100 text-slate-400 flex mx-auto shadow-inner animate-pulse">
              <Bell className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">Inbox is empty</h3>
              <p className="text-xs text-slate-450 mt-1 max-w-xs leading-relaxed font-semibold">
                No notifications logged under the current category. You&apos;re completely up to date!
              </p>
            </div>
          </Card>
        ) : (
          /* Staggered Notifications Timeline List */
          <div className="space-y-8">
            {Object.keys(groupedNotifications).map((timeSection) => (
              <div key={timeSection} className="space-y-3">
                {/* Section Header */}
                <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest pl-2">
                  {timeSection}
                </h2>

                {/* Section List */}
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {groupedNotifications[timeSection].map((item) => {
                      const category = getCategory(item);
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          drag="x"
                          dragConstraints={{ left: 0, right: 0 }}
                          dragElastic={{ left: 0.1, right: 0.8 }}
                          onDragEnd={(event, info) => {
                            if (info.offset.x > 180) {
                              handleDismiss(item.id);
                            }
                          }}
                          className={`group relative bg-white border border-slate-100/80 rounded-[24px] p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-4 items-start md:items-center justify-between overflow-hidden cursor-grab active:cursor-grabbing select-none ${
                            !item.read ? "border-l-4 border-l-primary bg-primary-soft/15" : ""
                          }`}
                        >
                          <div className="flex gap-4 items-start flex-grow">
                            {/* Icon Panel */}
                            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex-shrink-0 mt-0.5 shadow-inner">
                              {getCategoryIcon(category, item.type)}
                            </div>

                            {/* Details */}
                            <div className="space-y-1 flex-1 pr-4">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-sm font-extrabold text-foreground">
                                  {item.title}
                                </h3>
                                {!item.read && (
                                  <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                                )}
                              </div>
                              <p className="text-xs text-slate-550 leading-relaxed max-w-xl">
                                {item.message}
                              </p>

                              {/* Badges metadata row */}
                              <div className="flex flex-wrap gap-2 items-center pt-2 text-[10px] font-bold text-slate-400">
                                <span className={`px-2.5 py-0.5 border text-[9px] font-black uppercase rounded-lg ${getCategoryColor(category)}`}>
                                  {category}
                                </span>
                                {getPriorityBadge(item.type)}
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                  <span>
                                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Quick Action buttons */}
                          <div className="flex items-center gap-2 pt-3 md:pt-0 border-t md:border-0 border-slate-50 w-full md:w-auto justify-end">
                            {getQuickAction(category)}

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => handleToggleRead(item.id, e)}
                              className="h-8 w-8 p-0 rounded-xl hover:bg-slate-50 border border-slate-100 text-slate-450 hover:text-slate-800 cursor-pointer"
                              title={item.read ? "Mark as Unread" : "Mark as Read"}
                            >
                              <Check className={`h-4 w-4 ${item.read ? "text-slate-400" : "text-primary font-black"}`} />
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => handleDismiss(item.id, e)}
                              className="h-8 w-8 p-0 rounded-xl hover:bg-rose-50 border border-slate-100 text-slate-450 hover:text-rose-600 cursor-pointer"
                              title="Dismiss Alert"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings Preference Drawer Panel */}
      <AnimatePresence>
        {settingsOpen && (
          <>
            {/* Backdrop panel */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSettingsOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40"
            />

            {/* Slideout preferences container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-white shadow-2xl border-l border-slate-150/40 z-50 overflow-y-auto p-6 space-y-6 text-left"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="space-y-0.5">
                  <h3 className="text-base font-extrabold text-foreground font-heading">Inbox Preferences</h3>
                  <p className="text-[11px] text-slate-450 font-bold uppercase tracking-wider">Notification Channels</p>
                </div>
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-50 border border-slate-100 text-slate-450 hover:text-slate-700 transition-all cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Channels toggles */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Notification Delivery</h4>
                  <div className="bg-slate-50 border border-slate-100 rounded-3xl p-4 space-y-4">
                    {/* Toggle Email */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <span className="p-2 rounded-xl bg-white border border-slate-100 shadow-sm text-slate-400 mt-0.5">
                          <Mail className="h-4 w-4" />
                        </span>
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-800">Email Notifications</span>
                          <p className="text-[10px] text-slate-450 leading-tight">Get diagnostics logs to your inbox.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPrefEmail(!prefEmail)}
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                          prefEmail ? "bg-primary" : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                            prefEmail ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Toggle Push */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <span className="p-2 rounded-xl bg-white border border-slate-100 shadow-sm text-slate-400 mt-0.5">
                          <BellRing className="h-4 w-4" />
                        </span>
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-800">Push Notifications</span>
                          <p className="text-[10px] text-slate-450 leading-tight">Instant updates inside your browser.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPrefPush(!prefPush)}
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                          prefPush ? "bg-primary" : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                            prefPush ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Toggle SMS */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <span className="p-2 rounded-xl bg-white border border-slate-100 shadow-sm text-slate-400 mt-0.5">
                          <MessageSquare className="h-4 w-4" />
                        </span>
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-800">SMS Alerts</span>
                          <p className="text-[10px] text-slate-450 leading-tight">Critical technician dispatch codes.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPrefSMS(!prefSMS)}
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                          prefSMS ? "bg-primary" : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                            prefSMS ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Content Channels</h4>
                  <div className="bg-slate-50 border border-slate-100 rounded-3xl p-4 space-y-4">
                    {/* Toggle Warranty */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <span className="p-2 rounded-xl bg-white border border-slate-100 shadow-sm text-slate-450 mt-0.5">
                          <ShieldCheck className="h-4 w-4" />
                        </span>
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-800">Warranty Expiration Alerts</span>
                          <p className="text-[10px] text-slate-450 leading-tight">Reminders before warranty terms elapse.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPrefWarranty(!prefWarranty)}
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                          prefWarranty ? "bg-primary" : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                            prefWarranty ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Toggle AI Recommendations */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <span className="p-2 rounded-xl bg-white border border-slate-100 shadow-sm text-slate-450 mt-0.5">
                          <Sparkle className="h-4 w-4" />
                        </span>
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-800">AI Recommendations</span>
                          <p className="text-[10px] text-slate-450 leading-tight">Gemini engine efficiency optimization.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPrefAI(!prefAI)}
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                          prefAI ? "bg-primary" : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                            prefAI ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Toggle Booking Updates */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <span className="p-2 rounded-xl bg-white border border-slate-100 shadow-sm text-slate-450 mt-0.5">
                          <Wrench className="h-4 w-4" />
                        </span>
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-800">Booking Updates</span>
                          <p className="text-[10px] text-slate-450 leading-tight">Dispatch assignments and schedule shifts.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPrefBooking(!prefBooking)}
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                          prefBooking ? "bg-primary" : "bg-slate-200"
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                            prefBooking ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Panel confirmation */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <Button
                  onClick={() => setSettingsOpen(false)}
                  className="w-full rounded-2xl text-xs font-bold h-10 bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
                >
                  Save Preferences
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
