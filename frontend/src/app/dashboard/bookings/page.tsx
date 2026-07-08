"use client";

import React, { useState, useEffect, useMemo } from "react";
import { apiClient } from "@/lib/api-client";
import {
  Calendar,
  Clock,
  User,
  Wrench,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Bot,
  AlertTriangle,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Booking {
  id: string;
  userId: string;
  applianceId: string;
  applianceName: string;
  brand: string;
  model: string;
  technicianName: string;
  technicianPhone: string;
  serviceType: string;
  problemDescription: string;
  bookingDate: string;
  bookingTime: string;
  status: string;
  estimatedCost: number;
  createdAt: string;
  updatedAt: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    apiClient<Booking[]>("/api/v1/bookings")
      .then((data) => setBookings(data))
      .catch((err) => {
        console.error("Failed to fetch bookings:", err);
        setError("Could not load booking records.");
      })
      .finally(() => setLoading(false));
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return "text-emerald-700 bg-emerald-50 border-emerald-100";
      case "CONFIRMED":
        return "text-blue-700 bg-blue-50 border-blue-100";
      case "IN_PROGRESS":
        return "text-purple-700 bg-purple-50 border-purple-100";
      case "CANCELLED":
        return "text-rose-700 bg-rose-50 border-rose-100";
      case "PENDING":
      default:
        return "text-amber-700 bg-amber-50 border-amber-100";
    }
  };

  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.applianceName.toLowerCase().includes(q) ||
          b.serviceType.toLowerCase().includes(q) ||
          (b.technicianName && b.technicianName.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((b) => b.status?.toUpperCase() === statusFilter.toUpperCase());
    }

    result.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime();
      }
      if (sortBy === "cost") {
        return b.estimatedCost - a.estimatedCost;
      }
      return 0;
    });

    return result;
  }, [bookings, search, statusFilter, sortBy]);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div className="space-y-1">
          <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-primary/10 text-primary rounded-full">
            Service Dispatch
          </span>
          <h1 className="text-xl md:text-3xl font-heading font-extrabold tracking-tight text-slate-900">
            My Bookings
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            Track pending, scheduled, and completed technician support dispatches.
          </p>
        </div>

        <Link href="/dashboard/bookings/new">
          <Button className="rounded-2xl font-bold text-xs h-10 gap-2 flex items-center shadow bg-primary text-white cursor-pointer">
            <Plus className="h-4 w-4" />
            <span>Book Technician</span>
          </Button>
        </Link>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-slate-400" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bookings..."
            className="pl-9 h-10 rounded-xl border-slate-200 focus:ring-primary focus:border-primary text-xs"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700"
          >
            <option value="date">Sort by Date</option>
            <option value="cost">Sort by Cost</option>
          </select>
        </div>
      </div>

      {/* Loading state - SKELETON PULSE */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((n) => (
            <div key={n} className="rounded-3xl border border-slate-100 bg-white/70 p-5 space-y-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-slate-200" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                  <div className="h-3 bg-slate-200 rounded-md w-1/2" />
                </div>
              </div>
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="h-3 bg-slate-200 rounded-md w-5/6" />
                <div className="h-3 bg-slate-200 rounded-md w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="p-6 rounded-3xl bg-rose-50 border border-rose-100 text-rose-850 text-xs md:text-sm font-medium flex items-start gap-3.5 max-w-xl mx-auto shadow-sm text-left">
          <AlertTriangle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <div className="font-extrabold text-rose-900">Fetch Failed</div>
            <p className="text-rose-700 leading-relaxed">{error}</p>
            <Button onClick={() => window.location.reload()} className="h-8 rounded-lg text-xs bg-rose-600 text-white font-bold cursor-pointer">
              Retry Connection
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredBookings.length === 0 && (
        <div className="text-center py-16 max-w-md mx-auto space-y-5 bg-white border border-slate-150 rounded-3xl p-8 shadow-sm">
          <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center mx-auto shadow-sm animate-pulse">
            <Wrench className="h-7 w-7 opacity-50 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">No bookings yet</h3>
            <p className="text-xs text-slate-450 leading-relaxed">
              Schedule a Dwellix-certified service technician to inspect, clean, or repair your appliances.
            </p>
          </div>
          <Link href="/dashboard/bookings/new">
            <Button className="rounded-xl font-bold text-xs h-9 px-5 bg-primary text-white cursor-pointer hover:bg-primary/95 mt-1">
              Book Technician
            </Button>
          </Link>
        </div>
      )}

      {/* Bookings Grid */}
      {!loading && !error && filteredBookings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBookings.map((booking) => (
            <Link href={`/dashboard/bookings/${booking.id}`} key={booking.id}>
              <motion.div
                whileHover={{ y: -3 }}
                className="group bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                        {booking.brand} &bull; {booking.model}
                      </span>
                      <h3 className="font-heading font-extrabold text-slate-900 group-hover:text-primary transition-colors text-sm md:text-base truncate">
                        {booking.applianceName}
                      </h3>
                    </div>

                    <span className={`px-2 py-0.5 border rounded-full text-[9px] font-extrabold uppercase tracking-wide shadow-sm flex-shrink-0 ${getStatusColor(booking.status)}`}>
                      {booking.status || "Pending"}
                    </span>
                  </div>

                  {/* Problem details */}
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {booking.problemDescription}
                  </p>
                </div>

                {/* Meta details */}
                <div className="pt-3.5 border-t border-slate-50 grid grid-cols-2 gap-y-2 gap-x-4 text-[11px] text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5 truncate">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <span>Tech: {booking.technicianName || "Unassigned"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wrench className="h-3.5 w-3.5 text-slate-400" />
                    <span>{booking.serviceType}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{booking.bookingDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{booking.bookingTime}</span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-50/50 flex items-center justify-between text-xs text-slate-700 font-extrabold">
                    <span>Estimated Cost</span>
                    <span className="text-indigo-600 font-extrabold">₹{booking.estimatedCost.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Dummy loader component to prevent missing definition compile bugs
function Loader2({ className, ...props }: any) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
