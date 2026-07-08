"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import {
  Search,
  Filter,
  Star,
  ShieldCheck,
  Calendar,
  IndianRupee,
  MapPin,
  Clock,
  ArrowUpDown,
  SlidersHorizontal,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Technician {
  id: string;
  name: string;
  photoUrl: string | null;
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

export default function MarketplacePage() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("all");
  const [city, setCity] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [sortOrder, setSortOrder] = useState("rating-desc");

  const fetchTechnicians = () => {
    setLoading(true);
    setError(null);
    apiClient<Technician[]>("/api/v1/technicians")
      .then((data) => setTechnicians(data))
      .catch((err) => {
        console.error("Failed to fetch technicians:", err);
        setError("Could not load technicians directory. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  // Compute unique specialization & city lists for filter options
  const specializations = Array.from(new Set(technicians.map((t) => t.specialization)));
  const cities = Array.from(new Set(technicians.map((t) => t.city)));

  // Filter & Sort technicians
  const filteredTechnicians = technicians
    .filter((tech) => {
      const matchSearch = tech.name.toLowerCase().includes(search.toLowerCase()) ||
        tech.specialization.toLowerCase().includes(search.toLowerCase());
      const matchSpec = specialization === "all" || tech.specialization === specialization;
      const matchCity = city === "all" || tech.city === city;
      const matchRating = tech.rating >= minRating;
      return matchSearch && matchSpec && matchCity && matchRating;
    })
    .sort((a, b) => {
      if (sortOrder === "rating-desc") return b.rating - a.rating;
      if (sortOrder === "experience-desc") return b.experienceYears - a.experienceYears;
      if (sortOrder === "rate-asc") return a.hourlyRate - b.hourlyRate;
      if (sortOrder === "rate-desc") return b.hourlyRate - a.hourlyRate;
      return 0;
    });

  if (loading) {
    return (
      <div className="flex-grow p-8 space-y-6 max-w-7xl mx-auto w-full">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-14 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-60 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 max-w-md mx-auto h-[60vh] gap-4">
        <div className="text-sm font-bold text-destructive font-heading">Error Loading Marketplace</div>
        <p className="text-xs text-muted-foreground text-center">{error}</p>
        <Button onClick={fetchTechnicians} size="sm">Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-heading">Technician Marketplace</h1>
        <p className="text-sm text-muted-foreground mt-1">Hire verified professionals for appliance repairs, installations, and checkups.</p>
      </div>

      {/* Filter Row */}
      <Card className="p-4 border-border/70 bg-white rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-grow flex items-center gap-2 border border-border/60 rounded-xl px-3 bg-slate-50/50">
            <Search className="h-4.5 w-4.5 text-muted-foreground" />
            <Input
              placeholder="Search by name or specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
            />
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5">
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="px-3.5 py-2 border border-border/60 rounded-xl text-xs bg-white text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Specialties</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>

            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="px-3.5 py-2 border border-border/60 rounded-xl text-xs bg-white text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3.5 py-2 border border-border/60 rounded-xl text-xs bg-white text-slate-700 font-medium focus:outline-none cursor-pointer col-span-2 sm:col-span-1"
            >
              <option value="rating-desc">Highest Rated</option>
              <option value="experience-desc">Most Experienced</option>
              <option value="rate-asc">Price: Low to High</option>
              <option value="rate-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Grid List */}
      {filteredTechnicians.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed border-2 border-border/80 bg-white/50 rounded-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 mb-4">
            <SlidersHorizontal className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 font-heading">No Technicians Available</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            We couldn't find any certified technicians matching your filters. Try clearing some criteria.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTechnicians.map((tech) => (
            <Card key={tech.id} className="border-border/70 bg-white rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-border transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {/* Photo fallback */}
                  <div className="h-14 w-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-lg relative flex-shrink-0">
                    {tech.photoUrl ? (
                      <img src={tech.photoUrl} alt={tech.name} className="h-full w-full rounded-2xl object-cover" />
                    ) : (
                      tech.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
                    )}
                    {tech.verified && (
                      <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white" title="Verified Professional">
                        <ShieldCheck className="h-3 w-3" />
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-800 line-clamp-1 group-hover:text-primary transition-colors">{tech.name}</h3>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 mt-1">
                      {tech.specialization}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-100 text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-slate-800">{tech.rating}</span>
                    <span className="text-slate-400">({tech.totalReviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{tech.experienceYears} Years Exp</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{tech.city}</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                      {tech.availability}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Hourly Rate</span>
                  <div className="flex items-center text-base font-extrabold text-slate-800 mt-0.5">
                    <IndianRupee className="h-4 w-4 text-slate-500" />
                    {tech.hourlyRate}
                  </div>
                </div>

                <Button asChild className="gap-1.5 shadow-sm rounded-xl">
                  <Link href={`/dashboard/bookings/new?technician=${encodeURIComponent(tech.name)}`}>
                    Book Now
                    <ChevronRight className="h-4.5 w-4.5" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
