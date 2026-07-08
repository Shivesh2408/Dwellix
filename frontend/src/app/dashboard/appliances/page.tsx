"use client";

import React, { useState, useEffect, useMemo } from "react";
import { apiClient } from "@/lib/api-client";
import {
  Search,
  Filter,
  ArrowUpDown,
  Grid,
  List as ListIcon,
  Plus,
  Trash2,
  Edit2,
  Wrench,
  Bot,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers,
  Activity,
  X,
  FileText,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roomFilter, setRoomFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [isGridView, setIsGridView] = useState(true);
  const [selectedAppliance, setSelectedAppliance] = useState<Appliance | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchAppliances();
  }, []);

  const fetchAppliances = () => {
    apiClient<Appliance[]>("/api/v1/appliances")
      .then((data) => setAppliances(data))
      .catch((err) => {
        console.error("Failed to load appliances:", err);
        setError("Could not load appliance records. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this appliance?")) return;

    try {
      await apiClient(`/api/v1/onboarding/appliances/${id}`, {
        method: "DELETE"
      });
      showToast("Appliance deleted successfully.");
      fetchAppliances();
    } catch (err: any) {
      console.error("Failed to delete appliance:", err);
      showToast(err?.message ?? "Error deleting appliance.");
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return "text-emerald-600 bg-emerald-50 border-emerald-100";
    if (score >= 75) return "text-amber-600 bg-amber-50 border-amber-100";
    return "text-rose-600 bg-rose-50 border-rose-100";
  };

  const getWarrantyColor = (status: string) => {
    return status?.toLowerCase() === "covered"
      ? "text-emerald-700 bg-emerald-50 border-emerald-100"
      : "text-slate-600 bg-slate-50 border-slate-200";
  };

  // Get unique rooms for filter
  const rooms = useMemo(() => {
    const list = appliances.map((a) => a.roomName);
    return Array.from(new Set(list));
  }, [appliances]);

  // Filter & Sort logic
  const filteredAppliances = useMemo(() => {
    let result = [...appliances];

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.brand.toLowerCase().includes(q) ||
          a.model.toLowerCase().includes(q)
      );
    }

    // Room Filter
    if (roomFilter !== "all") {
      result = result.filter((a) => a.roomName === roomFilter);
    }

    // Status Filter
    if (statusFilter !== "all") {
      result = result.filter((a) => a.warrantyStatus.toLowerCase() === statusFilter.toLowerCase());
    }

    // Sort
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

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 relative">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, x: 50, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 20 }}
            exit={{ opacity: 0, x: 50 }}
            className="fixed top-4 right-4 bg-white border border-emerald-100 text-slate-800 text-xs md:text-sm font-bold px-5 py-4 rounded-3xl shadow-2xl z-50 flex items-center gap-3.5 max-w-sm"
          >
            <div className="h-8 w-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600 animate-bounce">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <div className="space-y-0.5 text-left">
              <div className="font-extrabold text-slate-900 text-[11px] uppercase tracking-wider">Success</div>
              <p className="text-[11px] text-slate-500 font-medium">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div className="space-y-1 text-left">
          <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-primary/10 text-primary rounded-full">
            Asset Inventory
          </span>
          <h1 className="text-xl md:text-3xl font-heading font-extrabold tracking-tight text-slate-900">
            My Appliances
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            Monitor, edit, and diagnose registered home appliances.
          </p>
        </div>

        <Link href="/onboarding/appliances">
          <Button className="rounded-2xl font-bold text-xs h-10 gap-2 flex items-center shadow bg-primary text-white cursor-pointer self-start sm:self-auto">
            <Plus className="h-4 w-4" />
            <span>Add Appliance</span>
          </Button>
        </Link>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search appliances..."
              className="pl-9 h-10 rounded-xl border-slate-200 focus:ring-primary focus:border-primary text-xs"
            />
          </div>

          {/* Room Filter */}
          <select
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700"
          >
            <option value="all">All Rooms</option>
            {rooms.map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700"
          >
            <option value="all">All Warranties</option>
            <option value="covered">Covered</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3 flex-shrink-0">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700"
            >
              <option value="name">Sort by Name</option>
              <option value="health">Sort by Health</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>

          {/* Grid/List Toggle */}
          <div className="flex items-center border border-slate-200 rounded-xl bg-white p-0.5">
            <button
              onClick={() => setIsGridView(true)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isGridView ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsGridView(false)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                !isGridView ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading state - SKELETON PULSE */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="rounded-3xl border border-slate-100 bg-white/70 p-5 space-y-4 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-slate-200" />
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
            <div className="font-extrabold text-rose-900">Data Fetch Failed</div>
            <p className="text-rose-700 leading-relaxed">{error}</p>
            <Button onClick={() => window.location.reload()} className="h-8 rounded-lg text-xs bg-rose-600 text-white font-bold cursor-pointer">
              Retry Connection
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredAppliances.length === 0 && (
        <div className="text-center py-16 max-w-md mx-auto space-y-5 bg-white border border-slate-150 rounded-3xl p-8 shadow-sm">
          <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center mx-auto shadow-sm animate-pulse">
            <Bot className="h-7 w-7 opacity-50 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">No registered appliances</h3>
            <p className="text-xs text-slate-450 leading-relaxed">
              Add home appliances during onboarding or through the dashboard to monitor health status and run visual error scans.
            </p>
          </div>
          <Link href="/onboarding/appliances">
            <Button className="rounded-xl font-bold text-xs h-9 px-5 bg-primary text-white cursor-pointer hover:bg-primary/95 mt-1">
              Add Appliance
            </Button>
          </Link>
        </div>
      )}

      {/* Appliance Grid / List */}
      {!loading && !error && filteredAppliances.length > 0 && (
        isGridView ? (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAppliances.map((appliance) => (
              <motion.div
                key={appliance.id}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedAppliance(appliance)}
                className="group bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full text-left"
              >
                {/* Photo Header */}
                <div className="h-44 w-full bg-slate-50 relative flex items-center justify-center border-b border-slate-100">
                  {appliance.photoFileName ? (
                    <img
                      src={appliance.photoFileName}
                      alt={appliance.name}
                      className="h-full w-full object-cover rounded-t-3xl group-hover:scale-102 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 space-y-1.5">
                      <Bot className="h-8 w-8 opacity-40 animate-pulse" />
                      <span className="text-[10px] uppercase font-bold tracking-wider">No Image Logged</span>
                    </div>
                  )}

                  <span className={`absolute top-3 right-3 px-2 py-0.5 border rounded-full text-[9px] font-extrabold uppercase tracking-wide shadow-sm ${getHealthColor(appliance.healthScore)}`}>
                    Health: {appliance.healthScore}%
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                      {appliance.brand} &bull; {appliance.model}
                    </div>
                    <h3 className="font-heading font-extrabold text-sm md:text-base text-slate-900 group-hover:text-primary transition-colors">
                      {appliance.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium pt-1">
                      <Layers className="h-3.5 w-3.5 text-slate-400" />
                      <span>Located in {appliance.roomName}</span>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <span className={`px-2 py-0.5 border rounded-full text-[9px] font-extrabold uppercase ${getWarrantyColor(appliance.warrantyStatus)}`}>
                      Warranty: {appliance.warrantyStatus}
                    </span>

                    <div className="flex items-center gap-2.5">
                      <Link href="/dashboard/uploads" onClick={(e) => e.stopPropagation()}>
                        <button className="text-slate-400 hover:text-primary p-1 transition-colors cursor-pointer" title="AI Scan">
                          <Bot className="h-4 w-4" />
                        </button>
                      </Link>
                      <Link href="/onboarding/appliances" onClick={(e) => e.stopPropagation()}>
                        <button className="text-slate-400 hover:text-indigo-600 p-1 transition-colors cursor-pointer" title="Edit">
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </Link>
                      <button
                        onClick={(e) => handleDelete(appliance.id, e)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredAppliances.map((appliance) => (
              <motion.div
                key={appliance.id}
                onClick={() => setSelectedAppliance(appliance)}
                className="group bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-4 text-left"
              >
                {/* Photo Thumbnail */}
                <div className="h-16 w-16 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-100">
                  {appliance.photoFileName ? (
                    <img src={appliance.photoFileName} alt={appliance.name} className="h-full w-full object-cover" />
                  ) : (
                    <Bot className="h-5 w-5 text-slate-400 opacity-50" />
                  )}
                </div>

                {/* Details Column */}
                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="space-y-0.5">
                    <h3 className="font-heading font-extrabold text-sm text-slate-900 group-hover:text-primary transition-colors truncate">
                      {appliance.name}
                    </h3>
                    <div className="text-[10px] text-slate-400 font-bold uppercase truncate">
                      {appliance.brand} &bull; {appliance.model}
                    </div>
                  </div>
                  <div className="space-y-0.5 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-slate-400" />
                      <span>{appliance.roomName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>Purchased: {appliance.purchaseDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 border rounded-full text-[9px] font-extrabold uppercase ${getHealthColor(appliance.healthScore)}`}>
                      Health: {appliance.healthScore}%
                    </span>
                    <span className={`px-2 py-0.5 border rounded-full text-[9px] font-extrabold uppercase ${getWarrantyColor(appliance.warrantyStatus)}`}>
                      Warranty: {appliance.warrantyStatus}
                    </span>
                  </div>
                </div>

                {/* Actions Column */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Link href="/dashboard/uploads" onClick={(e) => e.stopPropagation()}>
                    <button className="text-slate-400 hover:text-primary p-1.5 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer" title="AI Scan">
                      <Bot className="h-4.5 w-4.5" />
                    </button>
                  </Link>
                  <Link href="/onboarding/appliances" onClick={(e) => e.stopPropagation()}>
                    <button className="text-slate-400 hover:text-indigo-600 p-1.5 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer" title="Edit">
                      <Edit2 className="h-4.5 w-4.5" />
                    </button>
                  </Link>
                  <button
                    onClick={(e) => handleDelete(appliance.id, e)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )
      )}

      {/* Floating FAB for Mobile */}
      <Link href="/onboarding/appliances" className="fixed bottom-6 right-6 md:hidden z-40">
        <Button className="h-12 w-12 rounded-full bg-primary hover:bg-primary/95 text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer">
          <Plus className="h-6 w-6" />
        </Button>
      </Link>

      {/* Appliance Detail Overlay Dialog */}
      <AnimatePresence>
        {selectedAppliance && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAppliance(null)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[80vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-100 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <span className="font-heading font-extrabold text-slate-900 text-sm md:text-base">
                    Appliance Profile
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedAppliance(null)}
                  className="rounded-full h-8 w-8 hover:bg-slate-100"
                >
                  <X className="h-4 w-4 text-slate-500" />
                </Button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6 text-left">
                {/* Visual Image & Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
                  <div className="relative rounded-2xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50 aspect-video sm:aspect-square flex items-center justify-center">
                    {selectedAppliance.photoFileName ? (
                      <img
                        src={selectedAppliance.photoFileName}
                        alt={selectedAppliance.name}
                        className="max-h-full max-w-full object-contain rounded-xl"
                      />
                    ) : (
                      <Bot className="h-10 w-10 text-slate-400 opacity-40 animate-pulse" />
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-xs md:text-sm">
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block mb-0.5">Brand</span>
                        <span className="font-bold text-slate-800">{selectedAppliance.brand || "N/A"}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block mb-0.5">Model</span>
                        <span className="font-bold text-slate-800">{selectedAppliance.model || "N/A"}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block mb-0.5">Room Location</span>
                        <span className="font-bold text-slate-800">{selectedAppliance.roomName || "N/A"}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block mb-0.5">Health Score</span>
                        <span className="font-bold text-slate-800 flex items-center gap-1">
                          <Activity className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                          {selectedAppliance.healthScore}%
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-indigo-50/30 border border-indigo-100/50 space-y-2 text-xs md:text-sm">
                      <div className="flex items-center gap-2 text-indigo-950 font-bold">
                        <ShieldCheck className="h-4.5 w-4.5 text-indigo-600" />
                        <span>Warranty Coverage details</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Purchase Date</span>
                          <span className="font-semibold text-slate-700">{selectedAppliance.purchaseDate}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Expiration Date</span>
                          <span className="font-semibold text-slate-700">{selectedAppliance.warrantyExpiry}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Maintenance details */}
                <div className="space-y-3 pt-4 border-t border-slate-100 text-xs md:text-sm">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Wrench className="h-3.5 w-3.5 text-slate-500" />
                    <span>Maintenance History Log</span>
                  </h4>
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                    <div>
                      <span className="text-slate-800 font-bold">Preventive checkup complete</span>
                      <span className="text-[10px] text-slate-400 block">Estimated Timestamp: {selectedAppliance.lastMaintenance}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">
                      Success
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex-shrink-0 flex justify-between gap-3">
                <Link href="/dashboard/uploads" className="flex-shrink-0">
                  <Button
                    onClick={() => setSelectedAppliance(null)}
                    className="rounded-xl font-bold text-xs h-9 px-4 gap-1.5 flex items-center justify-center border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/50 text-indigo-700 hover:text-indigo-800 cursor-pointer shadow-sm"
                  >
                    <Bot className="h-3.5 w-3.5" />
                    <span>AI Diagnosis Scan</span>
                  </Button>
                </Link>

                <div className="flex gap-2">
                  <Link href="/onboarding/appliances">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedAppliance(null)}
                      className="rounded-xl font-bold text-xs h-9 px-4 border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      Edit Profile
                    </Button>
                  </Link>
                  <Button
                    onClick={() => setSelectedAppliance(null)}
                    className="rounded-xl font-bold text-xs h-9 px-4 cursor-pointer"
                  >
                    Close Profile
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
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
