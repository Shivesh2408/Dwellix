"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Users,
  TrendingUp,
  Star,
  Activity,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Bell,
  CheckCircle,
  Briefcase,
  AlertCircle,
  ListTodo
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { setAccessToken, apiClient } from "@/lib/api-client";

interface SidebarItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const sidebarItems: SidebarItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/technician/dashboard" },
  { name: "Bookings", icon: Calendar, href: "/technician/bookings" },
  { name: "Queue", icon: Clock, href: "/technician/bookings" },
  { name: "Customers", icon: Users, href: "/technician/dashboard" },
  { name: "Earnings", icon: TrendingUp, href: "/technician/dashboard" },
  { name: "Reviews", icon: Star, href: "/technician/reviews" },
  { name: "Availability", icon: Activity, href: "/technician/dashboard" },
  { name: "Profile", icon: User, href: "/technician/dashboard" },
  { name: "Settings", icon: Settings, href: "/technician/dashboard" },
];

interface Booking {
  id: string;
  bookingStatus: string;
  status: string;
  bookingDate: string;
}

export default function TechnicianDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [techName, setTechName] = useState("Technician");

  const [stats, setStats] = useState({
    todaysJobs: 0,
    pendingRequests: 0,
    queueLength: 0,
    completedToday: 0
  });

  const [earnings, setEarnings] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    lifetime: 0,
    pending: 0
  });

  useEffect(() => {
    try {
      const token = localStorage.getItem("dwellix_access_token");
      if (token) {
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          if (payload.name) {
            setTimeout(() => {
              setTechName(payload.name);
            }, 0);
          }
        }
      }
    } catch (e) {
      console.error("Failed to parse token:", e);
    }
  }, []);

  useEffect(() => {
    apiClient<Booking[]>("/api/v1/technician/bookings")
      .then((bookings) => {
        const todaysJobs = bookings.filter(b => {
          const s = (b.bookingStatus || b.status || "").toUpperCase();
          return ["IN_PROGRESS", "ACCEPTED", "TRAVELLING", "ARRIVED"].includes(s);
        }).length;

        const pendingRequests = bookings.filter(b => {
          const s = (b.bookingStatus || b.status || "").toUpperCase();
          return s === "REQUESTED";
        }).length;

        const queueLength = bookings.filter(b => {
          const s = (b.bookingStatus || b.status || "").toUpperCase();
          return s === "QUEUED";
        }).length;

        const completedToday = bookings.filter(b => {
          const s = (b.bookingStatus || b.status || "").toUpperCase();
          return ["COMPLETED", "PAID"].includes(s);
        }).length;

        setStats({ todaysJobs, pendingRequests, queueLength, completedToday });
      })
      .catch((err) => {
        console.error("Failed to fetch technician bookings stats:", err);
      });

    apiClient<{ today: number; thisWeek: number; thisMonth: number; lifetime: number; pending: number }>("/api/v1/technician/earnings")
      .then((data) => {
        if (data) {
          setEarnings(data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch technician earnings:", err);
      });
  }, []);

  const handleLogout = () => {
    setAccessToken(null);
    localStorage.removeItem("dwellix_access_token");
    router.push("/technician/login");
  };

  const handleSidebarClick = (item: SidebarItem) => {
    if (item.name === "Dashboard") {
      setActiveTab("Dashboard");
    } else {
      router.push(item.href);
    }
  };

  const renderEarningCard = (label: string, value: number) => {
    const isZero = value === 0;
    return (
      <Card className="p-5 bg-white border border-slate-200/60 shadow-xs space-y-2 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{label}</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {isZero ? "₹0" : `₹${value.toLocaleString()}`}
          </div>
        </div>
        <p className="text-[10px] text-slate-400 font-medium">
          {isZero ? "No transactions yet" : "Live data from database"}
        </p>
      </Card>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FB] text-slate-800 font-sans text-left">
      {/* Sidebar Navigation */}
      <aside
        className={`relative flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Pro Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-6 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white shadow-md flex-shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <div>
              <div className="text-sm font-black tracking-tight leading-none text-slate-900">Dwellix Pro</div>
              <div className="text-[9px] font-bold text-blue-600 tracking-wider uppercase mt-0.5">Technician v2.0</div>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-1.5 px-4 py-6">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => handleSidebarClick(item)}
                className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-slate-950 text-white shadow-md shadow-slate-950/10"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-slate-100 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
          >
            <LogOut className="h-4.5 w-4.5 flex-shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3.5 top-18 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm hover:text-slate-900 cursor-pointer"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
          <div className="flex items-center gap-4">
            <h1 className="text-base font-bold text-slate-800 tracking-tight">{activeTab}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600" />
            </button>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-black text-slate-700 font-mono">
                {techName.substring(0, 2).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-none">{techName}</div>
                <div className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Active Pro</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-8 max-w-5xl w-full mx-auto">
          <div className="space-y-8">
            {/* Announcement Card */}
            <Card className="border border-slate-200/60 bg-white p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-50 text-blue-600 border border-blue-100">
                  <span>Dwellix v2.0 Pro Engine</span>
                </div>
                <h2 className="text-xl font-heading font-black text-slate-900">Portal Dashboard Online</h2>
                <p className="text-xs text-slate-550 leading-relaxed max-w-xl">
                  Welcome back, {techName}. Below is your real-time booking dispatch and earnings overview. Check your tabs to accept requests or transition job status.
                </p>
              </div>
              <div className="h-10 w-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100 shrink-0 animate-pulse">
                <CheckCircle className="h-5 w-5" />
              </div>
            </Card>

            {/* Job Stats Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Dispatch Queue Overview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <Card className="p-5 bg-white border border-slate-200/60 shadow-xs space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Today&apos;s Jobs</span>
                    <div className="text-2xl font-black text-slate-900 mt-1">{stats.todaysJobs}</div>
                  </div>
                  <p className="text-[10px] text-blue-600 font-bold flex items-center gap-1">
                    <Briefcase className="h-3 w-3" /> Active scheduling
                  </p>
                </Card>

                <Card className="p-5 bg-white border border-slate-200/60 shadow-xs space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Pending Requests</span>
                    <div className="text-2xl font-black text-slate-900 mt-1">{stats.pendingRequests}</div>
                  </div>
                  <p className="text-[10px] text-amber-500 font-bold flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Awaiting approval
                  </p>
                </Card>

                <Card className="p-5 bg-white border border-slate-200/60 shadow-xs space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Queue Length</span>
                    <div className="text-2xl font-black text-slate-900 mt-1">{stats.queueLength}</div>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                    <ListTodo className="h-3 w-3" /> Queued bookings
                  </p>
                </Card>

                <Card className="p-5 bg-white border border-slate-200/60 shadow-xs space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Completed Today</span>
                    <div className="text-2xl font-black text-slate-900 mt-1">{stats.completedToday}</div>
                  </div>
                  <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Repair jobs completed
                  </p>
                </Card>
              </div>
            </div>

            {/* Earnings Stats Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Earnings & Settlements</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
                {renderEarningCard("Today's Earnings", earnings.today)}
                {renderEarningCard("This Week", earnings.thisWeek)}
                {renderEarningCard("This Month", earnings.thisMonth)}
                {renderEarningCard("Lifetime", earnings.lifetime)}
                {renderEarningCard("Pending Settlement", earnings.pending)}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
