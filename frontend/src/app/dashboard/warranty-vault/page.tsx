"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/lib/api-client";
import { 
  ShieldCheck, ShieldAlert, Calendar, Search, Plus, Filter, ArrowUpDown, 
  UploadCloud, FileText, Sparkles, DollarSign, Clock, ShieldX, Eye, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/image-upload";

interface Appliance {
  id: string;
  name: string;
  brand: string;
  model: string;
  purchaseDate?: string;
  warrantyExpiry: string;
  warrantyStatus: string;
  purchasePrice?: number;
  photoFileName?: string;
  invoiceFileName?: string;
}

function formatIndianDate(dateString: string | Date): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";
  const day = d.getDate();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export default function WarrantyVaultPage() {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "EXPIRED">("ALL");
  interface UploadMetadata {
    imageUrl: string;
    publicId: string;
  }

  const [sortBy, setSortBy] = useState<"expiry-asc" | "expiry-desc" | "brand-asc" | "name-asc">("expiry-asc");
  const [uploadedInvoice, setUploadedInvoice] = useState<UploadMetadata | null>(null);

  const fetchWarranties = useCallback(() => {
    setLoading(true);
    setError(null);
    apiClient<Appliance[]>("/api/v1/appliances")
      .then((data) => setAppliances(data))
      .catch((err) => {
        console.error("Failed to load warranties:", err);
        setError("Unable to retrieve warranty schedules. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      await Promise.resolve();
      if (active) {
        fetchWarranties();
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [fetchWarranties]);

  const getDaysRemaining = (expiryStr: string) => {
    const expiry = new Date(expiryStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Stats calculation
  const stats = useMemo(() => {
    let active = 0;
    let expiringSoon = 0;
    let expired = 0;
    let totalValue = 0;

    appliances.forEach((app) => {
      const daysLeft = getDaysRemaining(app.warrantyExpiry);
      if (daysLeft <= 0) {
        expired++;
      } else {
        active++;
        if (daysLeft <= 30) {
          expiringSoon++;
        }
      }
      if (app.purchasePrice) {
        totalValue += app.purchasePrice;
      }
    });

    return { active, expiringSoon, expired, totalValue };
  }, [appliances]);

  // Filter & Sort
  const processedAppliances = useMemo(() => {
    const result = appliances.filter((item) => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.model.toLowerCase().includes(searchQuery.toLowerCase());

      const daysLeft = getDaysRemaining(item.warrantyExpiry);
      const isExpired = daysLeft <= 0;

      if (statusFilter === "ACTIVE") {
        return matchesSearch && !isExpired;
      }
      if (statusFilter === "EXPIRED") {
        return matchesSearch && isExpired;
      }
      return matchesSearch;
    });

    // Sort
    result.sort((a, b) => {
      if (sortBy === "expiry-asc") {
        return new Date(a.warrantyExpiry).getTime() - new Date(b.warrantyExpiry).getTime();
      }
      if (sortBy === "expiry-desc") {
        return new Date(b.warrantyExpiry).getTime() - new Date(a.warrantyExpiry).getTime();
      }
      if (sortBy === "brand-asc") {
        return a.brand.localeCompare(b.brand);
      }
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return result;
  }, [appliances, searchQuery, statusFilter, sortBy]);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-screen bg-[#F8F9FB] p-10 space-y-10 max-w-[1400px] mx-auto w-full text-left">
        <div className="flex justify-between items-end">
          <div className="space-y-3">
            <Skeleton className="h-10 w-60 rounded-xl" />
            <Skeleton className="h-4 w-96 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-[24px]" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-60 rounded-[28px]" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] bg-[#F8F9FB] p-8 gap-5">
        <div className="h-16 w-16 rounded-[22px] bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Error Loading Warranties</h3>
        <p className="text-sm text-[#6B7280] text-center max-w-sm">{error}</p>
        <Button onClick={fetchWarranties} className="rounded-xl h-11 px-6 bg-black text-white hover:bg-black/90">
          Retry Sync
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-[#F8F9FB] p-8 md:p-12 w-full space-y-12 max-w-[1400px] mx-auto text-left font-sans">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <span className="px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 rounded-full border border-blue-100/50">
            Warranty Vault
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111] leading-none">
            Product Guarantees
          </h1>
          <p className="text-sm sm:text-base text-[#6B7280]">
            Track appliance coverages, purchase receipts, and expiration alerts in one dynamic space.
          </p>
        </div>

        <Link href="/dashboard/appliances" className="w-full md:w-auto">
          <button className="h-12 px-6 rounded-2xl bg-black text-white hover:bg-black/90 font-semibold text-sm transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] active:scale-[0.98] flex items-center justify-center gap-2 w-full md:w-auto cursor-pointer">
            <Plus className="h-4.5 w-4.5" />
            Add Appliance
          </button>
        </Link>
      </div>

      {/* Top statistics rows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active Warranties", value: stats.active, icon: ShieldCheck, color: "text-emerald-500 bg-emerald-50/50 border-emerald-100/50" },
          { label: "Expiring Soon", value: stats.expiringSoon, icon: Clock, color: "text-amber-500 bg-amber-50/50 border-amber-100/50" },
          { label: "Expired Policies", value: stats.expired, icon: ShieldX, color: "text-rose-500 bg-rose-50/50 border-rose-100/50" },
          { 
            label: "Protected Value", 
            value: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(stats.totalValue), 
            icon: DollarSign, 
            color: "text-blue-500 bg-blue-50/50 border-blue-100/50" 
          }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border border-[#ECECEC] rounded-[24px] p-6 shadow-[0_12px_40px_rgba(0,0,0,.03)] flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">{stat.label}</span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">{stat.value}</h3>
              </div>
              <div className={`h-12 w-12 rounded-2xl border flex items-center justify-center ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white border border-[#ECECEC] p-4 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)]">
        
        {/* Search */}
        <div className="flex items-center gap-3 w-full lg:max-w-md bg-[#F8F9FB] px-4 py-2.5 rounded-xl border border-[#ECECEC] focus-within:border-blue-600 transition-colors">
          <Search className="h-4.5 w-4.5 text-[#6B7280]" />
          <input
            placeholder="Search appliance, brand, model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-0 outline-none text-sm w-full text-[#111111] placeholder:text-[#6B7280]"
          />
        </div>

        {/* Filters and Sorting selectors */}
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#6B7280]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "ALL" | "ACTIVE" | "EXPIRED")}
              className="text-xs font-semibold text-[#111111] bg-white border border-[#ECECEC] rounded-xl px-3 py-2 outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-[#6B7280]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "expiry-asc" | "expiry-desc" | "brand-asc" | "name-asc")}
              className="text-xs font-semibold text-[#111111] bg-white border border-[#ECECEC] rounded-xl px-3 py-2 outline-none cursor-pointer"
            >
              <option value="expiry-asc">Expiry Date (Soonest)</option>
              <option value="expiry-desc">Expiry Date (Latest)</option>
              <option value="brand-asc">Brand (A-Z)</option>
              <option value="name-asc">Appliance Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Warranty Grid */}
      <AnimatePresence mode="popLayout">
        {processedAppliances.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center p-20 text-center border-dashed border-2 border-[#ECECEC] bg-white/50 rounded-[28px]"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-blue-50 text-blue-600 mb-5 border border-blue-100">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-[#111111]">No Warranties Found</h3>
            <p className="text-sm text-[#6B7280] mt-2 max-w-sm font-medium leading-relaxed">
              {searchQuery ? "No appliance profiles match the filtered query parameters." : "You do not have any registered warranties. Add your first appliance profile to activate alerts."}
            </p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {processedAppliances.map((app) => {
              const daysLeft = getDaysRemaining(app.warrantyExpiry);
              const isExpired = daysLeft <= 0;
              const ratio = Math.max(0, Math.min(100, isExpired ? 0 : (daysLeft / 365) * 100)); // ratio out of 1 year representation

              return (
                <motion.div
                  key={app.id}
                  variants={itemVariants}
                  whileHover={{ y: -6, boxShadow: "0 24px 48px rgba(0,0,0,0.06)" }}
                  className="bg-white border border-[#ECECEC] rounded-[28px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] p-6 flex flex-col justify-between group transition-all duration-300 relative min-h-[300px]"
                >
                  <div className="space-y-5">
                    {/* Top Brand, Image, Details */}
                    <div className="flex gap-4 items-start">
                      {/* Product Preview box */}
                      <div className="h-16 w-16 rounded-2xl bg-[#F8F9FB] border border-[#ECECEC] overflow-hidden flex items-center justify-center shrink-0">
                        {app.photoFileName ? (
                          <img 
                            src={`${apiBaseUrl}/api/v1/uploads/${app.photoFileName}`} 
                            alt={app.name} 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <FileText className="h-6 w-6 text-[#6B7280]" />
                        )}
                      </div>
                      
                      <div className="text-left space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100/50">
                          {app.brand}
                        </span>
                        <h3 className="text-base font-extrabold text-[#111111] line-clamp-1 leading-snug">
                          {app.name}
                        </h3>
                        <p className="text-xs text-[#6B7280] font-medium">Model: {app.model || "N/A"}</p>
                      </div>
                    </div>

                    {/* Expiration detail rows */}
                    <div className="pt-4 border-t border-[#F8F9FB] space-y-3 text-xs text-[#111111] font-medium text-left">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-[#6B7280]">
                          <Calendar className="h-4 w-4" />
                          <span>Registered Expiry</span>
                        </div>
                        <span className="font-semibold">{formatIndianDate(app.warrantyExpiry)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Circle indicator and buttons */}
                  <div className="mt-8 pt-4 border-t border-[#F8F9FB] flex items-center justify-between">
                    
                    {/* Expiration status indicator circle */}
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 flex items-center justify-center shrink-0">
                        <svg className="absolute transform -rotate-90 w-10 h-10">
                          <circle
                            cx="20"
                            cy="20"
                            r="16"
                            className="stroke-slate-100 fill-none"
                            strokeWidth="3.5"
                          />
                          <circle
                            cx="20"
                            cy="20"
                            r="16"
                            className={`fill-none transition-all duration-500 ${
                              isExpired ? "stroke-rose-500" : daysLeft <= 30 ? "stroke-amber-500" : "stroke-emerald-500"
                            }`}
                            strokeWidth="3.5"
                            strokeDasharray={100}
                            strokeDashoffset={100 - ratio}
                          />
                        </svg>
                        <span className="text-[9px] font-black text-slate-800">
                          {isExpired ? "0%" : `${Math.round(ratio)}%`}
                        </span>
                      </div>

                      <div className="text-left">
                        <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                          isExpired ? "text-rose-500" : daysLeft <= 30 ? "text-amber-500" : "text-emerald-500"
                        }`}>
                          {isExpired ? "Expired" : "Active Coverage"}
                        </span>
                        <span className="text-xs text-[#6B7280] font-medium block">
                          {isExpired ? "0 Days Left" : `${daysLeft} days remaining`}
                        </span>
                      </div>
                    </div>

                    <Link href={`/dashboard/appliances/${app.id}/edit`}>
                      <button className="h-9 px-4 rounded-xl bg-slate-50 border border-[#ECECEC] hover:bg-slate-100 hover:text-black transition-all flex items-center gap-1.5 font-bold text-xs cursor-pointer">
                        <Eye className="h-3.5 w-3.5" />
                        Details
                      </button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Invoice Upload Card */}
      <div className="pt-8">
        <div className="bg-white border border-[#ECECEC] rounded-[28px] p-8 shadow-[0_12px_40px_rgba(0,0,0,0.03)] space-y-6 text-left">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100/50 flex items-center justify-center">
              <UploadCloud className="h-5.5 w-5.5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#111111]">Warranty Registry Ingestion</h3>
              <p className="text-xs text-[#6B7280] font-medium mt-0.5">Drag and drop receipts or warranty slips to index appliance documents instantly.</p>
            </div>
          </div>

          <div className="border-dashed border-2 border-[#ECECEC] rounded-2xl p-6 bg-[#F8F9FB]/50 hover:bg-slate-50 transition-colors">
            <ImageUpload
              onSuccess={(metadata) => {
                setUploadedInvoice(metadata);
              }}
              onFailure={(err) => {
                console.error("Upload failure callback:", err);
              }}
            />
          </div>

          {uploadedInvoice && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-emerald-800 text-xs font-semibold flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
                <span>Invoice file uploaded successfully. Metadata registry parsed.</span>
              </div>
              <a 
                href={uploadedInvoice.imageUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="text-emerald-700 hover:text-emerald-900 underline font-bold"
              >
                Inspect File
              </a>
            </motion.div>
          )}
        </div>
      </div>

    </div>
  );
}
