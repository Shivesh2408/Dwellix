"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import {
  Search, Star, ShieldCheck, IndianRupee, MapPin, 
  Clock, SlidersHorizontal, ChevronRight
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

  const specializations = Array.from(new Set(technicians.map((t) => t.specialization)));
  const cities = Array.from(new Set(technicians.map((t) => t.city)));

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
      <div className="flex-grow p-8 space-y-6 max-w-7xl mx-auto w-full text-left">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-14 w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-60 w-full rounded-3xl" />
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
        <Button onClick={fetchTechnicians} size="sm" className="rounded-xl">Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8 text-left">
      <div>
        <Badge className="bg-primary/5 text-primary text-[10px] uppercase font-bold tracking-widest rounded-full border-none">
          Verified Dispatch
        </Badge>
        <h1 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-foreground mt-2">Technician Marketplace</h1>
        <p className="text-sm text-muted-foreground font-medium">Book certified local professionals for smart home device repairs and diagnostics.</p>
      </div>

      {/* Redesigned Search & Filters Grid */}
      <Card className="p-5 border border-border/40 bg-white rounded-3xl shadow-premium">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          <div className="flex-grow flex items-center gap-2 border border-border/80 rounded-xl px-4 py-1.5 bg-white shadow-xs">
            <Search className="h-4.5 w-4.5 text-muted-foreground" />
            <Input
              placeholder="Search technicians or skill sets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-9"
            />
          </div>

          <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3">
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="px-4 py-2 border border-border rounded-xl text-xs bg-white text-foreground font-semibold focus:outline-none cursor-pointer h-12 min-w-[140px]"
            >
              <option value="all">All Specialties</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>

            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="px-4 py-2 border border-border rounded-xl text-xs bg-white text-foreground font-semibold focus:outline-none cursor-pointer h-12 min-w-[140px]"
            >
              <option value="all">All Cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-2 border border-border rounded-xl text-xs bg-white text-foreground font-semibold focus:outline-none cursor-pointer h-12 min-w-[140px] col-span-2 md:col-span-1"
            >
              <option value="rating-desc">Highest Rated</option>
              <option value="experience-desc">Most Experienced</option>
              <option value="rate-asc">Price: Low to High</option>
              <option value="rate-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Rebuilt Marketplace Grid */}
      {filteredTechnicians.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed border border-border bg-white rounded-3xl shadow-premium">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-muted-foreground mb-4">
            <SlidersHorizontal className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground font-heading">No Matches Found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm font-medium">
            Try adjusting your filters or search keywords to find certified professionals.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTechnicians.map((tech) => (
            <Card key={tech.id} className="border border-border/40 bg-white rounded-3xl p-6 shadow-premium hover-lift flex flex-col justify-between group">
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  {/* Styled Avatar */}
                  <div className="h-16 w-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-bold text-xl relative flex-shrink-0">
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
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-tight">{tech.name}</h3>
                    <Badge className="bg-primary/5 text-primary text-[9px] uppercase font-bold tracking-wider rounded-full border-none mt-1">
                      {tech.specialization}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-4 border-t border-slate-50 text-muted-foreground font-medium">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-foreground">{tech.rating}</span>
                    <span>({tech.totalReviews})</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{tech.experienceYears} yrs experience</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{tech.city}</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[9px] font-bold uppercase px-2 py-0.5">
                      {tech.availability}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">HOURLY RATE</span>
                  <div className="flex items-baseline text-lg font-extrabold text-foreground mt-0.5">
                    <IndianRupee className="h-3.5 w-3.5 text-muted-foreground mr-0.5 self-center" />
                    {tech.hourlyRate}
                    <span className="text-[10px] text-muted-foreground font-normal ml-0.5">/hr</span>
                  </div>
                </div>

                <Button asChild className="rounded-xl px-5 h-11 bg-black text-white hover:bg-black/90 shadow-sm flex items-center gap-1.5 text-xs font-semibold">
                  <Link href={`/dashboard/bookings/new?technician=${encodeURIComponent(tech.name)}`}>
                    Book Dispatch
                    <ChevronRight className="h-4 w-4" />
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
