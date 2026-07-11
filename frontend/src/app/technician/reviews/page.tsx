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
  MessageSquare
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

interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  rating: number;
  review: string;
  createdAt: string;
}

export default function TechnicianReviewsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Reviews");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [techName, setTechName] = useState("Technician");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

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
          if (payload.id) {
            apiClient<Review[]>(`/api/v1/technicians/${payload.id}/reviews`)
              .then((data) => {
                setReviews(data || []);
              })
              .catch((err) => {
                console.error("Failed to load reviews:", err);
              })
              .finally(() => setLoading(false));
          } else {
            setTimeout(() => setLoading(false), 0);
          }
        } else {
          setTimeout(() => setLoading(false), 0);
        }
      } else {
        setTimeout(() => setLoading(false), 0);
      }
    } catch (e) {
      console.error("Failed to parse token:", e);
      setTimeout(() => setLoading(false), 0);
    }
  }, []);

  const handleLogout = () => {
    setAccessToken(null);
    localStorage.removeItem("dwellix_access_token");
    router.push("/technician/login");
  };

  const handleSidebarClick = (item: SidebarItem) => {
    if (item.name === "Reviews") {
      setActiveTab("Reviews");
    } else {
      router.push(item.href);
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

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
                <div className="text-[9px] font-bold text-slate-440 mt-1 uppercase">Active Pro</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-8 max-w-4xl w-full mx-auto">
          <div className="space-y-8">
            {/* Header overview banner */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-white border border-slate-200/60 rounded-3xl gap-4 shadow-sm">
              <div className="space-y-1">
                <h2 className="text-lg font-black text-slate-900">Reviews & Ratings Feedback</h2>
                <p className="text-xs text-slate-500 font-medium">Real-time ratings and written reviews left by your customers.</p>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl shrink-0">
                <div className="text-center">
                  <div className="text-xl font-black text-slate-950 flex items-center gap-1">
                    <span>{averageRating}</span>
                    <Star className="h-4.5 w-4.5 text-amber-500 fill-amber-500 inline" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mt-0.5">Average Rating</span>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="text-center">
                  <div className="text-xl font-black text-slate-950">{reviews.length}</div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mt-0.5">Total Reviews</span>
                </div>
              </div>
            </div>

            {/* List or Empty State */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
                <span className="text-xs font-bold uppercase tracking-widest">Loading reviews...</span>
              </div>
            ) : reviews.length === 0 ? (
              <Card className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200/60 shadow-xs rounded-3xl text-center space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-900">No Reviews Yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm">
                    Customers can leave feedback and ratings once their assigned repair bookings are marked as completed.
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <Card key={r.id} className="p-6 bg-white border border-slate-200/60 shadow-sm rounded-3xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900">{r.customerName}</h4>
                        <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                          {new Date(r.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-600 border border-amber-100/60 px-2.5 py-1 rounded-xl text-xs font-black">
                        <span>{r.rating}</span>
                        <Star className="h-3 w-3 fill-current" />
                      </div>
                    </div>
                    <p className="text-xs text-slate-650 leading-relaxed font-medium bg-slate-50/50 p-3 rounded-2xl border border-slate-100/40">
                      &ldquo;{r.review}&rdquo;
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
