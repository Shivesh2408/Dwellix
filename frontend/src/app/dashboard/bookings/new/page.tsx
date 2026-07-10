"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  Wrench,
  AlertTriangle,
  ShieldCheck,
  User,
  IndianRupee,
  Search,
  Filter,
  MapPin,
  Star,
  X,
  Upload,
  Image as ImageIcon,
  FileText,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CheckCircle2
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

interface Technician {
  id: string;
  name: string;
  photoUrl: string;
  specialization: string;
  experienceYears: number;
  rating: number;
  totalReviews: number;
  phone: string;
  email: string;
  city: string;
  availability: string;
  hourlyRate: number;
  verified: boolean;
}

interface Booking {
  id: string;
  status: string;
  bookingDate: string;
}

export default function NewBookingPage() {
  const router = useRouter();

  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [techniciansList, setTechniciansList] = useState<Technician[]>([]);
  const [bookingsList, setBookingsList] = useState<Booking[]>([]);
  const [loadingAppliances, setLoadingAppliances] = useState(true);
  const [loadingTechs, setLoadingTechs] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedSpec, setSelectedSpec] = useState("all");

  // Booking Drawer States
  const [selectedTech, setSelectedTech] = useState<Technician | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Form Fields
  const [applianceId, setApplianceId] = useState("");
  const [serviceType, setServiceType] = useState("Maintenance");
  const [problemDescription, setProblemDescription] = useState("");
  const [bookingTime, setBookingTime] = useState("11:00 AM - 01:00 PM");
  const [estimatedCost, setEstimatedCost] = useState("1500");

  // Calendar States
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  // Upload States
  const [applianceImage, setApplianceImage] = useState<File | null>(null);
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [applianceImagePreview, setApplianceImagePreview] = useState<string | null>(null);
  const [invoiceFileName, setInvoiceFileName] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch initial data
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
    apiClient<Technician[]>("/api/v1/technicians")
      .then((data) => {
        setTechniciansList(data);
      })
      .catch((err) => console.error("Failed to load technicians list:", err))
      .finally(() => setLoadingTechs(false));

    // Fetch bookings to display statistics
    apiClient<Booking[]>("/api/v1/bookings")
      .then((data) => setBookingsList(data))
      .catch((err) => console.error("Failed to fetch bookings list:", err));
  }, []);

  const handleOpenBooking = useCallback((tech: Technician) => {
    setSelectedTech(tech);
    setEstimatedCost((tech.hourlyRate * 3).toString());
    setDrawerOpen(true);
  }, []);

  // Handle URL query parameter pre-selection
  useEffect(() => {
    let active = true;
    const check = async () => {
      await Promise.resolve();
      if (active && typeof window !== "undefined" && techniciansList.length > 0) {
        const searchParams = new URLSearchParams(window.location.search);
        const techParam = searchParams.get("technician");
        if (techParam) {
          const matchedTech = techniciansList.find(
            (t) => t.name.toLowerCase() === techParam.toLowerCase()
          );
          if (matchedTech) {
            handleOpenBooking(matchedTech);
          }
        }
      }
    };
    check();
    return () => {
      active = false;
    };
  }, [techniciansList, handleOpenBooking]);

  // Compute unique cities and specializations for filtering
  const cities = useMemo(() => {
    const set = new Set(techniciansList.map((t) => t.city));
    return ["all", ...Array.from(set)];
  }, [techniciansList]);

  const specializations = useMemo(() => {
    const set = new Set(techniciansList.map((t) => t.specialization));
    return ["all", ...Array.from(set)];
  }, [techniciansList]);

  // Filtered Technicians
  const filteredTechnicians = useMemo(() => {
    let result = [...techniciansList];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.specialization.toLowerCase().includes(q) ||
          t.city.toLowerCase().includes(q)
      );
    }

    if (selectedCity !== "all") {
      result = result.filter((t) => t.city === selectedCity);
    }

    if (selectedSpec !== "all") {
      result = result.filter((t) => t.specialization === selectedSpec);
    }

    return result;
  }, [techniciansList, searchQuery, selectedCity, selectedSpec]);

  // Statistics
  const statistics = useMemo(() => {
    const upcoming = bookingsList.filter((b) =>
      ["PENDING", "CONFIRMED", "IN_PROGRESS"].includes(b.status?.toUpperCase())
    ).length;
    const completed = bookingsList.filter((b) => b.status?.toUpperCase() === "COMPLETED").length;
    const available = techniciansList.filter((t) => t.availability?.toLowerCase().includes("avail") || t.availability?.toLowerCase().includes("today")).length;
    const rating = 0;
    return { upcoming, completed, available, rating };
  }, [bookingsList, techniciansList]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };



  const handleCloseBooking = () => {
    setDrawerOpen(false);
    setSelectedTech(null);
    setSelectedDate(null);
  };

  const handleImageUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setApplianceImage(file);
      setApplianceImagePreview(URL.createObjectURL(file));
    }
  };

  const handleInvoiceUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setInvoiceFile(file);
      setInvoiceFileName(file.name);
    }
  };

  // Month navigation in custom calendar
  const handlePrevMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1));
  };

  // Compile calendar cells
  const calendarCells = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const cells: (Date | null)[] = [];
    // Padding
    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push(null);
    }
    // Days
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push(new Date(year, month, day));
    }
    return cells;
  }, [calendarMonth]);

  const formatSelectedDate = (date: Date | null) => {
    if (!date) return "";
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedDateString = formatSelectedDate(selectedDate);

    // Validation
    if (!applianceId || !serviceType.trim() || !problemDescription.trim() || !formattedDateString || !bookingTime.trim()) {
      setError("Please fill in all mandatory fields: Appliance, Service, Date, Time, and Description.");
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
          bookingDate: formattedDateString,
          bookingTime: bookingTime.trim(),
          technicianName: selectedTech ? selectedTech.name : "",
          technicianPhone: selectedTech ? selectedTech.phone : null,
          status: "PENDING",
          estimatedCost: parseFloat(estimatedCost) || 0.0
        })
      });

      showToast("Technician booking confirmed successfully.");
      setTimeout(() => {
        router.push("/dashboard/bookings");
      }, 1200);
    } catch (err: unknown) {
      console.error("Failed creating booking:", err);
      const apiErr = err as { message?: string };
      setError(apiErr?.message ?? "An error occurred while booking.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] py-8 px-4 sm:px-6 lg:px-8 text-left font-sans relative overflow-x-hidden">
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

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-1.5">
            <button
              onClick={() => router.push("/dashboard/bookings")}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer font-bold mb-1"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Bookings</span>
            </button>
            <h1 className="text-2xl sm:text-4xl font-heading font-extrabold tracking-tight text-slate-900">
              Book Technician
            </h1>
            <p className="text-xs sm:text-sm text-slate-550 max-w-xl">
              Schedule direct assistance with Dwellix-certified mechanics. Pick a technician below to initiate booking.
            </p>
          </div>

          {/* Location Selector (Mock design using cities list) */}
          <div className="flex items-center gap-2 bg-white border border-slate-100 px-3 py-1.5 rounded-2xl shadow-sm self-start md:self-auto">
            <MapPin className="h-4 w-4 text-blue-600" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">Global Location</option>
              {cities.filter(c => c !== "all").map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Statistics section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Scheduled Jobs</span>
              <span className="p-1.5 rounded-xl bg-blue-50 text-blue-600">
                <CalendarIcon className="h-4 w-4" />
              </span>
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl font-bold text-slate-900 font-heading">{statistics.upcoming}</div>
              <div className="text-[10px] text-slate-400 font-medium font-sans">Active dispatches</div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Resolved Visits</span>
              <span className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
              </span>
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl font-bold text-slate-900 font-heading">{statistics.completed}</div>
              <div className="text-[10px] text-slate-400 font-medium">Completed jobs</div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">On Duty Today</span>
              <span className="p-1.5 rounded-xl bg-purple-50 text-purple-600">
                <Wrench className="h-4 w-4" />
              </span>
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl font-bold text-slate-900 font-heading">{statistics.available}</div>
              <div className="text-[10px] text-slate-400 font-medium">Verified local techs</div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Satisfaction Score</span>
              <span className="p-1.5 rounded-xl bg-amber-50 text-amber-600">
                <Star className="h-4 w-4 fill-current text-amber-550" />
              </span>
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl font-bold text-slate-900 font-heading flex items-baseline gap-1">
                <span>{statistics.rating}</span>
                <span className="text-xs text-slate-450">/5</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Superb customer feedback</div>
            </div>
          </div>
        </div>

        {/* Filter and Control Bar */}
        <div className="bg-white border border-slate-150/40 rounded-3xl p-4 shadow-sm flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search technicians by name, specialization, or town..."
              className="pl-10 h-11 rounded-2xl border-slate-150 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm bg-[#F8F9FB] border-0"
            />
          </div>

          <div className="flex flex-wrap gap-2.5">
            <div className="flex items-center gap-1.5 bg-[#F8F9FB] rounded-2xl px-3 border border-slate-100">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={selectedSpec}
                onChange={(e) => setSelectedSpec(e.target.value)}
                className="h-11 bg-transparent text-xs font-semibold focus:outline-none text-slate-700 cursor-pointer"
              >
                <option value="all">All Specialties</option>
                {specializations.filter(s => s !== "all").map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tech Cards Grid */}
        {loadingTechs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white border border-slate-100 rounded-[24px] p-5 space-y-4 animate-pulse">
                <div className="h-44 rounded-2xl bg-slate-100" />
                <div className="space-y-2">
                  <div className="h-4 bg-slate-100 rounded-md w-3/4" />
                  <div className="h-3 bg-slate-100 rounded-md w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredTechnicians.length === 0 ? (
          <div className="text-center py-16 max-w-md mx-auto space-y-5 bg-white border border-slate-100 rounded-[24px] p-8 shadow-sm">
            <div className="h-16 w-16 rounded-2xl bg-[#F8F9FB] border border-slate-100 text-slate-450 flex items-center justify-center mx-auto shadow-inner">
              <User className="h-8 w-8 text-blue-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">No technicians found</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Try loosening your filters or search keywords to check available repair operators.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTechnicians.map((tech) => (
              <motion.div
                key={tech.id}
                whileHover={{ y: -4 }}
                className="bg-white border border-slate-100 rounded-[24px] overflow-hidden p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Photo & Badge */}
                <div className="space-y-4">
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100/50">
                    <img
                      src={tech.photoUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(tech.name)}`}
                      alt={tech.name}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    {tech.verified && (
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase bg-white/90 backdrop-blur-md text-blue-600 shadow-sm border border-slate-100/30">
                        <ShieldCheck className="h-3 w-3" />
                        <span>Verified</span>
                      </span>
                    )}

                    <span className="absolute bottom-3 right-3 inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-900/80 backdrop-blur-md text-white">
                      {tech.availability}
                    </span>
                  </div>

                  {/* Technician Info */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-blue-600 font-extrabold tracking-widest uppercase">
                        {tech.specialization}
                      </span>
                      <div className="flex items-center gap-0.5 text-amber-500 font-bold text-xs">
                        <Star className="h-3 w-3 fill-current" />
                        <span>{tech.rating}</span>
                        <span className="text-slate-400 font-normal">({tech.totalReviews})</span>
                      </div>
                    </div>

                    <h3 className="font-heading font-extrabold text-slate-900 text-base sm:text-lg">
                      {tech.name}
                    </h3>

                    {/* Meta stats tags */}
                    <div className="flex flex-wrap gap-2 text-[11px] font-medium text-slate-500 pt-1">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-100">
                        {tech.experienceYears} Years Exp
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        {tech.city}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-100">
                        2.4 km away
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Cost & Booking Trigger */}
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between mt-5 gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 uppercase font-extrabold block">Hourly Fee</span>
                    <span className="text-slate-900 font-extrabold text-base sm:text-lg font-heading flex items-baseline">
                      ₹{tech.hourlyRate}
                      <span className="text-[10px] text-slate-400 font-medium">/hr</span>
                    </span>
                  </div>

                  <Button
                    onClick={() => handleOpenBooking(tech)}
                    className="rounded-xl font-bold text-xs h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-all transform hover:scale-[1.01]"
                  >
                    Book Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Drawer Sheet */}
      <AnimatePresence>
        {drawerOpen && selectedTech && (
          <>
            {/* Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseBooking}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40"
            />

            {/* Drawer sheet container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[460px] bg-white shadow-2xl border-l border-slate-150/40 z-50 overflow-y-auto p-6 space-y-6 text-left"
            >
              {/* Header drawer actions */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="space-y-0.5">
                  <h3 className="text-base font-extrabold text-slate-900 font-heading">Schedule Service</h3>
                  <p className="text-[11px] text-slate-450 font-semibold uppercase">Reserve Appointment</p>
                </div>
                <button
                  onClick={handleCloseBooking}
                  className="p-2 rounded-full hover:bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Error status inside drawer */}
              {error && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-800 text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4.5 w-4.5 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* Technician Compact Info */}
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-100/50 p-4 rounded-3xl">
                <div className="h-14 w-14 rounded-2xl overflow-hidden bg-white border border-slate-100">
                  <img
                    src={selectedTech.photoUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(selectedTech.name)}`}
                    alt={selectedTech.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">{selectedTech.name}</h4>
                    {selectedTech.verified && <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />}
                  </div>
                  <p className="text-[11px] text-slate-450 font-medium uppercase tracking-wide">
                    {selectedTech.specialization} &bull; {selectedTech.city}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-800">
                    <Star className="h-3 w-3 fill-current text-amber-500" />
                    <span>{selectedTech.rating}</span>
                    <span className="text-slate-400 font-normal">({selectedTech.totalReviews} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Form elements */}
              <form onSubmit={handleSubmit} className="space-y-5 text-slate-700">
                {/* Select Appliance dropdown */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450">
                    Select Appliance *
                  </label>
                  {loadingAppliances ? (
                    <div className="h-10 rounded-xl border border-slate-150 bg-slate-50 flex items-center px-3 text-xs text-slate-400 font-medium">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-650 mr-2" />
                      <span>Retrieving logged appliances...</span>
                    </div>
                  ) : appliances.length === 0 ? (
                    <div className="p-4 border border-amber-100 bg-amber-50/50 rounded-2xl text-xs text-amber-800 flex items-center gap-2">
                      <AlertTriangle className="h-4.5 w-4.5 text-amber-500" />
                      <span>No registered appliances found. Register an appliance first.</span>
                    </div>
                  ) : (
                    <select
                      value={applianceId}
                      onChange={(e) => setApplianceId(e.target.value)}
                      className="w-full h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
                    >
                      {appliances.map((app) => (
                        <option key={app.id} value={app.id}>
                          {app.name} ({app.brand} - {app.model})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Service Type selection dropdown */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450">
                    Service Action *
                  </label>
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

                {/* Premium Interactive Month Calendar UI */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450 block">
                    Choose Schedule Date *
                  </label>

                  <div className="bg-slate-50 border border-slate-150/40 p-4 rounded-3xl space-y-3">
                    {/* Month control header */}
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>
                        {calendarMonth.toLocaleString("default", { month: "long" })}{" "}
                        {calendarMonth.getFullYear()}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={handlePrevMonth}
                          className="p-1 rounded-lg border border-slate-200 bg-white text-slate-450 hover:text-slate-700 hover:bg-slate-550/5 transition-all cursor-pointer"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleNextMonth}
                          className="p-1 rounded-lg border border-slate-200 bg-white text-slate-450 hover:text-slate-700 hover:bg-slate-550/5 transition-all cursor-pointer"
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Day labels */}
                    <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                      <span>Su</span>
                      <span>Mo</span>
                      <span>Tu</span>
                      <span>We</span>
                      <span>Th</span>
                      <span>Fr</span>
                      <span>Sa</span>
                    </div>

                    {/* Days matrix */}
                    <div className="grid grid-cols-7 gap-1">
                      {calendarCells.map((cell, index) => {
                        if (!cell) {
                          return <div key={`empty-${index}`} />;
                        }

                        const cellDateString = cell.toDateString();
                        const isSelected = selectedDate?.toDateString() === cellDateString;
                        const isPast = new Date(cell.getFullYear(), cell.getMonth(), cell.getDate()) < new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

                        return (
                          <button
                            key={cellDateString}
                            type="button"
                            disabled={isPast}
                            onClick={() => setSelectedDate(cell)}
                            className={`h-8 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center ${
                              isSelected
                                ? "bg-blue-600 text-white shadow-sm font-extrabold"
                                : isPast
                                ? "text-slate-300 cursor-not-allowed opacity-50"
                                : "text-slate-700 hover:bg-slate-200 bg-white border border-slate-100"
                            }`}
                          >
                            {cell.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {selectedDate && (
                    <div className="text-[11px] text-blue-600 font-bold flex items-center gap-1.5 mt-1 bg-blue-50/50 p-2 rounded-xl border border-blue-100/30">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Selected: {selectedDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  )}
                </div>

                {/* Time Slots selector Chips */}
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450">
                    Booking Time Slot *
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      "09:00 AM - 11:00 AM",
                      "11:00 AM - 01:00 PM",
                      "01:00 PM - 03:00 PM",
                      "03:00 PM - 05:00 PM",
                      "05:00 PM - 07:00 PM"
                    ].map((slot) => {
                      const isActive = bookingTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setBookingTime(slot)}
                          className={`h-9 px-3 border rounded-xl font-semibold transition-all text-left flex items-center gap-1.5 cursor-pointer ${
                            isActive
                              ? "border-blue-600 bg-blue-50/50 text-blue-700 ring-1 ring-blue-500"
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <Clock className={`h-3.5 w-3.5 ${isActive ? "text-blue-600 animate-pulse" : "text-slate-400"}`} />
                          <span>{slot.split(" ")[0]} {slot.split(" ")[1]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Problem Description field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450">
                    Problem Description *
                  </label>
                  <textarea
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder="Describe issue symptoms, appliance model codes or active leaks..."
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 bg-white text-xs p-3.5 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-750 leading-relaxed resize-none font-sans"
                  />
                </div>

                {/* File Drop Widgets for Appliance Image and Invoice Receipt */}
                <div className="grid grid-cols-2 gap-3 text-left">
                  {/* Appliance image upload */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-450">Appliance Image</label>
                    <div className="relative border border-dashed border-slate-200 rounded-2xl p-3 flex flex-col items-center justify-center bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors text-center min-h-[90px]">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUploadChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      {applianceImagePreview ? (
                        <div className="relative w-full h-[60px] rounded-lg overflow-hidden">
                          <img src={applianceImagePreview} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setApplianceImage(null);
                              setApplianceImagePreview(null);
                            }}
                            className="absolute top-1 right-1 p-0.5 bg-slate-900/80 rounded-full text-white text-[9px]"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="h-4 w-4 text-slate-400 mb-1" />
                          <span className="text-[9px] text-slate-400 font-bold block">Select photo</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Invoice upload */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-450">Upload Invoice</label>
                    <div className="relative border border-dashed border-slate-200 rounded-2xl p-3 flex flex-col items-center justify-center bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors text-center min-h-[90px]">
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleInvoiceUploadChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      {invoiceFileName ? (
                        <div className="relative w-full text-center space-y-1">
                          <FileText className="h-4.5 w-4.5 text-blue-600 mx-auto" />
                          <span className="text-[8px] font-bold text-slate-700 truncate max-w-[80px] block mx-auto">
                            {invoiceFileName}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setInvoiceFile(null);
                              setInvoiceFileName(null);
                            }}
                            className="absolute -top-1.5 -right-1 p-0.5 bg-slate-900/80 rounded-full text-white text-[9px]"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 text-slate-400 mb-1" />
                          <span className="text-[9px] text-slate-400 font-bold block">Upload PDF/Receipt</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Estimated Budget display and Confirmation Actions */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-500 font-semibold">Estimated Billing Quote</span>
                    <span className="font-extrabold text-blue-600 text-base sm:text-lg flex items-center font-heading">
                      <IndianRupee className="h-4 w-4" />
                      <span>{parseFloat(estimatedCost).toLocaleString()}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseBooking}
                      className="flex-1 rounded-xl text-xs font-bold h-10 border-slate-200 text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting || appliances.length === 0 || !selectedDate}
                      className="flex-1 rounded-xl text-xs font-bold h-10 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Booking...</span>
                        </>
                      ) : (
                        <span>Confirm Service</span>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Dummy loader component to prevent missing definition compile bugs
function Loader2({ className, ...props }: React.SVGProps<SVGSVGElement>) {
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
