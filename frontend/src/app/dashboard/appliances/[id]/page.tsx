"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import {
  Wrench, Bot, Calendar, ShieldCheck, Activity, Layers, ArrowLeft, Edit2, 
  AlertTriangle, FileText, Clock, Plus, ExternalLink, ChevronRight, Zap, History, Camera
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

interface BookingItem {
  id: string;
  applianceId: string;
  serviceType: string;
  bookingDate: string;
  problemDescription: string;
  status: string;
}

export default function ApplianceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [appliance, setAppliance] = useState<Appliance | null>(null);
  const [diagnoses, setDiagnoses] = useState<DiagnosisRecord[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
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

    apiClient<Appliance>(`/api/v1/appliances/${id}`)
      .then((data) => setAppliance(data))
      .catch((err) => {
        console.error("Failed to load appliance details:", err);
        setError("Could not retrieve appliance specifications.");
      })
      .finally(() => setLoading(false));

    apiClient<DiagnosisRecord[]>("/api/v1/ai/diagnose-image/history")
      .then((data) => setDiagnoses(data))
      .catch((err) => console.error("Failed to load diagnoses history:", err));

    apiClient<BookingItem[]>("/api/v1/bookings")
      .then((data) => setBookings(data.filter((b) => b.applianceId === id)))
      .catch((err) => console.error("Failed to load bookings:", err));
  }, [id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const matchingDiagnoses = useMemo(() => {
    if (!appliance) return [];
    const type = appliance.name.toLowerCase();
    return diagnoses.filter(
      (d) => d.applianceType.toLowerCase().includes(type) || type.includes(d.applianceType.toLowerCase())
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
        color: "bg-primary"
      },
      {
        type: "warranty",
        title: "Warranty Registered",
        date: appliance.purchaseDate,
        description: `Coverage status is currently ${appliance.warrantyStatus}. Expiration set to ${appliance.warrantyExpiry}.`,
        badge: appliance.warrantyStatus,
        color: "bg-primary"
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
      color: "bg-purple-600"
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
        title: `Professional Booking: ${b.serviceType}`,
        date: b.bookingDate,
        description: `Booking ID: ${b.id}. Description: ${b.problemDescription}. Status: ${b.status}`,
        badge: "BOOKING_CREATED",
        color: "bg-primary"
      });
    });

    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [appliance, matchingDiagnoses, bookings]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes((prev) => [newNote.trim(), ...prev]);
    setNewNote("");
    showToast("Appliance note added.");
  };



  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto p-6 md:p-10 space-y-10 min-h-screen bg-background">
        <div className="h-10 w-48 bg-slate-200 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="h-[600px] bg-slate-200 rounded-[32px] animate-pulse" />
          <div className="lg:col-span-2 h-[600px] bg-slate-200 rounded-[32px] animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !appliance) {
    return (
      <div className="max-w-[1400px] mx-auto p-6 md:p-10 min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="h-16 w-16 rounded-[24px] bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-4 shadow-sm">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Error Loading Profile</h2>
        <p className="text-[#6B7280] mb-6">{error || "Appliance not found."}</p>
        <Button onClick={() => router.push("/dashboard/appliances")} className="rounded-xl px-6 bg-black text-white hover:bg-black/90 font-bold">
          Back to Fleet
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-10 space-y-10 bg-background min-h-screen font-sans text-left pb-24">
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

      {/* Top Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8">
        <button
          onClick={() => router.push("/dashboard/appliances")}
          className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-foreground transition-colors font-bold cursor-pointer group w-max"
        >
          <div className="h-8 w-8 rounded-full bg-white border border-border flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
            <ArrowLeft className="h-4 w-4" />
          </div>
          <span>Back to Fleet</span>
        </button>

        <div className="flex items-center gap-3 flex-wrap">
          <Link href="/onboarding/appliances">
            <Button variant="outline" className="rounded-xl font-bold text-sm h-11 px-5 border-border text-foreground hover:bg-white cursor-pointer shadow-sm">
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </Link>
          <Link href="/dashboard/uploads">
            <Button className="rounded-xl font-bold text-sm h-11 px-5 bg-white border border-border text-primary hover:bg-primary-soft cursor-pointer shadow-sm">
              <Camera className="h-4 w-4 mr-2" />
              Diagnose Issue
            </Button>
          </Link>
          <Button
            onClick={() => showToast("Technician dispatch request received.")}
            className="rounded-xl font-bold text-sm h-11 px-6 bg-black hover:bg-black/90 text-white cursor-pointer shadow-[0_8px_20px_rgba(0,0,0,0.1)] transition-transform hover:scale-105"
          >
            <Wrench className="h-4 w-4 mr-2" />
            Book Technician
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Hero & Specs */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Main Visual Card */}
          <div className="bg-white border border-border rounded-[32px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.03)] relative">
            <div className="h-[280px] w-full bg-gradient-to-br from-[#F8F9FB] to-white flex items-center justify-center p-6 relative border-b border-border">
              {appliance.photoFileName ? (
                <motion.img
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  src={appliance.photoFileName}
                  alt={appliance.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-2xl"
                />
              ) : (
                <Bot className="h-20 w-20 text-slate-200" />
              )}
              
              <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-md rounded-[20px] p-2 shadow-sm border border-border">
                <HealthRing score={appliance.healthScore} />
              </div>
            </div>

            <div className="p-8">
              <div className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary-soft border border-primary/20 mb-4">
                {appliance.brand}
              </div>
              <h1 className="font-extrabold text-2xl md:text-3xl text-foreground leading-tight mb-2">
                {appliance.name}
              </h1>
              <p className="text-sm font-medium text-[#6B7280]">
                Model: <span className="text-foreground">{appliance.model}</span>
              </p>
            </div>
          </div>

          {/* Premium Specs Card */}
          <div className="bg-white border border-border rounded-[32px] p-8 shadow-[0_12px_40px_rgba(0,0,0,0.03)] space-y-6">
            <h3 className="text-lg font-extrabold text-foreground flex items-center gap-2 mb-6">
              <Zap className="h-5 w-5 text-amber-500" />
              System Specifications
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-2xl bg-background border border-border">
                <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Serial No.</span>
                <span className="font-mono text-sm font-bold text-foreground">{serialNumber}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 rounded-2xl bg-background border border-border">
                <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Location</span>
                <span className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  {appliance.roomName}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 rounded-2xl bg-background border border-border">
                <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Purchase</span>
                <span className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-emerald-500" />
                  {appliance.purchaseDate}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 rounded-2xl bg-background border border-border">
                <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Warranty</span>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${
                  appliance.warrantyStatus.toLowerCase() === "covered" 
                  ? "bg-emerald-100 text-emerald-700" 
                  : "bg-rose-100 text-rose-700"
                }`}>
                  {appliance.warrantyStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline & Intelligence */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white border border-border rounded-[32px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.03)] h-full flex flex-col">
            {/* Tabs Header */}
            <div className="flex items-center gap-8 px-8 pt-8 border-b border-border">
              <button
                onClick={() => setActiveTab("timeline")}
                className={`pb-4 text-sm font-extrabold transition-all relative ${
                  activeTab === "timeline" ? "text-foreground" : "text-[#6B7280] hover:text-foreground"
                }`}
              >
                Lifecycle Timeline
                {activeTab === "timeline" && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={`pb-4 text-sm font-extrabold transition-all relative ${
                  activeTab === "notes" ? "text-foreground" : "text-[#6B7280] hover:text-foreground"
                }`}
              >
                Service Notes
                {activeTab === "notes" && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                )}
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-8 flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeTab === "timeline" && (
                  <motion.div
                    key="timeline"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="relative border-l-2 border-border ml-4 space-y-10 py-4"
                  >
                    {timelineEvents.map((evt, idx) => (
                      <div key={idx} className="relative pl-8 group">
                        {/* Timeline Node */}
                        <span className={`absolute -left-[17px] top-1 h-8 w-8 rounded-full border-4 border-white flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110 ${evt.color}`}>
                          {evt.type === "purchase" && <Calendar className="h-3.5 w-3.5" />}
                          {evt.type === "warranty" && <ShieldCheck className="h-3.5 w-3.5" />}
                          {evt.type === "invoice" && <FileText className="h-3.5 w-3.5" />}
                          {evt.type === "maintenance" && <Wrench className="h-3.5 w-3.5" />}
                          {evt.type === "technician" && <Activity className="h-3.5 w-3.5" />}
                          {evt.type === "diagnosis" && <Bot className="h-3.5 w-3.5" />}
                          {evt.type === "booking_created" && <History className="h-3.5 w-3.5" />}
                        </span>
                        
                        <div className="bg-background rounded-[24px] p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                             <span className={`px-3 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-widest ${
                              evt.type === "purchase" ? "bg-primary-soft text-primary-hover" :
                              evt.type === "warranty" ? "bg-primary-soft text-primary-hover" :
                              evt.type === "invoice" ? "bg-amber-100 text-amber-700" :
                              evt.type === "maintenance" ? "bg-emerald-100 text-emerald-700" :
                              evt.type === "technician" ? "bg-purple-100 text-purple-700" :
                              evt.type === "booking_created" ? "bg-primary-soft text-primary-hover" :
                              "bg-rose-100 text-rose-700"
                            }`}>
                              {evt.badge}
                            </span>
                            <span className="text-[11px] text-[#6B7280] font-bold uppercase tracking-wider">{evt.date}</span>
                          </div>
                          
                          <h4 className="font-extrabold text-lg text-foreground mb-2">{evt.title}</h4>
                          <p className="text-[#6B7280] text-sm font-medium leading-relaxed">{evt.description}</p>
                          
                          {evt.imageUrl && (
                            <div className="mt-6 max-w-sm rounded-[20px] overflow-hidden border border-border shadow-sm">
                              <img src={evt.imageUrl} alt="Scan preview" className="w-full h-auto object-cover" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === "notes" && (
                  <motion.div
                    key="notes"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="bg-background rounded-[24px] p-6 border border-border">
                      <h4 className="text-sm font-extrabold text-foreground mb-4">Add a Service Note</h4>
                      <form onSubmit={handleAddNote} className="flex gap-4">
                        <Input
                          type="text"
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          placeholder="Log filter changes, observations, or repair details..."
                          className="flex-1 h-12 rounded-[16px] text-sm font-medium border-border focus:ring-black focus:border-black bg-white"
                        />
                        <Button type="submit" className="rounded-[16px] h-12 px-6 font-bold text-sm bg-black text-white hover:bg-black/90 cursor-pointer shadow-sm">
                          Save Note
                        </Button>
                      </form>
                    </div>

                    <div className="space-y-4">
                      {notes.map((note, idx) => (
                        <div key={idx} className="p-6 border border-border bg-white rounded-[24px] flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                          <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center border border-border shrink-0">
                            <Clock className="h-4 w-4 text-[#6B7280]" />
                          </div>
                          <div className="text-sm text-foreground font-medium leading-relaxed pt-1 w-full">{note}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const HealthRing = ({ score }: { score: number }) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 90 ? "stroke-emerald-500" : score >= 75 ? "stroke-amber-500" : "stroke-rose-500";
  
  return (
    <div className="relative flex items-center justify-center h-20 w-20">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="40" cy="40" r={radius} className="stroke-[#ECECEC] fill-none" strokeWidth="4" />
        <motion.circle
          cx="40" cy="40" r={radius}
          className={`${color} fill-none`} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black text-foreground tracking-tighter leading-none">{score}</span>
        <span className="text-[8px] font-extrabold uppercase text-[#6B7280]">Score</span>
      </div>
    </div>
  );
};
