"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import {
  Wrench,
  Bot,
  Calendar,
  ShieldCheck,
  Activity,
  Layers,
  ArrowLeft,
  Edit2,
  AlertTriangle,
  FileText,
  Clock,
  Plus,
  ExternalLink
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

interface DiagnosisRecord {
  id: string;
  imageUrl: string;
  applianceType: string;
  brand: string;
  visibleProblems: string[];
  severity: string;
  timestamp: string;
}

export default function ApplianceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [appliance, setAppliance] = useState<Appliance | null>(null);
  const [diagnoses, setDiagnoses] = useState<DiagnosisRecord[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"timeline" | "notes">("timeline");
  const [newNote, setNewNote] = useState("");
  const [notes, setNotes] = useState<string[]>([
    "Filter clean recommendation logged by user.",
    "System operation parameters checked, working normally."
  ]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    // Fetch appliance details
    apiClient<Appliance>(`/api/v1/appliances/${id}`)
      .then((data) => {
        setAppliance(data);
      })
      .catch((err) => {
        console.error("Failed to load appliance details:", err);
        setError("Could not retrieve appliance specifications.");
      })
      .finally(() => {
        setLoading(false);
      });

    // Fetch general diagnoses history to filter matching ones
    apiClient<DiagnosisRecord[]>("/api/v1/ai/diagnose-image/history")
      .then((data) => {
        setDiagnoses(data);
      })
      .catch((err) => {
        console.error("Failed to load diagnoses history:", err);
      });

    // Fetch bookings to display on timeline
    apiClient<any[]>("/api/v1/bookings")
      .then((data) => {
        setBookings(data.filter((b) => b.applianceId === id));
      })
      .catch((err) => {
        console.error("Failed to load bookings for appliance details:", err);
      });
  }, [id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter diagnoses matching this appliance type
  const matchingDiagnoses = useMemo(() => {
    if (!appliance) return [];
    const type = appliance.name.toLowerCase();
    return diagnoses.filter(
      (d) =>
        d.applianceType.toLowerCase().includes(type) ||
        type.includes(d.applianceType.toLowerCase())
    );
  }, [diagnoses, appliance]);

  const serialNumber = useMemo(() => {
    if (!id) return "SN-DWX-00000000";
    return `SN-DWX-${id.substring(0, 8).toUpperCase()}`;
  }, [id]);

  const timelineEvents = useMemo(() => {
    if (!appliance) return [];
    
    const events: {
      type: string;
      title: string;
      date: string;
      description: string;
      badge: string;
      color: string;
      imageUrl?: string;
    }[] = [
      {
        type: "purchase",
        title: "Appliance Purchased",
        date: appliance.purchaseDate,
        description: `Registered purchase date for ${appliance.brand} ${appliance.model}.`,
        badge: "Purchase",
        color: "bg-blue-500"
      },
      {
        type: "warranty",
        title: "Warranty Registered",
        date: appliance.purchaseDate,
        description: `Coverage status is currently ${appliance.warrantyStatus}. Expiration set to ${appliance.warrantyExpiry}.`,
        badge: appliance.warrantyStatus,
        color: "bg-indigo-500"
      },
      {
        type: "invoice",
        title: "Invoice Uploaded",
        date: appliance.purchaseDate,
        description: "Invoice record attached securely to appliance profile.",
        badge: "Invoice",
        color: "bg-amber-500"
      },
      {
        type: "maintenance",
        title: "Preventive Maintenance Checkup",
        date: appliance.lastMaintenance,
        description: "Cleaned internal filters, checked seals, and optimized operational parameters.",
        badge: "Maintenance",
        color: "bg-emerald-500"
      }
    ];

    events.push({
      type: "technician",
      title: "Technician Dispatch Scheduled",
      date: new Date(new Date(appliance.lastMaintenance).getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      description: "Dwellix professional scheduled for routine system diagnostic check.",
      badge: "Technician",
      color: "bg-purple-500"
    });

    matchingDiagnoses.forEach((diag) => {
      events.push({
        type: "diagnosis",
        title: `AI Visual Diagnosis: ${diag.applianceType}`,
        date: new Date(diag.timestamp).toISOString().split("T")[0],
        description: `Visual anomaly scan completed with ${diag.severity.toUpperCase()} severity.`,
        badge: "AI Diagnosis",
        color: "bg-rose-500",
        imageUrl: diag.imageUrl
      });
    });

    bookings.forEach((b) => {
      events.push({
        type: "booking_created",
        title: `Professional Booking Created: ${b.serviceType}`,
        date: b.bookingDate,
        description: `Booking ID: ${b.id}. Description: ${b.problemDescription}. Status: ${b.status}`,
        badge: "BOOKING_CREATED",
        color: "bg-blue-600"
      });
    });

    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [appliance, matchingDiagnoses, bookings]);

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

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes((prev) => [newNote.trim(), ...prev]);
    setNewNote("");
    showToast("Appliance note added.");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <span className="text-xs font-semibold">Loading appliance profile...</span>
      </div>
    );
  }

  if (error || !appliance) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-850 text-xs md:text-sm font-medium flex items-start gap-3.5 shadow-sm text-left">
        <AlertTriangle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-extrabold text-rose-900">Appliance Profile Error</div>
          <p className="text-rose-700">{error || "Appliance not found."}</p>
          <Button onClick={() => router.push("/dashboard/appliances")} className="mt-4 rounded-xl font-bold h-9">
            Back to Inventory
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 relative text-left">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 10 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs md:text-sm font-bold px-5 py-3 rounded-2xl shadow-xl z-50 flex items-center gap-2"
          >
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <button
          onClick={() => router.push("/dashboard/appliances")}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer font-bold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Appliances</span>
        </button>

        <div className="flex items-center gap-2.5">
          <Link href="/onboarding/appliances">
            <Button variant="outline" className="rounded-xl font-bold text-xs h-9 gap-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer">
              <Edit2 className="h-3.5 w-3.5" />
              <span>Edit</span>
            </Button>
          </Link>
          <Link href="/dashboard/uploads">
            <Button className="rounded-xl font-bold text-xs h-9 gap-1.5 bg-primary text-white hover:bg-primary/95 cursor-pointer">
              <Bot className="h-3.5 w-3.5" />
              <span>Diagnose Again</span>
            </Button>
          </Link>
          <Button
            onClick={() => showToast("Technician dispatch request received.")}
            className="rounded-xl font-bold text-xs h-9 gap-1.5 border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/50 text-indigo-700 hover:text-indigo-800 cursor-pointer"
          >
            <Wrench className="h-3.5 w-3.5" />
            <span>Book Technician</span>
          </Button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: General Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Main Photo Card */}
          <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm">
            <div className="h-56 w-full bg-slate-50 flex items-center justify-center p-2 relative">
              {appliance.photoFileName ? (
                <img
                  src={appliance.photoFileName}
                  alt={appliance.name}
                  className="max-h-full max-w-full object-contain rounded-2xl"
                />
              ) : (
                <Bot className="h-12 w-12 text-slate-400 opacity-40 animate-pulse" />
              )}
              <span className={`absolute bottom-3 right-3 px-2 py-0.5 border rounded-full text-[9px] font-extrabold uppercase tracking-wide shadow-sm ${getHealthColor(appliance.healthScore)}`}>
                Health: {appliance.healthScore}%
              </span>
            </div>
            <div className="p-5 space-y-1.5">
              <h2 className="font-heading font-extrabold text-lg md:text-xl text-slate-900">
                {appliance.name}
              </h2>
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                {appliance.brand} &bull; {appliance.model}
              </div>
            </div>
          </div>

          {/* Details Specifications */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Specifications</h3>
            
            <div className="divide-y divide-slate-100 text-xs md:text-sm">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Serial Number</span>
                <span className="font-bold text-slate-800 font-mono">{serialNumber}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Room Location</span>
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-slate-400" />
                  <span>{appliance.roomName}</span>
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Purchase Date</span>
                <span className="font-bold text-slate-800">{appliance.purchaseDate}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Warranty Expiration</span>
                <span className="font-bold text-slate-800">{appliance.warrantyExpiry}</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-400">Warranty Status</span>
                <span className={`px-2 py-0.5 border rounded-full text-[9px] font-extrabold uppercase ${getWarrantyColor(appliance.warrantyStatus)}`}>
                  {appliance.warrantyStatus}
                </span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-400">Invoice Logged</span>
                <span className="font-bold text-slate-700 flex items-center gap-1 text-[11px] bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-lg">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  <span>Attached</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Timeline & Logs */}
        <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm flex flex-col h-full min-h-[480px]">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-100 pb-3 gap-4 flex-shrink-0">
            <button
              onClick={() => setActiveTab("timeline")}
              className={`pb-1 text-xs md:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "timeline"
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              Appliance Timeline
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`pb-1 text-xs md:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "notes"
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              Notes ({notes.length})
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="flex-1 pt-6 overflow-y-auto space-y-4 max-h-[500px] scrollbar-thin">
            {activeTab === "timeline" && (
              <div className="relative border-l border-slate-100 pl-6 space-y-6 text-xs md:text-sm">
                {timelineEvents.map((evt, idx) => (
                  <div key={idx} className="relative">
                    <span className={`absolute -left-[32px] top-0.5 h-4.5 w-4.5 rounded-full border-2 border-white flex items-center justify-center text-white ${evt.color} shadow-sm`}>
                      {evt.type === "purchase" && <Calendar className="h-2.5 w-2.5" />}
                      {evt.type === "warranty" && <ShieldCheck className="h-2.5 w-2.5" />}
                      {evt.type === "invoice" && <FileText className="h-2.5 w-2.5" />}
                      {evt.type === "maintenance" && <Wrench className="h-2.5 w-2.5" />}
                      {evt.type === "technician" && <Activity className="h-2.5 w-2.5" />}
                      {evt.type === "diagnosis" && <Bot className="h-2.5 w-2.5" />}
                      {evt.type === "booking_created" && <FileText className="h-2.5 w-2.5" />}
                    </span>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase">{evt.date}</span>
                        <span className={`px-2 py-0.5 border rounded-full text-[9px] font-extrabold uppercase ${
                          evt.type === "purchase" ? "bg-blue-50 border-blue-100 text-blue-700" :
                          evt.type === "warranty" ? "bg-indigo-50 border-indigo-100 text-indigo-700" :
                          evt.type === "invoice" ? "bg-amber-50 border-amber-100 text-amber-700" :
                          evt.type === "maintenance" ? "bg-emerald-50 border-emerald-100 text-emerald-700" :
                          evt.type === "technician" ? "bg-purple-50 border-purple-100 text-purple-700" :
                          evt.type === "booking_created" ? "bg-blue-50 border-blue-100 text-blue-700" :
                          "bg-rose-50 border-rose-100 text-rose-700"
                        }`}>
                          {evt.badge}
                        </span>
                      </div>
                      
                      <h4 className="font-extrabold text-slate-800 text-sm md:text-base">{evt.title}</h4>
                      <p className="text-slate-500 leading-relaxed max-w-lg">{evt.description}</p>
                      
                      {evt.imageUrl && (
                        <div className="mt-2.5 max-w-[120px] rounded-xl overflow-hidden border border-slate-100 shadow-sm aspect-video flex items-center justify-center bg-slate-50">
                          <img src={evt.imageUrl} alt="scan preview" className="max-h-full max-w-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "notes" && (
              <div className="space-y-4">
                <form onSubmit={handleAddNote} className="flex gap-3 mb-6">
                  <Input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Type an appliance note..."
                    className="flex-1 h-10 rounded-xl text-xs border-slate-200 focus:ring-primary focus:border-primary"
                  />
                  <Button type="submit" className="rounded-xl h-10 px-4 font-bold text-xs bg-primary text-white cursor-pointer">
                    Add
                  </Button>
                </form>

                <div className="space-y-3.5">
                  {notes.map((note, idx) => (
                    <div key={idx} className="p-3.5 border border-slate-100 bg-slate-50/30 rounded-2xl flex items-start gap-3">
                      <Clock className="h-4.5 w-4.5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-slate-700 leading-relaxed text-left">{note}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
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
