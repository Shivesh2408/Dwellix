"use client";

import React, { useState, useEffect, useMemo } from "react";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import {
  Wrench,
  Search,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Briefcase,
  User,
  ArrowUpDown,
  Phone,
  Calendar,
  X,
  Sparkles,
  Award,
  BookOpen,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

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

export default function TechnicianMarketplacePage() {
  const router = useRouter();

  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filters
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedSpec, setSelectedSpec] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  // Profile Drawer State
  const [selectedTech, setSelectedTech] = useState<Technician | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    apiClient<Technician[]>("/api/v1/technicians")
      .then((data) => setTechnicians(data))
      .catch((err) => {
        console.error("Failed to load technicians:", err);
        setError("Unable to retrieve available technician profiles.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Compute unique cities and specializations for dropdown filters
  const cities = useMemo(() => {
    const set = new Set(technicians.map((t) => t.city));
    return ["all", ...Array.from(set)];
  }, [technicians]);

  const specializations = useMemo(() => {
    const set = new Set(technicians.map((t) => t.specialization));
    return ["all", ...Array.from(set)];
  }, [technicians]);

  // Filter and Sort logic
  const filteredTechnicians = useMemo(() => {
    let result = [...technicians];

    if (search.trim()) {
      const q = search.toLowerCase();
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

    if (selectedRating !== "all") {
      const minRating = parseFloat(selectedRating);
      result = result.filter((t) => t.rating >= minRating);
    }

    result.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "experience") return b.experienceYears - a.experienceYears;
      if (sortBy === "rate-low") return a.hourlyRate - b.hourlyRate;
      if (sortBy === "rate-high") return b.hourlyRate - a.hourlyRate;
      return 0;
    });

    return result;
  }, [technicians, search, selectedCity, selectedSpec, selectedRating, sortBy]);

  const handleOpenProfile = (tech: Technician) => {
    setSelectedTech(tech);
    setDrawerOpen(true);
  };

  const handleBookNow = (techName: string) => {
    router.push(`/dashboard/bookings/new?technician=${encodeURIComponent(techName)}`);
  };

  return (
    <div className="space-y-8 pb-16 text-left max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-heading font-extrabold text-foreground flex items-center gap-2">
            <Wrench className="h-6 w-6 text-primary" />
            <span>Certified Technicians</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Browse and schedule top-tier local service specialists verified by Dwellix.
          </p>
        </div>
      </div>

      {/* Search and Filters panel */}
      <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, specialty, location..."
              className="pl-9.5 h-10 rounded-xl text-xs border-slate-200 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* City filter */}
          <div className="space-y-1">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none focus:ring-1 focus:ring-primary text-slate-700 font-medium cursor-pointer"
            >
              <option value="all">All Cities</option>
              {cities.filter(c => c !== "all").map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Specialty filter */}
          <div className="space-y-1">
            <select
              value={selectedSpec}
              onChange={(e) => setSelectedSpec(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none focus:ring-1 focus:ring-primary text-slate-700 font-medium cursor-pointer"
            >
              <option value="all">All Specialities</option>
              {specializations.filter(s => s !== "all").map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {/* Rating filter */}
          <div className="space-y-1">
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 bg-white text-xs px-3 focus:outline-none focus:ring-1 focus:ring-primary text-slate-700 font-medium cursor-pointer"
            >
              <option value="all">All Ratings</option>
              <option value="4.8">4.8+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4.0+ Stars</option>
            </select>
          </div>
        </div>

        {/* Sorting row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100/60">
          <div className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">
            {filteredTechnicians.length} professionals matching
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-8 rounded-lg border border-slate-200 bg-white text-[11px] px-2 focus:outline-none text-slate-600 font-bold cursor-pointer"
            >
              <option value="rating">Sort by Rating</option>
              <option value="experience">Sort by Experience</option>
              <option value="rate-low">Price: Low to High</option>
              <option value="rate-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading state - SKELETON PULSE */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="rounded-3xl border border-slate-150 bg-white/70 p-5 space-y-4 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-200" />
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
            <div className="font-extrabold text-rose-900">Marketplace Connection Failed</div>
            <p className="text-rose-700 leading-relaxed">{error}</p>
            <Button onClick={() => window.location.reload()} className="h-8 rounded-lg text-xs bg-rose-600 text-white font-bold cursor-pointer">
              Retry Connection
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredTechnicians.length === 0 && (
        <div className="text-center py-16 max-w-md mx-auto space-y-5 bg-white border border-slate-150 rounded-3xl p-8 shadow-sm">
          <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center mx-auto shadow-sm">
            <Wrench className="h-7 w-7 opacity-50 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-foreground">No technicians found</h3>
            <p className="text-xs text-slate-450 leading-relaxed">
              No matching technician profiles match your city, specialization, or rating filter selections.
            </p>
          </div>
          <Button onClick={() => { setSelectedCity("all"); setSelectedSpec("all"); setSelectedRating("all"); setSearch(""); }} className="rounded-xl font-bold text-xs h-9 px-5 bg-primary text-white cursor-pointer hover:bg-primary/95 mt-1">
            Reset Filters
          </Button>
        </div>
      )}
      {!loading && !error && filteredTechnicians.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTechnicians.map((tech) => (
            <Card
              key={tech.id}
              className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-xs relative overflow-hidden group hover:border-primary/30 transition-all duration-300 flex flex-col shadow-sm text-left"
            >
              <CardContent className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Photo & verified row */}
                  <div className="flex items-start gap-4">
                    <div className="relative h-14 w-14 rounded-full overflow-hidden border border-slate-100 shadow-sm flex-shrink-0 bg-slate-50 flex items-center justify-center">
                      {tech.photoUrl ? (
                        <img src={tech.photoUrl} alt={tech.name} className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-6 w-6 text-slate-400" />
                      )}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-heading font-extrabold text-foreground text-base leading-tight truncate">
                          {tech.name}
                        </h4>
                        {tech.verified && (
                          <span className="flex items-center gap-0.5 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 flex-shrink-0 select-none">
                            <ShieldCheck className="h-2.5 w-2.5" />
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-primary/90 truncate">{tech.specialization}</p>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Briefcase className="h-3 w-3 text-slate-400" />
                        <span>{tech.experienceYears} Years Experience</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating & Location info */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-50 text-xs font-medium text-slate-600">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Feedback</span>
                      <div className="flex items-center gap-1 font-bold text-slate-800">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{tech.rating}</span>
                        <span className="text-slate-400 font-semibold text-[10px]">({tech.totalReviews})</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Location</span>
                      <div className="flex items-center gap-1 text-slate-700">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <span className="truncate">{tech.city}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Hourly Rate</span>
                      <span className="font-extrabold text-foreground text-sm">₹{tech.hourlyRate}/hr</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Availability</span>
                      <div className="flex items-center gap-1 text-slate-500 text-[10px] font-semibold leading-tight">
                        <Clock className="h-3 w-3 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{tech.availability}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2.5 pt-5 mt-4 border-t border-slate-50">
                  <Button
                    variant="outline"
                    onClick={() => handleOpenProfile(tech)}
                    className="rounded-xl font-bold text-xs h-9 border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    View Profile
                  </Button>
                  <Button
                    onClick={() => handleBookNow(tech.name)}
                    className="rounded-xl font-bold text-xs h-9 bg-primary text-white hover:bg-primary/95 cursor-pointer"
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Sliding detail drawer for Profile */}
      <AnimatePresence>
        {drawerOpen && selectedTech && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col p-6 overflow-y-auto text-left space-y-6"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="text-base font-heading font-extrabold text-foreground flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>Technician Profile Detail</span>
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-full h-8 w-8 hover:bg-slate-100"
                >
                  <X className="h-4 w-4 text-slate-500" />
                </Button>
              </div>

              {/* Banner Profile */}
              <div className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100">
                <div className="h-16 w-16 rounded-full overflow-hidden border border-white shadow-sm flex-shrink-0 bg-slate-100 flex items-center justify-center">
                  {selectedTech.photoUrl ? (
                    <img src={selectedTech.photoUrl} alt={selectedTech.name} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-8 w-8 text-slate-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-lg font-heading font-extrabold text-slate-950">{selectedTech.name}</h3>
                    {selectedTech.verified && (
                      <span className="flex items-center gap-0.5 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-primary">{selectedTech.specialization}</p>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase mt-1">
                    <MapPin className="h-3 w-3" />
                    <span>{selectedTech.city}</span>
                  </div>
                </div>
              </div>

              {/* Profile Details sections */}
              <div className="space-y-5 flex-1">
                {/* About section */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>About Technician</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Professional, certified Dwellix engineer with high-level expertise in complex troubleshooting, parts replacement, and routine preventive servicing. Dedicated to safe home operations and quick service turnaround.
                  </p>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span>Expertise & Skills</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 font-bold">Diagnostics</span>
                    <span className="text-[10px] px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 font-bold">Compressor Servicing</span>
                    <span className="text-[10px] px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 font-bold">Leak Detection</span>
                    <span className="text-[10px] px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 font-bold">Parts Swap</span>
                    <span className="text-[10px] px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 font-bold">Wiring Repair</span>
                  </div>
                </div>

                {/* Experience & Certifications */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Award className="h-3.5 w-3.5 text-amber-500" />
                    <span>Certifications & Work Experience</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600 font-medium">
                    <li className="flex items-start gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <span>{selectedTech.experienceYears} Years verified active work experience.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <span>Dwellix Home Safety Assurance certified.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <span>National Skill Council authorized professional.</span>
                    </li>
                  </ul>
                </div>

                {/* Ratings & reviews breakdown */}
                <div className="p-4 rounded-3xl border border-slate-100 space-y-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Ratings & Feedback Overview</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-foreground">{selectedTech.rating}</span>
                    <div className="flex flex-col">
                      <div className="flex items-center text-amber-400">
                        <Star className="h-3 w-3 fill-current" />
                        <Star className="h-3 w-3 fill-current" />
                        <Star className="h-3 w-3 fill-current" />
                        <Star className="h-3 w-3 fill-current" />
                        <Star className="h-3 w-3 fill-current" />
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{selectedTech.totalReviews} customer reviews</span>
                    </div>
                  </div>
                </div>

                {/* Available Time Slots */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Available Time Slots</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-bold text-slate-600">
                    <span className="p-2.5 border border-slate-100 rounded-xl bg-slate-50/50">09:00 AM - 11:00 AM</span>
                    <span className="p-2.5 border border-slate-100 rounded-xl bg-slate-50/50">11:00 AM - 01:00 PM</span>
                    <span className="p-2.5 border border-slate-100 rounded-xl bg-slate-50/50">01:00 PM - 03:00 PM</span>
                    <span className="p-2.5 border border-slate-100 rounded-xl bg-slate-50/50">03:00 PM - 05:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <a
                  href={`tel:${selectedTech.phone}`}
                  className="flex-1 rounded-xl font-bold text-xs h-10 border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-1.5 text-slate-700 cursor-pointer"
                >
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>Call Technician</span>
                </a>
                <Button
                  onClick={() => {
                    setDrawerOpen(false);
                    handleBookNow(selectedTech.name);
                  }}
                  className="flex-1 rounded-xl font-bold text-xs h-10 bg-primary text-white hover:bg-primary/95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Book Technician</span>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
