"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Trash2,
  Edit2,
  AlertTriangle,
  ShieldCheck,
  CheckCircle,
  Clock3,
  Loader2,
  IndianRupee,
  Activity,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

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

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Edit fields
  const [serviceType, setServiceType] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [technicianName, setTechnicianName] = useState("");
  const [technicianPhone, setTechnicianPhone] = useState("");
  const [status, setStatus] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchBooking = useCallback(() => {
    apiClient<Booking>(`/api/v1/bookings/${id}`)
      .then((data) => {
        setBooking(data);
        setServiceType(data.serviceType);
        setProblemDescription(data.problemDescription);
        setBookingDate(data.bookingDate);
        setBookingTime(data.bookingTime);
        setTechnicianName(data.technicianName || "");
        setTechnicianPhone(data.technicianPhone || "");
        setStatus(data.status);
        setEstimatedCost(data.estimatedCost.toString());
      })
      .catch((err) => {
        console.error("Failed to load booking details:", err);
        setError("Could not retrieve booking details.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      await Promise.resolve();
      if (active && id) {
        fetchBooking();
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [id, fetchBooking]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceType.trim() || !problemDescription.trim() || !bookingDate || !bookingTime.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const updated = await apiClient<Booking>(`/api/v1/bookings/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          applianceId: booking?.applianceId,
          serviceType: serviceType.trim(),
          problemDescription: problemDescription.trim(),
          bookingDate,
          bookingTime: bookingTime.trim(),
          technicianName: technicianName.trim() || null,
          technicianPhone: technicianPhone.trim() || null,
          status: status,
          estimatedCost: parseFloat(estimatedCost) || booking?.estimatedCost
        })
      });

      setBooking(updated);
      setIsEditing(false);
      showToast("Booking updated successfully.");
    } catch (err: unknown) {
      console.error("Failed to update booking:", err);
      const apiErr = err as { message?: string };
      setError(apiErr?.message ?? "Error saving changes.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to cancel and delete this technician booking?")) return;

    setSubmitting(true);
    try {
      await apiClient(`/api/v1/bookings/${id}`, {
        method: "DELETE"
      });
      showToast("Booking canceled successfully.");
      setTimeout(() => {
        router.push("/dashboard/bookings");
      }, 1000);
    } catch (err: unknown) {
      console.error("Failed to cancel booking:", err);
      const apiErr = err as { message?: string };
      setError(apiErr?.message ?? "Error canceling booking.");
      setSubmitting(false);
    }
  };

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

  // Compile timeline matching Request Sent, Technician Assigned, On the Way, Service Started, Completed
  const bookingTimeline = useMemo(() => {
    if (!booking) return [];

    const isCancelled = booking.status?.toUpperCase() === "CANCELLED";
    const statusUpper = booking.status?.toUpperCase();

    const timelineSteps = [
      {
        label: "Request Sent",
        date: new Date(booking.createdAt).toLocaleDateString(),
        done: true,
        desc: "Service order created and registered in the Dwellix systems."
      },
      {
        label: "Technician Assigned",
        date: booking.technicianName ? booking.bookingDate : "Awaiting assignment",
        done: !!booking.technicianName && ["CONFIRMED", "IN_PROGRESS", "COMPLETED"].includes(statusUpper),
        desc: booking.technicianName
          ? `Technician ${booking.technicianName} has been assigned to your service.`
          : "Matching with the best qualified certified technician nearby."
      },
      {
        label: "On the Way",
        date: ["IN_PROGRESS", "COMPLETED"].includes(statusUpper) ? booking.bookingDate : "Estimated time pending",
        done: ["IN_PROGRESS", "COMPLETED"].includes(statusUpper),
        desc: ["IN_PROGRESS", "COMPLETED"].includes(statusUpper)
          ? "Technician has dispatched and is navigating to your address."
          : "We will update when the technician leaves for your location."
      },
      {
        label: "Service Started",
        date: ["IN_PROGRESS", "COMPLETED"].includes(statusUpper) ? booking.bookingDate : "TBD",
        done: ["IN_PROGRESS", "COMPLETED"].includes(statusUpper),
        desc: ["IN_PROGRESS", "COMPLETED"].includes(statusUpper)
          ? "Technician is on-site and has started diagnostics."
          : "Awaiting physical arrival and authorization."
      },
      {
        label: "Completed",
        date: statusUpper === "COMPLETED" ? booking.bookingDate : "TBD",
        done: statusUpper === "COMPLETED",
        desc: statusUpper === "COMPLETED"
          ? "Service finalized. System tests passed and appliance operates normally."
          : "Awaiting completion and certification sign-off."
      }
    ];

    if (isCancelled) {
      // Append cancellation state as an exception element
      timelineSteps.push({
        label: "Service Cancelled",
        date: new Date(booking.updatedAt).toLocaleDateString(),
        done: true,
        desc: "The booking has been successfully cancelled and refunded if applicable."
      });
    }

    return timelineSteps;
  }, [booking]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 bg-[#F8F9FB] font-sans">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
        <span className="text-xs font-semibold">Retrieving booking dispatch record...</span>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] py-16 px-4 font-sans text-left">
        <div className="max-w-xl mx-auto p-6 rounded-[24px] bg-rose-50 border border-rose-100 text-rose-850 text-xs md:text-sm font-medium flex items-start gap-4 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1.5 flex-1">
            <div className="font-extrabold text-rose-900">Record Not Found</div>
            <p className="text-rose-700">{error || "The requested booking does not exist."}</p>
            <Button onClick={() => router.push("/dashboard/bookings")} className="mt-4 rounded-xl font-bold h-9 bg-slate-900 hover:bg-slate-800 text-white cursor-pointer">
              Back to Bookings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] py-8 px-4 sm:px-6 lg:px-8 text-left font-sans relative">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 10, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="absolute top-4 left-1/2 bg-slate-950 text-white text-xs md:text-sm font-bold px-5 py-3 rounded-2xl shadow-xl z-50 flex items-center gap-2"
          >
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <button
            onClick={() => router.push("/dashboard/bookings")}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer font-bold"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Bookings</span>
          </button>

          {!isEditing && (
            <div className="flex items-center gap-2.5">
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="rounded-xl font-bold text-xs h-9 gap-1.5 border-slate-200 text-slate-700 bg-white hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Edit Details</span>
              </Button>
              {booking.status?.toUpperCase() !== "CANCELLED" && booking.status?.toUpperCase() !== "COMPLETED" && (
                <Button
                  onClick={handleDelete}
                  disabled={submitting}
                  className="rounded-xl font-bold text-xs h-9 gap-1.5 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-600 cursor-pointer transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Cancel Booking</span>
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Board (2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            {isEditing ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm space-y-6"
              >
                <div className="space-y-1">
                  <h2 className="text-base font-extrabold text-slate-900">Modify Booking</h2>
                  <p className="text-xs text-slate-400">Update scheduling slots or descriptions for this service dispatch.</p>
                </div>

                <form onSubmit={handleUpdate} className="space-y-4">
                  {error && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-2">
                      <AlertTriangle className="h-4.5 w-4.5 text-rose-500" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450">Service Type *</label>
                      <select
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                        className="w-full h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
                      >
                        <option value="Maintenance">Maintenance</option>
                        <option value="Repair Check">Repair Check</option>
                        <option value="Deep Cleaning">Deep Cleaning</option>
                        <option value="Installation">Installation</option>
                        <option value="Emergency Inspect">Emergency Inspect</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450">Booking Status *</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450">Booking Date *</label>
                      <Input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="h-10 rounded-xl text-xs border-slate-200 focus-visible:ring-blue-500 bg-slate-50/50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450">Booking Time Slot *</label>
                      <Input
                        type="text"
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="h-10 rounded-xl text-xs border-slate-200 focus-visible:ring-blue-500 bg-slate-50/50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450">Technician Name</label>
                      <Input
                        type="text"
                        value={technicianName}
                        onChange={(e) => setTechnicianName(e.target.value)}
                        className="h-10 rounded-xl text-xs border-slate-200 focus-visible:ring-blue-500 bg-slate-50/50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450">Technician Phone</label>
                      <Input
                        type="text"
                        value={technicianPhone}
                        onChange={(e) => setTechnicianPhone(e.target.value)}
                        className="h-10 rounded-xl text-xs border-slate-200 focus-visible:ring-blue-500 bg-slate-50/50"
                      />
                    </div>

                    <div className="space-y-1 col-span-2">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450">Estimated Cost (₹)</label>
                      <Input
                        type="number"
                        value={estimatedCost}
                        onChange={(e) => setEstimatedCost(e.target.value)}
                        className="h-10 rounded-xl text-xs border-slate-200 focus-visible:ring-blue-500 bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450">Problem Description *</label>
                    <textarea
                      value={problemDescription}
                      onChange={(e) => setProblemDescription(e.target.value)}
                      rows={4}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 text-xs p-3.5 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 leading-relaxed resize-none font-sans"
                    />
                  </div>

                  <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="rounded-xl text-xs font-bold h-9 border-slate-200 text-slate-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="rounded-xl text-xs font-bold h-9 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                    >
                      {submitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {/* Main Card */}
                <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm space-y-6">
                  {/* Status header */}
                  <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">
                        Service Ticket
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 font-bold">ID: {booking.id}</span>
                    </div>
                    <span className={`px-3 py-1 border rounded-full text-[10px] font-extrabold uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>

                  {/* Appliance Description */}
                  <div className="space-y-2">
                    <div className="text-[10px] text-blue-600 font-extrabold uppercase tracking-wider bg-blue-50/50 px-2.5 py-1 rounded-lg w-fit">
                      {booking.brand} &bull; {booking.model}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
                      {booking.serviceType} checkup for {booking.applianceName}
                    </h2>
                  </div>

                  {/* Data Specs Grid */}
                  <div className="grid grid-cols-2 gap-y-5 gap-x-6 pt-2 text-xs sm:text-sm font-sans">
                    <div className="space-y-1">
                      <span className="text-slate-400 block text-[10px] font-extrabold uppercase tracking-wider">Assigned Tech</span>
                      <span className="font-bold text-slate-800 flex items-center gap-2">
                        <span className="h-6 w-6 rounded-full bg-blue-550/10 text-blue-600 flex items-center justify-center font-bold text-[10px]">
                          {booking.technicianName ? booking.technicianName.charAt(0) : "?"}
                        </span>
                        <span>{booking.technicianName || "Unassigned"}</span>
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400 block text-[10px] font-extrabold uppercase tracking-wider">Contact Details</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1.5 font-mono">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        <span>{booking.technicianPhone || "TBD"}</span>
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400 block text-[10px] font-extrabold uppercase tracking-wider">Service Schedule</span>
                      <span className="font-bold text-slate-800 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>{booking.bookingDate}</span>
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400 block text-[10px] font-extrabold uppercase tracking-wider">Arrival Time Window</span>
                      <span className="font-bold text-slate-800 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span>{booking.bookingTime}</span>
                      </span>
                    </div>

                    <div className="col-span-2 pt-4 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Estimated Budget</span>
                      <span className="font-extrabold text-blue-600 text-base sm:text-xl flex items-center gap-0.5 font-heading">
                        <IndianRupee className="h-4.5 w-4.5" />
                        <span>{booking.estimatedCost.toLocaleString()}</span>
                      </span>
                    </div>
                  </div>

                  {/* Problem Description text block */}
                  <div className="space-y-2 pt-4 border-t border-slate-50 text-xs sm:text-sm leading-relaxed">
                    <span className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Issue Description</span>
                    <p className="text-slate-650 bg-slate-50/70 border border-slate-100 p-4 rounded-[20px]">
                      {booking.problemDescription}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Dispatch Progress Timeline) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                <Activity className="h-4 w-4 text-blue-600" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-450">Dispatch Progress</h3>
              </div>

              <div className="relative border-l border-slate-100 pl-5 ml-2.5 space-y-6 text-xs text-left">
                {bookingTimeline.map((step, idx) => (
                  <div key={idx} className="relative">
                    {/* Circle Indicator */}
                    <span className={`absolute -left-[32px] top-0.5 h-4 w-4 rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm ${
                      step.done 
                        ? (step.label.includes("Cancel") ? "bg-rose-500" : "bg-emerald-500") 
                        : "bg-slate-200"
                    }`}>
                      {step.done ? (
                        <CheckCircle className="h-2.5 w-2.5" />
                      ) : (
                        <Clock3 className="h-2.5 w-2.5 text-slate-400" />
                      )}
                    </span>

                    {/* Step Content */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`font-bold ${step.done ? "text-slate-800" : "text-slate-400"}`}>
                          {step.label}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold font-mono">
                          {step.date}
                        </span>
                      </div>
                      <p className={`leading-relaxed text-[11px] ${step.done ? "text-slate-500" : "text-slate-400"}`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
