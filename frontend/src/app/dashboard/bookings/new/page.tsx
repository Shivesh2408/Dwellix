"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Wrench,
  Bot,
  AlertTriangle,
  ShieldCheck,
  User,
  IndianRupee
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface Appliance {
  id: string;
  name: string;
  brand: string;
  model: string;
}

export default function NewBookingPage() {
  const router = useRouter();

  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [techniciansList, setTechniciansList] = useState<any[]>([]);
  const [loadingAppliances, setLoadingAppliances] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [applianceId, setApplianceId] = useState("");
  const [serviceType, setServiceType] = useState("Maintenance");
  const [problemDescription, setProblemDescription] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("10:00 AM");
  const [technicianName, setTechnicianName] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("1500");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const tech = searchParams.get("technician");
      if (tech) {
        setTechnicianName(tech);
      }
    }
  }, []);

  useEffect(() => {
    // Fetch user appliances
    apiClient<Appliance[]>("/api/v1/appliances")
      .then((data) => {
        setAppliances(data);
        if (data.length > 0) {
          setApplianceId(data[0].id);
        }
      })
      .catch((err) => {
        console.error("Failed to load appliances:", err);
        setError("Unable to retrieve appliances for matching.");
      })
      .finally(() => setLoadingAppliances(false));

    // Fetch technicians list
    apiClient<any[]>("/api/v1/technicians")
      .then((data) => setTechniciansList(data))
      .catch((err) => console.error("Failed to load technicians list:", err));
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!applianceId || !serviceType.trim() || !problemDescription.trim() || !bookingDate || !bookingTime.trim()) {
      setError("Please fill in all mandatory fields.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await apiClient("/api/v1/bookings", {
        method: "POST",
        body: JSON.stringify({
          applianceId,
          serviceType: serviceType.trim(),
          problemDescription: problemDescription.trim(),
          bookingDate,
          bookingTime: bookingTime.trim(),
          technicianName: technicianName.trim() || null,
          technicianPhone: null,
          status: "PENDING",
          estimatedCost: parseFloat(estimatedCost) || 1500.0
        })
      });

      showToast("Technician booking confirmed successfully.");
      setTimeout(() => {
        router.push("/dashboard/bookings");
      }, 1200);
    } catch (err: any) {
      console.error("Failed creating booking:", err);
      setError(err?.message ?? "An error occurred while booking.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6 relative text-left">
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

      {/* Header */}
      <div className="pb-4 border-b border-slate-100">
        <button
          onClick={() => router.push("/dashboard/bookings")}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer font-bold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Bookings</span>
        </button>
      </div>

      {/* Form Container */}
      <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
        <h1 className="text-lg md:text-xl font-heading font-extrabold text-slate-950 mb-6">
          Book Technician Service
        </h1>

        {error && (
          <div className="p-4 mb-6 rounded-2xl bg-rose-50 border border-rose-100 text-rose-850 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4.5 w-4.5 text-rose-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-slate-700">
          {/* Select Appliance */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Select Appliance *
            </label>
            {loadingAppliances ? (
              <div className="h-10 rounded-xl border border-slate-150 bg-slate-50 flex items-center px-3 text-xs text-slate-400 font-medium">
                <Loader2 className="h-4 w-4 animate-spin text-primary mr-2" />
                <span>Loading available appliances...</span>
              </div>
            ) : appliances.length === 0 ? (
              <div className="p-4 border border-amber-100 bg-amber-50/50 rounded-2xl text-xs text-amber-800 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>No appliances logged. Please register an appliance first before booking.</span>
              </div>
            ) : (
              <select
                value={applianceId}
                onChange={(e) => setApplianceId(e.target.value)}
                className="w-full h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700"
              >
                {appliances.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.name} ({app.brand} - {app.model})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Service Type */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Service Type *
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700"
              >
                <option value="Maintenance">Maintenance</option>
                <option value="Repair Check">Repair Check</option>
                <option value="Deep Cleaning">Deep Cleaning</option>
                <option value="Installation">Installation</option>
                <option value="Emergency Inspect">Emergency Inspect</option>
              </select>
            </div>

            {/* Estimated Budget */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Estimated Budget (₹)
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                <Input
                  type="number"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(e.target.value)}
                  placeholder="e.g. 1500"
                  className="pl-8 h-10 rounded-xl text-xs border-slate-200"
                />
              </div>
            </div>

            {/* Booking Date */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Booking Date *
              </label>
              <Input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="h-10 rounded-xl text-xs border-slate-200"
              />
            </div>

            {/* Booking Time */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Booking Time Slot *
              </label>
              <select
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="w-full h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700"
              >
                <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                <option value="01:00 PM - 03:00 PM">01:00 PM - 03:00 PM</option>
                <option value="03:00 PM - 05:00 PM">03:00 PM - 05:00 PM</option>
                <option value="05:00 PM - 07:00 PM">05:00 PM - 07:00 PM</option>
              </select>
            </div>
          </div>

          {/* Problem Description */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Problem Description *
            </label>
            <textarea
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder="Provide a brief explanation of the issue, symptoms, or error codes visible on the appliance..."
              rows={4}
              className="w-full rounded-xl border border-slate-200 bg-white text-xs p-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700 leading-relaxed resize-none"
            />
          </div>

          {/* Preferred Technician (Optional) */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Preferred Technician (Optional)
            </label>
            <select
              value={technicianName}
              onChange={(e) => setTechnicianName(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700 font-semibold"
            >
              <option value="">Assign Automatically Later</option>
              {techniciansList.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name} ({t.specialization} - {t.city})
                </option>
              ))}
            </select>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/bookings")}
              className="rounded-xl font-bold text-xs h-10 px-5 border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || appliances.length === 0}
              className="rounded-xl font-bold text-xs h-10 px-6 bg-primary text-white hover:bg-primary/95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Confirm Booking</span>
              )}
            </Button>
          </div>
        </form>
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
