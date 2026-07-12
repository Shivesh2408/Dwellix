"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import {
  Search, Star, ShieldCheck, IndianRupee, MapPin, 
  Clock, SlidersHorizontal, ChevronRight, Heart, Share2, Sparkles, Filter, ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [sortOrder, setSortOrder] = useState("rating-desc");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  const fetchTechnicians = useCallback(() => {
    setLoading(true);
    setError(null);
    apiClient<Technician[]>("/api/v1/technicians")
      .then((data) => {
        setTechnicians(data);
        // Pre-populate recently viewed with the first few items
        if (data.length > 0) {
          setRecentlyViewed(data.slice(0, 3).map(t => t.id));
        }
      })
      .catch((err) => {
        console.error("Failed to fetch technicians:", err);
        setError("Could not load technicians directory. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  const fetchWarranties = useCallback(() => {
    fetchTechnicians();
  }, [fetchTechnicians]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      await Promise.resolve();
      if (active) {
        fetchWarranties();
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [fetchWarranties]);

  const cities = useMemo(() => {
    return Array.from(new Set(technicians.map((t) => t.city)));
  }, [technicians]);

  // Categories defined as requested
  const categories = [
    { id: "all", name: "All Dispatches" },
    { id: "Kitchen", name: "Kitchen" },
    { id: "Laundry", name: "Laundry" },
    { id: "Cleaning", name: "Cleaning" },
    { id: "Cooling", name: "Cooling" },
    { id: "Entertainment", name: "Entertainment" },
    { id: "Smart Home", name: "Smart Home" }
  ];

  // Map technician specializations to mock e-commerce images/categories
  const getProductDetails = (tech: Technician) => {
    const spec = tech.specialization.toLowerCase();
    
    if (spec.includes("hvac") || spec.includes("cooling") || spec.includes("conditioner")) {
      return {
        category: "Cooling",
        image: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&w=600&q=80",
        brand: "Nest Pro",
        badge: "30-Day Guarantee",
        emi: "₹199/mo EMI Available",
        discount: "10% OFF"
      };
    }
    if (spec.includes("electric") || spec.includes("wiring") || spec.includes("power")) {
      return {
        category: "Smart Home",
        image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
        brand: "Philips Certified",
        badge: "Lifetime Guarantee",
        emi: "₹149/mo EMI Available",
        discount: "15% OFF"
      };
    }
    if (spec.includes("plumb") || spec.includes("leak") || spec.includes("pipe")) {
      return {
        category: "Kitchen",
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
        brand: "Kohler Certified",
        badge: "No-leak Warranty",
        emi: "₹99/mo EMI Available",
        discount: "5% OFF"
      };
    }
    if (spec.includes("washer") || spec.includes("dryer") || spec.includes("drum")) {
      return {
        category: "Laundry",
        image: "https://images.unsplash.com/photo-1582730149719-6112a441049c?auto=format&fit=crop&w=600&q=80",
        brand: "Samsung Support",
        badge: "Parts Warranty",
        emi: "₹249/mo EMI Available",
        discount: "20% OFF"
      };
    }
    if (spec.includes("tv") || spec.includes("audio") || spec.includes("sound")) {
      return {
        category: "Entertainment",
        image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=600&q=80",
        brand: "Sony Certified",
        badge: "Calibration Check",
        emi: "₹299/mo EMI Available",
        discount: "12% OFF"
      };
    }
    // Default
    return {
      category: "Cleaning",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
      brand: "Dyson Expert",
      badge: "Satisfaction Warranty",
      emi: "₹89/mo EMI Available",
      discount: "15% OFF"
    };
  };

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((wId) => wId !== id) : [...prev, id]
    );
  };

  const handleViewDetails = (id: string) => {
    // Add to recently viewed if not exists
    setRecentlyViewed((prev) => {
      const next = prev.filter((rId) => rId !== id);
      return [id, ...next].slice(0, 4);
    });
  };

  const filteredTechnicians = useMemo(() => {
    return technicians
      .filter((tech) => {
        const prod = getProductDetails(tech);
        const matchesSearch = 
          tech.name.toLowerCase().includes(search.toLowerCase()) ||
          tech.specialization.toLowerCase().includes(search.toLowerCase());

        const matchesCategory = 
          selectedCategory === "all" || 
          prod.category === selectedCategory;

        const matchesCity = cityFilter === "all" || tech.city === cityFilter;
        const matchesRating = tech.rating >= minRating;

        return matchesSearch && matchesCategory && matchesCity && matchesRating;
      })
      .sort((a, b) => {
        if (sortOrder === "rating-desc") return b.rating - a.rating;
        if (sortOrder === "experience-desc") return b.experienceYears - a.experienceYears;
        if (sortOrder === "rate-asc") return a.hourlyRate - b.hourlyRate;
        if (sortOrder === "rate-desc") return b.hourlyRate - a.hourlyRate;
        return 0;
      });
  }, [technicians, search, selectedCategory, cityFilter, minRating, sortOrder]);

  // Featured technicians computed (e.g. top 3 rated)
  const featuredTechnicians = useMemo(() => {
    return [...technicians].sort((a, b) => b.rating - a.rating).slice(0, 3);
  }, [technicians]);

  // Recommended technicians computed
  const recommendedTechnicians = useMemo(() => {
    return [...technicians].filter(t => t.rating >= 4.5 && t.hourlyRate < 2000).slice(0, 3);
  }, [technicians]);

  // Recently viewed maps
  const recentlyViewedObjects = useMemo(() => {
    return technicians.filter(t => recentlyViewed.includes(t.id));
  }, [technicians, recentlyViewed]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const cardVariants = {
    hidden: { y: 25, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
  };

  if (loading) {
    return (
      <div className="flex-grow p-10 space-y-10 max-w-[1400px] mx-auto w-full text-left bg-background min-h-screen">
        <div className="space-y-3">
          <Skeleton className="h-10 w-72 rounded-xl" />
          <Skeleton className="h-4.5 w-[500px] rounded-lg" />
        </div>
        <Skeleton className="h-14 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-96 rounded-[28px]" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 max-w-md mx-auto h-[60vh] gap-4 bg-background">
        <div className="h-16 w-16 rounded-[22px] bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
          <SlidersHorizontal className="h-8 w-8" />
        </div>
        <div className="text-base font-bold text-foreground font-heading">Error Loading Marketplace</div>
        <p className="text-sm text-[#6B7280] text-center">{error}</p>
        <Button onClick={fetchTechnicians} className="rounded-xl h-11 px-6 bg-black text-white hover:bg-black/90">Retry Loading</Button>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 md:p-12 max-w-[1400px] mx-auto w-full space-y-12 text-left bg-background font-sans">
      
      {/* Header section */}
      <div>
        <span className="px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider bg-primary-soft text-primary rounded-full border border-primary/20/50">
          Verified Dispatch
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mt-3 leading-none">
          Service Marketplace
        </h1>
        <p className="text-sm sm:text-base text-[#6B7280] mt-2">
          Book certified local professionals for smart home device repairs, preventative maintenance, and diagnostics.
        </p>
      </div>

      {/* Featured Services Carousel */}
      {featuredTechnicians.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Sparkles className="h-5.5 w-5.5 text-primary" />
            Featured Dispatches
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTechnicians.map((tech) => {
              const prod = getProductDetails(tech);
              return (
                <div 
                  key={tech.id} 
                  className="bg-black text-white rounded-[28px] overflow-hidden flex flex-col justify-between min-h-[380px] p-8 shadow-[0_16px_40px_rgba(0,0,0,0.12)] relative group hover:-translate-y-1 transition-all duration-300 border border-slate-900"
                >
                  <div className="absolute inset-0 opacity-45 group-hover:scale-105 transition-transform duration-700 pointer-events-none">
                    <img src={prod.image} alt={tech.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
                  
                  <div className="z-10 flex justify-between items-start">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/10">
                      {prod.brand}
                    </span>
                    <button 
                      type="button"
                      onClick={(e) => toggleWishlist(tech.id, e)} 
                      className="h-9 w-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 border border-white/10 cursor-pointer"
                    >
                      <Heart className={`h-4.5 w-4.5 ${wishlist.includes(tech.id) ? "fill-red-500 text-red-500" : ""}`} />
                    </button>
                  </div>

                  <div className="z-10 space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-primary-hover tracking-widest">{tech.specialization} Pro</span>
                      <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">{tech.name}</h3>
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />
                        <span className="font-bold">{tech.rating}</span>
                        <span className="text-slate-400">({tech.totalReviews} reviews)</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div>
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Hourly Rate</span>
                        <div className="text-lg font-black mt-0.5">₹{tech.hourlyRate}<span className="text-xs font-normal text-slate-400">/hr</span></div>
                      </div>
                      <Link href={`/dashboard/bookings/new?technician=${encodeURIComponent(tech.name)}`}>
                        <button className="h-10 px-5 rounded-xl bg-white text-black hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer">
                          Book Now
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Control bar / Filtering and Sorting */}
      <div className="bg-white border border-border rounded-[24px] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.02)] space-y-5">
        
        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#F8F9FB]">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-black text-white border-black"
                  : "bg-white text-[#6B7280] border-border hover:bg-slate-50 hover:text-black"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          <div className="flex-grow flex items-center gap-3 bg-background border border-border rounded-xl px-4 py-2.5 focus-within:border-primary transition-colors">
            <Search className="h-4.5 w-4.5 text-[#6B7280] shrink-0" />
            <input
              placeholder="Search dispatches, skills, cities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-0 outline-none text-sm w-full text-foreground placeholder:text-[#6B7280]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[#6B7280]" />
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="text-xs font-semibold text-foreground bg-white border border-border rounded-xl px-3 py-2 outline-none cursor-pointer"
              >
                <option value="all">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-[#6B7280]" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="text-xs font-semibold text-foreground bg-white border border-border rounded-xl px-3 py-2 outline-none cursor-pointer"
              >
                <option value="rating-desc">Highest Rated</option>
                <option value="experience-desc">Most Experienced</option>
                <option value="rate-asc">Price: Low to High</option>
                <option value="rate-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main product/technicians grid list */}
      <AnimatePresence mode="popLayout">
        {filteredTechnicians.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-20 text-center border-dashed border-2 border-border bg-white/50 rounded-[28px]"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-primary-soft text-primary mb-5 border border-primary/20">
              <SlidersHorizontal className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">No Services Found</h3>
            <p className="text-sm text-[#6B7280] mt-2 max-w-sm font-medium leading-relaxed">
              No technicians match the filtered category rules. Adjust criteria to sync dispatches.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredTechnicians.map((tech) => {
              const prod = getProductDetails(tech);
              return (
                <motion.div
                  key={tech.id}
                  variants={cardVariants}
                  whileHover={{ y: -6, boxShadow: "0 24px 48px rgba(0,0,0,0.06)" }}
                  className="bg-white border border-border rounded-[28px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col justify-between group transition-all duration-300 relative min-h-[420px]"
                >
                  
                  {/* Image banner preview */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-900 border-b border-border">
                    <img 
                      src={prod.image} 
                      alt={tech.name} 
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Badge details */}
                    <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
                      <span className="px-3 py-1 bg-black text-white text-[9px] font-bold uppercase tracking-wider rounded-md border border-slate-800">
                        {prod.discount}
                      </span>
                      <span className="px-3 py-1 bg-primary text-white text-[9px] font-bold uppercase tracking-wider rounded-md border border-primary">
                        {prod.badge}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => toggleWishlist(tech.id, e)}
                      className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-foreground hover:bg-white border border-border cursor-pointer shadow-sm transition-colors"
                    >
                      <Heart className={`h-4.5 w-4.5 ${wishlist.includes(tech.id) ? "fill-red-500 text-red-500" : ""}`} />
                    </button>
                  </div>

                  {/* Body details */}
                  <div className="p-6 space-y-4 flex-grow flex flex-col justify-between text-left">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary-soft px-2 py-0.5 rounded-md border border-primary/20/50">
                          {prod.brand}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                          <span className="text-foreground">{tech.rating}</span>
                          <span className="text-[#6B7280]">({tech.totalReviews})</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-extrabold text-foreground line-clamp-1 leading-snug">
                        {tech.name}
                      </h3>
                      <p className="text-xs text-[#6B7280] font-medium leading-relaxed">
                        Specializes in {tech.specialization} checks with {tech.experienceYears} years of verified experience.
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-[#F8F9FB] text-xs font-semibold text-[#6B7280]">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                          <span>Dispatch Area</span>
                        </div>
                        <span className="text-foreground">{tech.city}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-[#6B7280] font-bold bg-background border border-border px-2 py-0.5 rounded-md">
                          {prod.emi}
                        </span>
                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[9px] font-bold uppercase px-2 py-0.5">
                          {tech.availability}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-6 pt-0 border-t border-[#F8F9FB] flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">HOURLY RATE</span>
                      <div className="flex items-baseline text-lg font-extrabold text-foreground mt-0.5">
                        <IndianRupee className="h-3.5 w-3.5 text-[#6B7280] mr-0.5 self-center" />
                        {tech.hourlyRate}
                        <span className="text-[10px] text-[#6B7280] font-normal ml-0.5">/hr</span>
                      </div>
                    </div>

                    <Link 
                      href={`/dashboard/bookings/new?technician=${encodeURIComponent(tech.name)}`}
                      onClick={() => handleViewDetails(tech.id)}
                    >
                      <button className="h-10 px-4.5 rounded-xl bg-black text-white hover:bg-black/90 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer">
                        Book Dispatch
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </Link>
                  </div>

                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recommended Section */}
      {recommendedTechnicians.length > 0 && (
        <div className="pt-12 border-t border-border space-y-6">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">Recommended Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recommendedTechnicians.map((tech) => {
              const prod = getProductDetails(tech);
              return (
                <div 
                  key={tech.id}
                  className="bg-white border border-border rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.01)] hover:-translate-y-0.5 transition-all flex items-center justify-between gap-4 text-left"
                >
                  <div className="flex gap-4 items-center min-w-0">
                    <div className="h-12 w-12 rounded-xl bg-slate-50 border border-border overflow-hidden flex items-center justify-center shrink-0">
                      <img src={prod.image} alt={tech.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-foreground truncate">{tech.name}</h4>
                      <p className="text-[10px] text-[#6B7280] font-medium truncate mt-0.5">{tech.specialization} Pro • {tech.city}</p>
                    </div>
                  </div>
                  <Link href={`/dashboard/bookings/new?technician=${encodeURIComponent(tech.name)}`}>
                    <button className="h-8 w-8 rounded-lg bg-black text-white flex items-center justify-center hover:bg-black/90 shrink-0 cursor-pointer">
                      <ChevronRight className="h-4.5 w-4.5" />
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recently Viewed section */}
      {recentlyViewedObjects.length > 0 && (
        <div className="pt-12 border-t border-border space-y-6">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">Recently Viewed</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyViewedObjects.map((tech) => {
              const prod = getProductDetails(tech);
              return (
                <div 
                  key={tech.id} 
                  className="bg-white border border-border rounded-[24px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.01)] space-y-3 text-left hover:-translate-y-0.5 transition-all"
                >
                  <div className="aspect-[16/10] overflow-hidden rounded-xl bg-slate-50 border border-border">
                    <img src={prod.image} alt={tech.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <span className="text-[9px] uppercase font-bold text-primary block">{prod.brand}</span>
                    <h4 className="font-bold text-xs text-foreground truncate leading-tight">{tech.name}</h4>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-[#6B7280] font-medium">
                      <span>₹{tech.hourlyRate}/hr</span>
                      <span className="font-semibold">{tech.rating} ★</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
