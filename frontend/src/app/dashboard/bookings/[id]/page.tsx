"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Wrench,
  Activity,
  Trash2,
  Edit2,
  AlertTriangle,
  ShieldCheck,
  CheckCircle,
  Clock3,
  Loader2,
  IndianRupee,
  FileText
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

  useEffect(() => {
    if (id) fetchBooking();
  }, [id]);

  const fetchBooking = () => {
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
  };

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
    } catch (err: any) {
      console.error("Failed to update booking:", err);
      setError(err?.message ?? "Error saving changes.");
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
    } catch (err: any) {
      console.error("Failed to cancel booking:", err);
      setError(err?.message ?? "Error canceling booking.");
      setSubmitting(false);
    }
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

  const bookingTimeline = useMemo(() => {
    if (!booking) return [];
    
    const steps = [
      {
        label: "Booking Created",
        date: new Date(booking.createdAt).toLocaleDateString(),
        done: true,
        desc: "Service request recorded in system."
      },
      {
        label: "Agent Confirmed",
        date: booking.status === "PENDING" ? "TBD" : booking.bookingDate,
        done: ["CONFIRMED", "IN_PROGRESS", "COMPLETED"].includes(booking.status?.toUpperCase()),
        desc: "Dwellix coordinator assigned technician slot."
      },
      {
        label: "Service Completed",
        date: booking.status === "COMPLETED" ? booking.bookingDate : "TBD",
        done: booking.status?.toUpperCase() === "COMPLETED",
        desc: "Technician resolved the reported issues."
      }
    ];

    if (booking.status?.toUpperCase() === "CANCELLED") {
      steps.push({
        label: "Booking Cancelled",
        date: new Date(booking.updatedAt).toLocaleDateString(),
        done: true,
        desc: "Booking request removed by owner."
      });
    }

    return steps;
  }, [booking]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <span className="text-xs font-semibold">Loading booking file...</span>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-850 text-xs md:text-sm font-medium flex items-start gap-3.5 shadow-sm text-left">
        <AlertTriangle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-extrabold text-rose-900">Record Not Found</div>
          <p className="text-rose-700">{error || "The requested booking does not exist."}</p>
          <Button onClick={() => router.push("/dashboard/bookings")} className="mt-4 rounded-xl font-bold h-9">
            Back to Bookings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 relative text-left">
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

      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <button
          onClick={() => router.push("/dashboard/bookings")}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer font-bold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Bookings</span>
        </button>

        {!isEditing && (
          <div className="flex items-center gap-2.5">
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="rounded-xl font-bold text-xs h-9 gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Edit Booking</span>
            </Button>
            <Button
              onClick={handleDelete}
              disabled={submitting}
              className="rounded-xl font-bold text-xs h-9 gap-1.5 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-600 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Cancel Booking</span>
            </Button>
          </div>
        )}
      </div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns - Form or Details */}
        <div className="lg:col-span-2 space-y-6">
          {isEditing ? (
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
              <h2 className="text-base font-extrabold text-slate-900 mb-5">Modify Booking Details</h2>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-400">Service Type *</label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none text-slate-700"
                    >
                      <option value="Maintenance">Maintenance</option>
                      <option value="Repair Check">Repair Check</option>
                      <option value="Deep Cleaning">Deep Cleaning</option>
                      <option value="Installation">Installation</option>
                      <option value="Emergency Inspect">Emergency Inspect</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-400">Booking Status *</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none text-slate-700"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-400">Booking Date *</label>
                    <Input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="h-10 rounded-xl text-xs border-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-400">Booking Time Slot *</label>
                    <Input
                      type="text"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="h-10 rounded-xl text-xs border-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-400">Technician Name</label>
                    <Input
                      type="text"
                      value={technicianName}
                      onChange={(e) => setTechnicianName(e.target.value)}
                      className="h-10 rounded-xl text-xs border-slate-200 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-400">Technician Phone</label>
                    <Input
                      type="text"
                      value={technicianPhone}
                      onChange={(e) => setTechnicianPhone(e.target.value)}
                      className="h-10 rounded-xl text-xs border-slate-200 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-400">Estimated Cost (₹)</label>
                    <Input
                      type="number"
                      value={estimatedCost}
                      onChange={(e) => setEstimatedCost(e.target.value)}
                      className="h-10 rounded-xl text-xs border-slate-200 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400">Problem Description *</label>
                  <textarea
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-slate-200 bg-white text-xs p-3 focus:outline-none text-slate-700 leading-relaxed resize-none"
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
                    className="rounded-xl text-xs font-bold h-9 bg-primary text-white"
                  >
                    {submitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm space-y-6">
              {/* Header section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <span className={`px-2 py-0.5 border rounded-full text-[9px] font-extrabold uppercase shadow-inner ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">ID: {booking.id}</span>
                </div>
                <h2 className="text-lg md:text-xl font-heading font-extrabold text-slate-900">
                  {booking.serviceType} for {booking.applianceName}
                </h2>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {booking.brand} &bull; {booking.model}
                </div>
              </div>

              {/* Data specifications */}
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-xs md:text-sm">
                <div className="space-y-1">
                  <span className="text-slate-400 block text-[10px] font-extrabold uppercase">Assigned Technician</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <User className="h-4 w-4 text-slate-400" />
                    <span>{booking.technicianName || "Unassigned"}</span>
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block text-[10px] font-extrabold uppercase">Contact Number</span>
                  <span className="font-bold text-slate-800 font-mono">
                    {booking.technicianPhone || "N/A"}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block text-[10px] font-extrabold uppercase">Service Schedule</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>{booking.bookingDate}</span>
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block text-[10px] font-extrabold uppercase">Time Slot</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span>{booking.bookingTime}</span>
                  </span>
                </div>
                <div className="col-span-2 space-y-1 pt-2 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-slate-400 text-[10px] font-extrabold uppercase">Estimated Resolution Cost</span>
                  <span className="font-extrabold text-indigo-600 text-base flex items-center gap-0.5">
                    <IndianRupee className="h-4 w-4" />
                    <span>{booking.estimatedCost.toLocaleString()}</span>
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5 pt-4 border-t border-slate-100 text-xs">
                <span className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wide">Problem Description</span>
                <p className="text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
                  {booking.problemDescription}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Status Timeline */}
        <div className="lg:col-span-1 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm h-fit space-y-6">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Dispatch Progress</h3>

          <div className="relative border-l border-slate-100 pl-5 space-y-5 text-xs text-left">
            {bookingTimeline.map((step, idx) => (
              <div key={idx} className="relative">
                <span className={`absolute -left-[28px] top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white flex items-center justify-center text-white ${
                  step.done ? "bg-emerald-500" : "bg-slate-200"
                }`}>
                  {step.done ? <CheckCircle className="h-2 w-2" /> : <Clock3 className="h-2 w-2 text-slate-400" />}
                </span>
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-800">{step.label}</span>
                    <span className="text-[9px] text-slate-400 font-bold font-mono">{step.date}</span>
                  </div>
                  <p className="text-slate-550 leading-relaxed text-[11px]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
