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
  Phone,
  MapPin,
  Cpu,
  AlertTriangle,
  Play,
  CheckSquare
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
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  applianceName: string;
  brand: string;
  model: string;
  problemDescription: string;
  bookingDate: string;
  bookingTime: string;
  status: string;
  bookingStatus: string;
}

export default function TechnicianBookingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"Pending" | "Accepted" | "Queue" | "Completed">("Pending");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [techName, setTechName] = useState("Technician");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const fetchBookings = () => {
    setLoading(true);
    apiClient<Booking[]>("/api/v1/technician/bookings")
      .then((data) => {
        setBookings(data);
      })
      .catch((err) => {
        console.error("Failed to load technician bookings:", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setTimeout(() => {
      fetchBookings();
    }, 0);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAccept = async (id: string) => {
    try {
      await apiClient(`/api/v1/technician/bookings/${id}/accept`, { method: "PUT" });
      showToast("Booking accepted.");
      fetchBookings();
    } catch (err) {
      console.error("Failed accepting booking:", err);
      showToast("Failed to accept booking.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await apiClient(`/api/v1/technician/bookings/${id}/reject`, { method: "PUT" });
      showToast("Booking request rejected.");
      fetchBookings();
    } catch (err) {
      console.error("Failed rejecting booking:", err);
      showToast("Failed to reject booking.");
    }
  };

  const handleStart = async (id: string) => {
    try {
      await apiClient(`/api/v1/technician/bookings/${id}/start`, { method: "PUT" });
      showToast("Service started.");
      fetchBookings();
    } catch (err) {
      console.error("Failed starting service:", err);
      showToast("Failed to start service.");
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await apiClient(`/api/v1/technician/bookings/${id}/complete`, { method: "PUT" });
      showToast("Service completed successfully.");
      fetchBookings();
    } catch (err) {
      console.error("Failed completing service:", err);
      showToast("Failed to complete service.");
    }
  };

  const handleLogout = () => {
    setAccessToken(null);
    localStorage.removeItem("dwellix_access_token");
    router.push("/technician/login");
  };

  // Filter lists based on tab
  const getFilteredBookings = () => {
    return bookings.filter((b) => {
      const status = (b.bookingStatus || b.status || "").toUpperCase();
      if (activeTab === "Pending") {
        return status === "REQUESTED";
      }
      if (activeTab === "Accepted") {
        return status === "ACCEPTED" || status === "IN_PROGRESS" || status === "TRAVELLING" || status === "ARRIVED";
      }
      if (activeTab === "Queue") {
        return status === "QUEUED";
      }
      if (activeTab === "Completed") {
        return status === "COMPLETED" || status === "PAID";
      }
      return false;
    });
  };

  const filtered = getFilteredBookings();

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FB] text-slate-800 font-sans text-left relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-xs md:text-sm font-bold px-5 py-3 rounded-2xl shadow-xl z-50 flex items-center gap-2">
          <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

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
            const isActive = item.name === "Bookings" || (activeTab === "Queue" && item.name === "Queue");
            return (
              <button
                key={item.name}
                onClick={() => {
                  if (item.name === "Dashboard") router.push(item.href);
                  else if (item.name === "Queue") setActiveTab("Queue");
                  else setActiveTab("Pending");
                }}
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
          <h1 className="text-base font-bold text-slate-800 tracking-tight">Manage Bookings</h1>
          <div className="flex items-center gap-4">
            <button onClick={fetchBookings} className="text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 cursor-pointer">
              Refresh
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
        <main className="flex-1 overflow-y-auto p-8 max-w-5xl w-full mx-auto space-y-6">
          {/* Tabs header */}
          <div className="flex border-b border-slate-200 gap-6">
            {(["Pending", "Accepted", "Queue", "Completed"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-xs font-bold transition-all relative cursor-pointer ${
                  activeTab === tab ? "text-slate-950" : "text-slate-400 hover:text-slate-650"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-950 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Bookings cards grid */}
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400 font-bold">
              Loading service queue...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-slate-200 rounded-[24px] bg-white flex flex-col items-center justify-center p-6 space-y-2">
              <AlertTriangle className="h-6 w-6 text-slate-350" />
              <div className="text-xs font-bold text-slate-800">No Bookings Found</div>
              <p className="text-[10px] text-slate-400 max-w-xs">
                There are currently no repair bookings registered in the {activeTab.toLowerCase()} list.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((booking) => {
                const isRequested = (booking.bookingStatus || booking.status || "").toUpperCase() === "REQUESTED";
                const isAccepted = (booking.bookingStatus || booking.status || "").toUpperCase() === "ACCEPTED";
                const isInProgress = (booking.bookingStatus || booking.status || "").toUpperCase() === "IN_PROGRESS";
                const isCompleted = ["COMPLETED", "PAID"].includes((booking.bookingStatus || booking.status || "").toUpperCase());

                return (
                  <Card key={booking.id} className="bg-white border border-slate-200/60 p-6 rounded-[24px] shadow-sm flex flex-col justify-between space-y-5">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block">
                          Service Slot &bull; {booking.bookingDate}
                        </span>
                        <h3 className="text-sm font-black text-slate-900">
                          {booking.brand} {booking.model}
                        </h3>
                        <p className="text-[10px] text-blue-600 font-bold flex items-center gap-1 mt-0.5">
                          <Cpu className="h-3 w-3" /> {booking.applianceName}
                        </p>
                      </div>
                      <span className={`px-2.5 py-0.5 border rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                        isCompleted ? "text-emerald-700 bg-emerald-50 border-emerald-100" :
                        isInProgress ? "text-purple-700 bg-purple-50 border-purple-100" :
                        isAccepted ? "text-blue-700 bg-blue-50 border-blue-100" :
                        "text-amber-700 bg-amber-50 border-amber-100"
                      }`}>
                        {booking.bookingStatus || booking.status}
                      </span>
                    </div>

                    {/* Metadata specs */}
                    <div className="space-y-2 text-xs border-t border-b border-slate-50 py-3.5">
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                        <span className="font-bold text-slate-700">{booking.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <Phone className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                        <span className="text-slate-600">{booking.customerPhone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                        <span className="text-slate-550 leading-tight">{booking.customerAddress}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                        <span className="text-slate-550 font-bold">{booking.bookingTime}</span>
                      </div>
                    </div>

                    {/* Problem Description */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block">
                        Customer problem description
                      </span>
                      <p className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                        {booking.problemDescription}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3 pt-2">
                      {isRequested && (
                        <>
                          <Button
                            onClick={() => handleAccept(booking.id)}
                            className="flex-1 h-9 rounded-xl text-xs font-bold bg-black text-white hover:bg-black/90 cursor-pointer shadow-sm"
                          >
                            Accept
                          </Button>
                          <Button
                            onClick={() => handleReject(booking.id)}
                            variant="outline"
                            className="flex-1 h-9 rounded-xl text-xs font-bold border-slate-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                          >
                            Reject
                          </Button>
                        </>
                      )}

                      {isAccepted && (
                        <Button
                          onClick={() => handleStart(booking.id)}
                          className="w-full h-9 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                        >
                          <Play className="h-3.5 w-3.5 fill-current" />
                          <span>Start Service</span>
                        </Button>
                      )}

                      {isInProgress && (
                        <Button
                          onClick={() => handleComplete(booking.id)}
                          className="w-full h-9 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                        >
                          <CheckSquare className="h-3.5 w-3.5" />
                          <span>Complete Service</span>
                        </Button>
                      )}

                      {isCompleted && (
                        <div className="w-full text-center text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50/50 py-2 border border-emerald-100 rounded-xl">
                          Service completed
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
