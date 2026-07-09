"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Sparkles, ShieldCheck, Wrench, 
  Activity, ChevronRight, Menu, X, 
  Check, Shield, MessageSquare, Cpu, Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// Recreating the exact Mockup Design

function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-6">
      <nav className="max-w-7xl mx-auto rounded-[24px] border border-slate-200/60 bg-white/80 backdrop-blur-md px-8 py-3.5 flex items-center justify-between shadow-[0_2px_20px_-8px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
            <img src="/logo/dwellix-logo-light.png" alt="Dwellix" className="h-5.5 w-5.5 object-contain" />
          </div>
          <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900">Dwellix</span>
        </div>

        {/* Navigation Links matching mockup */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
          <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How it Works</a>
          <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
          <a href="#resources" className="hover:text-slate-900 transition-colors">Resources</a>
          <a href="#about" className="hover:text-slate-900 transition-colors">About Us</a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/auth/login">
            <Button variant="ghost" size="sm" className="text-sm font-semibold text-slate-700 hover:text-slate-950">Log in</Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="sm" className="text-sm rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 h-11">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-xl hover:bg-slate-100 md:hidden transition-colors cursor-pointer text-slate-700"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-24 left-6 right-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl z-40 flex flex-col gap-4 md:hidden text-left"
          >
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold py-2.5 border-b border-slate-100 text-slate-800">Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold py-2.5 border-b border-slate-100 text-slate-800">How it Works</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold py-2.5 border-b border-slate-100 text-slate-800">Pricing</a>
            <a href="#resources" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold py-2.5 border-b border-slate-100 text-slate-800">Resources</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold py-2.5 text-slate-800">About Us</a>
            <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
              <Link href="/auth/login" className="w-full">
                <Button variant="outline" className="w-full h-11 rounded-xl text-sm font-semibold">Log in</Button>
              </Link>
              <Link href="/auth/signup" className="w-full">
                <Button className="w-full h-11 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700">Get Started</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function LandingHero() {
  const brands = [
    { name: "SAMSUNG", logo: "/logo/samsung.png" },
    { name: "LG", logo: "/logo/lg.png" },
    { name: "BOSCH", logo: "/logo/bosch.png" },
    { name: "Whirlpool", logo: "/logo/whirlpool.png" },
    { name: "Haier", logo: "/logo/haier.png" },
    { name: "Panasonic", logo: "/logo/panasonic.png" }
  ];

  return (
    <section className="relative pt-36 pb-16 overflow-hidden bg-gradient-to-b from-[#F3F6FD]/70 via-white to-white min-h-screen flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text content */}
          <div className="lg:col-span-6 flex flex-col items-start text-left gap-6 z-10">
            <Badge className="px-3.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-50 text-[11px] font-bold tracking-wide rounded-full border border-blue-100 flex items-center gap-1.5 self-start">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Home Management
            </Badge>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08] font-heading">
              Your Home. <br />
              <span className="text-blue-600">Smarter Every Day.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-500 leading-relaxed font-normal max-w-xl">
              Diagnose issues, track warranties, schedule maintenance, and manage everything in one beautifully intelligent platform.
            </p>

            <div className="flex flex-row items-center gap-4 w-full sm:w-auto pt-2">
              <Link href="/auth/signup" className="w-full sm:w-auto">
                <Button className="font-bold w-full sm:w-auto h-12 px-6 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm text-sm">
                  Get Started Free
                </Button>
              </Link>
              <Button variant="ghost" className="font-bold w-full sm:w-auto h-12 px-6 rounded-xl text-slate-700 hover:text-slate-950 flex items-center gap-2 text-sm">
                <div className="h-8 w-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 shadow-xs">
                  <Play className="h-3 w-3 fill-slate-500 text-slate-500 ml-0.5" />
                </div>
                Watch Demo
              </Button>
            </div>

            <div className="pt-8 border-t border-slate-100 w-full">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Trusted by thousands of modern homes</p>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 opacity-55 grayscale">
                {brands.map((b, idx) => (
                  <span key={idx} className="font-heading font-extrabold text-sm md:text-base tracking-tight text-slate-600 select-none">
                    {b.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Image with absolute-positioned floating cards matching mockup */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            {/* The 3D House Image */}
            <div className="relative max-w-lg w-full aspect-square rounded-[36px] overflow-hidden shadow-2xl border border-slate-100/50 bg-white p-2">
              <img 
                src="/images/hero-illustration-v1.webp" 
                alt="Smart Home" 
                className="w-full h-full object-cover rounded-[28px]"
              />
            </div>

            {/* Floating Card 1: AI Diagnostics (Top-Left) */}
            <motion.div 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute -top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/50 px-4.5 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center gap-3"
            >
              <div className="h-9 w-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-800">#AIDiagnostics</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] text-emerald-600 font-bold uppercase">Active</span>
                </div>
              </div>
            </motion.div>

            {/* Floating Card 2: 12 Appliances (Bottom-Left) */}
            <motion.div 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.75, duration: 0.5 }}
              className="absolute bottom-16 -left-8 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/50 px-4.5 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center gap-3"
            >
              <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Cpu className="h-4.5 w-4.5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-800">12 Appliances</div>
                <div className="text-[10px] text-slate-400 font-bold mt-0.5">Connected</div>
              </div>
            </motion.div>

            {/* Floating Card 3: 3 Warranties (Bottom-Right) */}
            <motion.div 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="absolute -bottom-4 right-12 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/50 px-4.5 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center gap-3"
            >
              <div className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Shield className="h-4.5 w-4.5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-800">3 Warranties</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-[10px] text-amber-600 font-bold uppercase">Expiring Soon</span>
                </div>
              </div>
            </motion.div>

            {/* Floating Card 4: Health Score Gauge (Middle-Right) */}
            <motion.div 
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.05, duration: 0.5 }}
              className="absolute top-1/3 -right-6 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/50 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center gap-4"
            >
              <div className="relative h-11 w-11 flex items-center justify-center flex-shrink-0">
                <svg className="transform -rotate-90 w-full h-full">
                  <circle cx="22" cy="22" r="18" className="stroke-slate-50" strokeWidth="3.5" fill="transparent" />
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    stroke="#10B981"
                    strokeWidth="3.5"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 18}
                    strokeDashoffset={(2 * Math.PI * 18) - (92 / 100) * (2 * Math.PI * 18)}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-[10px] font-bold text-slate-800">92%</span>
              </div>
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Health Score</div>
                <span className="text-xs font-bold text-emerald-600 block mt-0.5">92 / 100</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

function Features() {
  const list = [
    { icon: Sparkles, title: "AI Appliance Diagnosis", desc: "Troubleshoot faults or error codes instantly via our custom vision AI engine." },
    { icon: Shield, title: "Warranty & Invoice Vault", desc: "Consolidate invoices and warranty coverages in a single secure cloud digital records vault." },
    { icon: Wrench, title: "Maintenance Schedules", desc: "Autogenerate recurring service tasks to maximize home hardware operational lifespan." },
    { icon: MessageSquare, title: "Verified Service Marketplace", desc: "Hire top-rated certified local technicians and track status dispatches in real-time." }
  ];

  return (
    <section id="features" className="py-24 bg-white border-y border-slate-100 text-left">
      <div className="max-w-7xl mx-auto px-8">
        <div className="max-w-2xl space-y-3 mb-16">
          <Badge className="px-3.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-50 text-[11px] font-bold rounded-full border-none">
            Features Overview
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-slate-900 leading-tight">
            Complete management, engineered beautifully.
          </h2>
          <p className="text-base text-slate-500 font-medium leading-relaxed">
            Monitor hardware wellness status, manage coverages, and hire professional handymen in one unified dashboard experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {list.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} className="rounded-[24px] border border-slate-200/60 bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300 min-h-[220px]">
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-blue-50/70 text-blue-600 inline-block">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-base text-slate-800 tracking-tight">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                </div>
                <div className="pt-4 flex items-center gap-1 text-[11px] text-blue-600 font-semibold cursor-pointer group mt-4">
                  <span>Learn more</span>
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Statistics() {
  const stats = [
    { value: "45k+", label: "Homes Connected" },
    { value: "98.7%", label: "System Accuracy" },
    { value: "15 min", label: "Average Dispatch Time" },
    { value: "$2.4M", label: "Saved in Repair Costs" }
  ];

  return (
    <section id="stats" className="py-20 bg-[#F8F9FB] border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 tracking-tight">{stat.value}</div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white py-12 border-t border-slate-100 text-xs text-slate-400 font-medium">
      <div className="max-w-7xl mx-auto px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
            <img src="/logo/dwellix-logo-light.png" alt="Dwellix" className="h-4.5 w-4.5 object-contain" />
          </div>
          <span className="font-heading font-extrabold text-sm tracking-tight text-slate-800">Dwellix</span>
        </div>
        <div className="flex gap-8">
          <a href="#features" className="hover:text-slate-600 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-slate-600 transition-colors">How it Works</a>
          <a href="#pricing" className="hover:text-slate-600 transition-colors">Pricing</a>
          <a href="#resources" className="hover:text-slate-600 transition-colors">Resources</a>
        </div>
        <div>
          © 2026 Dwellix. All rights reserved. Recreated according to exact mockup specifications.
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between overflow-x-hidden font-sans">
      <LandingNavbar />
      <main className="flex-grow">
        <LandingHero />
        <Features />
        <Statistics />
      </main>
      <Footer />
    </div>
  );
}
