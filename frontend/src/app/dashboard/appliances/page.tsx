"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import {
  Search, Filter, ArrowUpDown, Plus, Trash2, Edit2, Wrench, Bot, 
  ShieldCheck, Calendar, Layers, Activity, ChevronRight, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Appliance {
  id: string;
  name: string;
  brand: string;
  model: string;
  roomName: string;
  roomId: string;
  purchaseDate: string;
  warrantyExpiry: string;
  photoFileName: string;
  warrantyStatus: string;
  healthScore: number;
  lastMaintenance: string;
}

export default function AppliancesPage() {
  const router = useRouter();
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roomFilter, setRoomFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchAppliances = useCallback(() => {
    apiClient<Appliance[]>("/api/v1/appliances")
      .then((data) => setAppliances(data))
      .catch((err) => {
        console.error("Failed to load appliances:", err);
        setError("Could not load appliance records. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      await Promise.resolve();
      if (active) {
        fetchAppliances();
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [fetchAppliances]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this appliance?")) return;

    try {
      await apiClient(`/api/v1/onboarding/appliances/${id}`, {
        method: "DELETE"
      });
      showToast("Appliance deleted successfully.");
      fetchAppliances();
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      console.error("Failed to delete appliance:", err);
      showToast(apiErr?.message ?? "Error deleting appliance.");
    }
  };

  // Get unique rooms for filter
  const rooms = useMemo(() => {
    const list = appliances.map((a) => a.roomName);
    return Array.from(new Set(list));
  }, [appliances]);

  // Filter & Sort logic
  const filteredAppliances = useMemo(() => {
    let result = [...appliances];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.brand.toLowerCase().includes(q) ||
          a.model.toLowerCase().includes(q)
      );
    }

    if (roomFilter !== "all") {
      result = result.filter((a) => a.roomName === roomFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((a) => a.warrantyStatus.toLowerCase() === statusFilter.toLowerCase());
    }

    result.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "health") {
        return b.healthScore - a.healthScore;
      }
      if (sortBy === "date") {
        return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
      }
      return 0;
    });

    return result;
  }, [appliances, search, roomFilter, statusFilter, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const total = appliances.length;
    const healthy = appliances.filter(a => a.healthScore >= 90).length;
    const needsService = appliances.filter(a => a.healthScore < 90).length;
    const warrantyActive = appliances.filter(a => a.warrantyStatus.toLowerCase() === "covered").length;
    return { total, healthy, needsService, warrantyActive };
  }, [appliances]);

  const HealthRing = ({ score }: { score: number }) => {
    const radius = 16;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 90 ? "stroke-emerald-500" : score >= 75 ? "stroke-amber-500" : "stroke-rose-500";
    
    return (
      <div className="relative flex items-center justify-center h-10 w-10">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="20" cy="20" r={radius} className="stroke-[#ECECEC] fill-none" strokeWidth="3" />
          <motion.circle
            cx="20" cy="20" r={radius}
            className={`${color} fill-none`} strokeWidth="3" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <span className="absolute text-[9px] font-extrabold text-foreground">{score}</span>
      </div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
  };

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto p-6 md:p-10 space-y-10 min-h-screen bg-background">
        <div className="h-12 w-64 bg-slate-200 rounded-xl animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-slate-200 rounded-[24px] animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {[1,2,3].map(i => <div key={i} className="h-[400px] bg-slate-200 rounded-[24px] animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1400px] mx-auto p-6 md:p-10 min-h-[60vh] flex flex-col items-center justify-center bg-background">
        <div className="h-16 w-16 rounded-[22px] bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-4">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Error Loading Appliances</h2>
        <p className="text-sm text-[#6B7280] mb-6">{error}</p>
        <Button onClick={fetchAppliances} className="rounded-xl px-6 bg-black text-white hover:bg-black/90">Retry</Button>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-10 space-y-10 bg-background min-h-screen text-left font-sans">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 10 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-black text-white text-xs md:text-sm font-bold px-6 py-4 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.2)] z-50 flex items-center gap-3 border border-slate-800"
          >
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-primary-soft text-primary rounded-md border border-primary/20/50">
            Appliance Management
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mt-4 leading-none">
            Appliance Fleet
          </h1>
          <p className="text-[#6B7280] mt-3 text-sm md:text-base font-medium max-w-xl">
            Monitor device health, track warranty expirations, and schedule preventative maintenance across your home.
          </p>
        </div>
        <Link href="/onboarding/appliances">
          <Button className="h-11 px-6 rounded-xl font-bold text-sm bg-black hover:bg-black/90 text-white shadow-sm transition-all cursor-pointer flex items-center gap-2">
            <Plus className="h-4.5 w-4.5" />
            <span>Add Appliance</span>
          </Button>
        </Link>
      </div>

      {/* Statistics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white border border-border rounded-[24px] p-5 md:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.01)] hover:-translate-y-0.5 transition-transform">
          <div className="flex items-center gap-3 text-[#6B7280] font-bold text-xs uppercase tracking-wider mb-3">
            <Layers className="h-4 w-4 text-primary" />
            Total Devices
          </div>
          <div className="text-3xl md:text-4xl font-black text-foreground tracking-tighter">{stats.total}</div>
        </div>
        <div className="bg-white border border-border rounded-[24px] p-5 md:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.01)] hover:-translate-y-0.5 transition-transform">
          <div className="flex items-center gap-3 text-[#6B7280] font-bold text-xs uppercase tracking-wider mb-3">
            <Activity className="h-4 w-4 text-emerald-500" />
            Healthy
          </div>
          <div className="text-3xl md:text-4xl font-black text-foreground tracking-tighter">{stats.healthy}</div>
        </div>
        <div className="bg-white border border-border rounded-[24px] p-5 md:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.01)] hover:-translate-y-0.5 transition-transform">
          <div className="flex items-center gap-3 text-[#6B7280] font-bold text-xs uppercase tracking-wider mb-3">
            <Wrench className="h-4 w-4 text-rose-500" />
            Needs Service
          </div>
          <div className="text-3xl md:text-4xl font-black text-foreground tracking-tighter">{stats.needsService}</div>
        </div>
        <div className="bg-white border border-border rounded-[24px] p-5 md:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.01)] hover:-translate-y-0.5 transition-transform">
          <div className="flex items-center gap-3 text-[#6B7280] font-bold text-xs uppercase tracking-wider mb-3">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Active Warranty
          </div>
          <div className="text-3xl md:text-4xl font-black text-foreground tracking-tighter">{stats.warrantyActive}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border border-border rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        <div className="flex-1 flex items-center gap-3 bg-background border border-border rounded-xl px-4 py-2.5 focus-within:border-primary transition-colors">
          <Search className="h-4.5 w-4.5 text-[#6B7280] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search appliances, brands, models..."
            className="bg-transparent border-0 outline-none text-sm w-full text-foreground placeholder:text-[#6B7280]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#6B7280]" />
            <select
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              className="text-xs font-semibold text-foreground bg-white border border-border rounded-xl px-3 py-2.5 outline-none cursor-pointer"
            >
              <option value="all">All Rooms</option>
              {rooms.map((room) => <option key={room} value={room}>{room}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#6B7280]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-semibold text-foreground bg-white border border-border rounded-xl px-3 py-2.5 outline-none cursor-pointer"
            >
              <option value="all">All Warranties</option>
              <option value="covered">Covered</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-[#6B7280]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-semibold text-foreground bg-white border border-border rounded-xl px-3 py-2.5 outline-none cursor-pointer"
            >
              <option value="name">Sort by Name</option>
              <option value="health">Sort by Health</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        {filteredAppliances.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-white border-dashed border-2 border-border rounded-[32px] shadow-sm max-w-2xl mx-auto"
          >
            <div className="h-16 w-16 rounded-[22px] bg-primary-soft border border-primary/20 text-primary flex items-center justify-center mx-auto mb-6">
              <Layers className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-extrabold text-foreground mb-2">No Appliances Found</h3>
            <p className="text-sm text-[#6B7280] max-w-sm mx-auto mb-6 font-medium leading-relaxed">
              Register new appliances to monitor health status, track warranties, and view diagnostic logs.
            </p>
            <Link href="/onboarding/appliances">
              <Button className="rounded-xl font-bold text-sm h-11 px-6 bg-black text-white hover:bg-black/90 transition-all">
                Add Appliance
              </Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {filteredAppliances.map((appliance) => (
              <motion.div
                key={appliance.id}
                variants={cardVariants}
                whileHover={{ y: -6, boxShadow: "0 24px 48px rgba(0,0,0,0.06)" }}
                className="group bg-white border border-border rounded-[28px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.03)] transition-all cursor-pointer flex flex-col min-h-[460px] relative"
                onClick={() => router.push(`/dashboard/appliances/${appliance.id}`)}
              >
                {/* Photo Area */}
                <div className="h-[220px] w-full bg-background relative flex items-center justify-center border-b border-border overflow-hidden">
                  {appliance.photoFileName ? (
                    <img
                      src={appliance.photoFileName}
                      alt={appliance.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-300">
                      <Bot className="h-10 w-10 mb-2 opacity-50" />
                      <span className="text-[10px] uppercase font-bold tracking-widest">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  {/* Floating Action Top Left */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider border shadow-sm backdrop-blur-md ${
                      appliance.warrantyStatus.toLowerCase() === "covered" 
                      ? "bg-emerald-500/90 text-white border-emerald-400" 
                      : "bg-white/90 text-foreground border-border"
                    }`}>
                      {appliance.warrantyStatus}
                    </span>
                  </div>

                  {/* Floating Action Top Right (Health Ring) */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl p-1 shadow-sm border border-border">
                    <HealthRing score={appliance.healthScore} />
                  </div>
                </div>

                {/* Details Area */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] text-primary bg-primary-soft border border-primary/20/50 px-2 py-0.5 rounded-md font-extrabold uppercase tracking-widest w-max mb-3">
                      {appliance.brand}
                    </div>
                    <h3 className="font-extrabold text-xl text-foreground line-clamp-1 leading-tight group-hover:text-primary transition-colors">
                      {appliance.name}
                    </h3>
                    <p className="text-xs text-[#6B7280] font-medium mt-1 truncate">
                      {appliance.model}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6 text-xs text-[#6B7280] font-medium">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Layers className="h-3.5 w-3.5" />
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Location</span>
                      </div>
                      <div className="text-foreground font-semibold">{appliance.roomName}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Purchased</span>
                      </div>
                      <div className="text-foreground font-semibold">{appliance.purchaseDate}</div>
                    </div>
                  </div>

                  {/* Maintenance Indicator */}
                  <div className="mt-5 p-3 rounded-xl bg-background border border-border flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2 text-[#6B7280]">
                      <Wrench className="h-4 w-4" />
                      <span>Last Serviced</span>
                    </div>
                    <span className="text-foreground">{appliance.lastMaintenance}</span>
                  </div>
                </div>

                {/* Hover Actions Footer */}
                <div className="px-6 pb-6 pt-0 flex items-center justify-end gap-2 relative z-20">
                  <Link href={`/dashboard/appliances/${appliance.id}`} onClick={(e) => e.stopPropagation()} className="flex-1">
                    <Button className="w-full bg-black hover:bg-black/90 text-white rounded-xl h-10 font-bold text-xs shadow-sm flex items-center gap-1.5">
                      View Details
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/onboarding/appliances" onClick={(e) => e.stopPropagation()}>
                    <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-border text-foreground hover:bg-slate-50 transition-colors shadow-sm" title="Edit">
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </Link>
                  <button
                    onClick={(e) => handleDelete(appliance.id, e)}
                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-border text-foreground hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-colors shadow-sm"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
