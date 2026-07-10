"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Star,
  Download,
  CheckCircle2
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

  const fetchBookings = useCallback(() => {
    apiClient<Booking[]>("/api/v1/bookings")
      .then((data) => setBookings(data))
      .catch((err) => {
        console.error("Failed to fetch bookings:", err);
        setError("Could not load booking records.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      await Promise.resolve();
      if (active) {
        fetchBookings();
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [fetchBookings]);

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return "text-emerald-700 bg-emerald-50/80 border-emerald-100/50";
      case "CONFIRMED":
        return "text-blue-700 bg-blue-50/80 border-blue-100/50";
      case "IN_PROGRESS":
        return "text-purple-700 bg-purple-50/80 border-purple-100/50";
      case "CANCELLED":
        return "text-rose-700 bg-rose-50/80 border-rose-100/50";
      case "PENDING":
      default:
        return "text-amber-700 bg-amber-50/80 border-amber-100/50";
    }
  };

  const getStatusPill = (status: string) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold tracking-wide rounded-full bg-emerald-50 border border-emerald-150 text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Completed
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold tracking-wide rounded-full bg-blue-50 border border-blue-150 text-blue-700">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Confirmed
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold tracking-wide rounded-full bg-purple-50 border border-purple-150 text-purple-700">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            On Site
          </span>
        );
      case "CANCELLED":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold tracking-wide rounded-full bg-rose-50 border border-rose-150 text-rose-700">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-450" />
            Cancelled
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold tracking-wide rounded-full bg-amber-50 border border-amber-150 text-amber-700">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Pending Assignment
          </span>
        );
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

  // Statistics calculation
  const stats = useMemo(() => {
    const upcoming = bookings.filter((b) =>
      ["PENDING", "CONFIRMED", "IN_PROGRESS"].includes(b.status?.toUpperCase())
    ).length;
    const completed = bookings.filter((b) => b.status?.toUpperCase() === "COMPLETED").length;
    const available = 0;
    const rating = 0;
    return { upcoming, completed, available, rating };
  }, [bookings]);

  // Dynamic booking categories when search is empty
  const activeBookings = useMemo(() => {
    return filteredBookings.filter((b) =>
      ["PENDING", "CONFIRMED", "IN_PROGRESS"].includes(b.status?.toUpperCase())
    );
  }, [filteredBookings]);

  const pastBookings = useMemo(() => {
    return filteredBookings.filter((b) =>
      ["COMPLETED", "CANCELLED"].includes(b.status?.toUpperCase())
    );
  }, [filteredBookings]);

  // Simulate progress percentages for tracking bar
  const getProgressPercentage = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return 20;
      case "CONFIRMED":
        return 50;
      case "IN_PROGRESS":
        return 80;
      case "COMPLETED":
        return 100;
      default:
        return 0;
    }
  };

  const handleDownloadInvoice = (e: React.MouseEvent, bookingId: string) => {
    e.preventDefault();
    e.stopPropagation();
    alert(`Downloading invoice receipt for booking #${bookingId}...`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] py-8 px-4 sm:px-6 lg:px-8 text-left font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-blue-50/80 border border-blue-100/50 text-blue-600">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Dwellix Elite Care</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-heading font-extrabold tracking-tight text-slate-900">
              Service Bookings
            </h1>
            <p className="text-xs sm:text-sm text-slate-550 max-w-xl">
              Monitor real-time dispatches, review past repairs, and coordinate certified support for your appliances.
            </p>
          </div>

          <Link href="/dashboard/bookings/new">
            <Button className="rounded-2xl font-semibold text-xs sm:text-sm h-11 px-5 gap-2 flex items-center shadow-lg bg-blue-600 hover:bg-blue-700 text-white transition-all transform hover:scale-[1.02] cursor-pointer">
              <Plus className="h-4.5 w-4.5" />
              <span>Book New Service</span>
            </Button>
          </Link>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Upcoming Visits</span>
              <span className="p-1.5 rounded-xl bg-blue-50 text-blue-600">
                <Calendar className="h-4 w-4" />
              </span>
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl font-bold text-slate-900 font-heading">{stats.upcoming}</div>
              <div className="text-[10px] text-slate-400 font-medium">Scheduled dispatches</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Completed Jobs</span>
              <span className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
              </span>
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl font-bold text-slate-900 font-heading">{stats.completed}</div>
              <div className="text-[10px] text-slate-400 font-medium">Resolved issues</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">On Duty</span>
              <span className="p-1.5 rounded-xl bg-purple-50 text-purple-600">
                <Wrench className="h-4 w-4" />
              </span>
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl font-bold text-slate-900 font-heading">{stats.available}</div>
              <div className="text-[10px] text-slate-400 font-medium">Technicians nearby</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Average Rating</span>
              <span className="p-1.5 rounded-xl bg-amber-50 text-amber-600">
                <Star className="h-4 w-4 fill-current text-amber-500" />
              </span>
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl font-bold text-slate-900 font-heading flex items-baseline gap-1">
                <span>{stats.rating > 0 ? stats.rating : "N/A"}</span>
                {stats.rating > 0 && <span className="text-xs text-slate-400">/5</span>}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Top tier standard</div>
            </div>
          </motion.div>
        </div>

        {/* Filter and Control Bar */}
        <div className="bg-white border border-slate-150/40 rounded-3xl p-4 shadow-sm flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by appliance, service type, or technician..."
              className="pl-10 h-10 rounded-2xl border-slate-150 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm bg-[#F8F9FB] border-0"
            />
          </div>

          <div className="flex flex-wrap gap-2.5 font-sans">
            <div className="flex items-center gap-1.5 bg-[#F8F9FB] rounded-2xl px-3 border border-slate-100">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 bg-transparent text-xs font-semibold focus:outline-none text-slate-700 cursor-pointer"
              >
                <option value="all">All Services</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-[#F8F9FB] rounded-2xl px-3 border border-slate-100">
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 bg-transparent text-xs font-semibold focus:outline-none text-slate-700 cursor-pointer"
              >
                <option value="date">Sort by Date</option>
                <option value="cost">Sort by Cost</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading state - SKELETON PULSE */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((n) => (
              <div key={n} className="rounded-[24px] border border-slate-100 bg-white p-6 space-y-4 animate-pulse text-left">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-slate-100" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-100 rounded-md w-3/4" />
                    <div className="h-3 bg-slate-100 rounded-md w-1/2" />
                  </div>
                </div>
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <div className="h-3 bg-slate-100 rounded-md w-5/6" />
                  <div className="h-3 bg-slate-100 rounded-md w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="p-6 rounded-[24px] bg-rose-50/80 border border-rose-100/50 text-rose-850 text-xs md:text-sm font-medium flex items-start gap-4 max-w-xl mx-auto shadow-sm text-left">
            <AlertTriangle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <div className="font-extrabold text-rose-900">Connection Interrupted</div>
              <p className="text-rose-700 leading-relaxed">{error}</p>
              <Button onClick={() => window.location.reload()} className="h-9 rounded-xl text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer">
                Reload bookings
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredBookings.length === 0 && (
          <div className="text-center py-16 max-w-md mx-auto space-y-5 bg-white border border-slate-100 rounded-[24px] p-8 shadow-sm">
            <div className="h-16 w-16 rounded-2xl bg-[#F8F9FB] border border-slate-100 text-slate-400 flex items-center justify-center mx-auto shadow-inner">
              <Wrench className="h-8 w-8 text-blue-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">No services scheduled</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect with our premium pool of appliance repair experts. Keep your home running smoothly.
              </p>
            </div>
            <Link href="/dashboard/bookings/new">
              <Button className="rounded-xl font-bold text-xs h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer mt-1">
                Book Technician Now
              </Button>
            </Link>
          </div>
        )}

        {/* Bookings Lists */}
        {!loading && !error && filteredBookings.length > 0 && (
          <div className="space-y-8">
            {/* Active Bookings (Current Booking Cards) */}
            {activeBookings.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Active Assignments</h2>
                  <span className="text-[10px] font-extrabold text-slate-500 bg-white border border-slate-100 px-3 py-1 rounded-full shadow-sm">
                    {activeBookings.length} Active
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeBookings.map((booking) => (
                    <Link href={`/dashboard/bookings/${booking.id}`} key={booking.id}>
                      <motion.div
                        whileHover={{ y: -4 }}
                        className="group bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-5 flex flex-col justify-between"
                      >
                        <div className="space-y-4">
                          {/* Header section */}
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">
                                {booking.brand} &bull; {booking.model}
                              </span>
                              <h3 className="font-heading font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors text-sm sm:text-base truncate mt-0.5">
                                {booking.applianceName}
                              </h3>
                            </div>
                            {getStatusPill(booking.status)}
                          </div>

                          {/* Problem Details */}
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {booking.problemDescription}
                          </p>

                          {/* Visual progress bar */}
                          <div className="space-y-2 pt-2">
                            <div className="flex items-center justify-between text-[10px] font-bold tracking-wide uppercase text-slate-400">
                              <span>Tracking Status</span>
                              <span className="text-blue-600 font-extrabold">
                                {getProgressPercentage(booking.status)}%
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${getProgressPercentage(booking.status)}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="h-full bg-blue-600 rounded-full"
                              />
                            </div>
                            <div className="flex justify-between text-[9px] font-medium text-slate-400 mt-1">
                              <span>Request Sent</span>
                              <span>Assigned</span>
                              <span>Service Started</span>
                            </div>
                          </div>
                        </div>

                        {/* Meta Grid */}
                        <div className="pt-4 border-t border-slate-50 grid grid-cols-2 gap-y-3 gap-x-4 text-[11px] text-slate-500 font-medium">
                          <div className="flex items-center gap-2 truncate">
                            <span className="p-1 rounded-lg bg-slate-50 text-slate-400">
                              <User className="h-3.5 w-3.5" />
                            </span>
                            <span className="truncate">Tech: {booking.technicianName || "Unassigned"}</span>
                          </div>
                          <div className="flex items-center gap-2 truncate">
                            <span className="p-1 rounded-lg bg-slate-50 text-slate-400">
                              <Wrench className="h-3.5 w-3.5" />
                            </span>
                            <span>{booking.serviceType}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="p-1 rounded-lg bg-slate-50 text-slate-400">
                              <Calendar className="h-3.5 w-3.5" />
                            </span>
                            <span>{booking.bookingDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="p-1 rounded-lg bg-slate-50 text-slate-400">
                              <Clock className="h-3.5 w-3.5" />
                            </span>
                            <span className="truncate">{booking.bookingTime}</span>
                          </div>

                          <div className="col-span-2 pt-3 border-t border-slate-50/50 flex items-center justify-between text-xs text-slate-800 font-bold">
                            <span>Estimated Budget</span>
                            <span className="text-blue-600 font-extrabold text-sm sm:text-base">
                              ₹{booking.estimatedCost.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Past Services (Service History) */}
            {pastBookings.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Service History</h2>
                  <span className="text-[10px] font-extrabold text-slate-500 bg-white border border-slate-100 px-3 py-1 rounded-full shadow-sm">
                    {pastBookings.length} Recorded
                  </span>
                </div>

                <div className="space-y-3">
                  {pastBookings.map((booking) => (
                    <Link href={`/dashboard/bookings/${booking.id}`} key={booking.id} className="block">
                      <motion.div
                        whileHover={{ x: 3 }}
                        className="group bg-white border border-slate-100 rounded-[24px] p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left"
                      >
                        {/* Left Appliance & Tech Meta */}
                        <div className="flex items-center gap-4 flex-1">
                          <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:border-blue-100 group-hover:text-blue-600 transition-colors">
                            <Wrench className="h-5 w-5" />
                          </div>
                          <div className="space-y-0.5 max-w-xs sm:max-w-md">
                            <div className="flex items-center gap-2">
                              <h3 className="font-heading font-extrabold text-slate-900 text-sm sm:text-base">
                                {booking.applianceName}
                              </h3>
                              <span className={`px-2 py-0.5 border text-[9px] font-extrabold uppercase rounded-full ${getStatusColor(booking.status)}`}>
                                {booking.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-semibold uppercase">
                              {booking.brand} &bull; {booking.model} &bull; {booking.serviceType}
                            </p>
                          </div>
                        </div>

                        {/* Mid Details */}
                        <div className="grid grid-cols-2 sm:flex sm:items-center gap-x-6 gap-y-2 text-[11px] font-medium text-slate-500 pr-4">
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-slate-400 uppercase font-bold block">Technician</span>
                            <span className="text-slate-700 font-semibold">{booking.technicianName || "N/A"}</span>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-slate-400 uppercase font-bold block">Service Date</span>
                            <span className="text-slate-700 font-semibold">{booking.bookingDate}</span>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-slate-400 uppercase font-bold block">Cost Paid</span>
                            <span className="text-slate-900 font-extrabold">₹{booking.estimatedCost.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Right CTA Actions */}
                        <div className="flex items-center gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-slate-50">
                          {booking.status?.toUpperCase() === "COMPLETED" && (
                            <button
                              onClick={(e) => handleDownloadInvoice(e, booking.id)}
                              className="flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-xl border border-slate-200 text-slate-650 hover:bg-slate-50 text-[11px] font-bold cursor-pointer transition-colors"
                              title="Download Invoice Receipt"
                            >
                              <Download className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Receipt</span>
                            </button>
                          )}
                          <Link href={`/dashboard/bookings/new?technician=${encodeURIComponent(booking.technicianName || "")}`} className="flex-1 sm:flex-initial">
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="w-full flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold cursor-pointer transition-colors"
                            >
                              <span>Rebook</span>
                              <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                          </Link>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
