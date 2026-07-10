"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, X, Sparkles, Cpu, Shield, Clock, Play, ArrowRight, Activity, Wrench, ShieldCheck,
  Search, Bell, Settings, LayoutDashboard, Database, HelpCircle, User, LogOut, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Animation variants
  const navVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
  };

  const heroTextVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.1 } }
  };

  const ctaVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.3 } }
  };

  const dashboardVariants = {
    hidden: { scale: 0.93, opacity: 0, y: 60, rotateX: 5 },
    visible: { scale: 1, opacity: 1, y: 0, rotateX: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.4 } }
  };

  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.6
      }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
  };

  const trustedBrands = [
    "Samsung", "LG", "Bosch", "Whirlpool", "Haier", "Panasonic"
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#111111] overflow-x-hidden font-sans selection:bg-blue-600/10 selection:text-blue-600 relative">
      
      {/* Background Radial Glow & Blur Layers */}
      <div className="absolute top-0 right-[-10%] w-[900px] h-[900px] bg-gradient-to-br from-blue-600/10 to-indigo-600/5 rounded-full blur-[140px] pointer-events-none -z-10 translate-y-[-20%]" />
      <div className="absolute top-[300px] left-[-20%] w-[700px] h-[700px] bg-gradient-to-tr from-cyan-500/5 to-blue-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[600px] right-[10%] w-[600px] h-[600px] bg-radial from-blue-500/5 to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Floating Navbar */}
      <motion.header 
        variants={navVariants}
        initial="hidden"
        animate="visible"
        className="fixed top-0 left-0 right-0 z-50 p-8 flex justify-center"
      >
        <nav className="w-full max-w-[1280px] h-20 rounded-[28px] border border-[#ECECEC] bg-white/70 backdrop-blur-xl px-10 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white shadow-sm">
              <img src="/logo/dwellix-logo-light.png" alt="Dwellix Logo" className="h-6 w-6 object-contain invert" />
            </div>
            <span className="font-heading font-extrabold text-xl tracking-tighter text-[#111111]">Dwellix</span>
          </div>

          {/* Centered Navigation Links */}
          <div className="hidden md:flex items-center gap-10 text-[15px] font-semibold text-[#6B7280]">
            <a href="#features" className="hover:text-[#111111] transition-colors tracking-tight">Features</a>
            <a href="#how-it-works" className="hover:text-[#111111] transition-colors tracking-tight">How it Works</a>
            <a href="#pricing" className="hover:text-[#111111] transition-colors tracking-tight">Pricing</a>
            <a href="#resources" className="hover:text-[#111111] transition-colors tracking-tight">Resources</a>
            <a href="#about" className="hover:text-[#111111] transition-colors tracking-tight">About Us</a>
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/auth/login" className="text-[15px] font-bold text-[#6B7280] hover:text-[#111111] transition-colors">
              Log in
            </Link>
            <Link href="/auth/signup">
              <button className="h-12 px-7 rounded-2xl bg-black text-white hover:bg-black/90 font-semibold text-[15px] transition-all shadow-[0_4px_14px_rgba(0,0,0,0.1)] active:scale-[0.98] cursor-pointer">
                Get Started
              </button>
            </Link>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-[#F8F9FB] transition-colors text-[#6B7280]"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {/* Mobile slide-down menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -20 }}
              className="absolute top-32 left-8 right-8 bg-white border border-[#ECECEC] rounded-[32px] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.08)] z-40 flex flex-col gap-5 text-left"
            >
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold py-2.5 border-b border-[#ECECEC] text-[#111111]">Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold py-2.5 border-b border-[#ECECEC] text-[#111111]">How it Works</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold py-2.5 border-b border-[#ECECEC] text-[#111111]">Pricing</a>
              <a href="#resources" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold py-2.5 border-b border-[#ECECEC] text-[#111111]">Resources</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-base font-semibold py-2.5 text-[#111111]">About Us</a>
              <div className="flex flex-col gap-3 pt-6 border-t border-[#ECECEC]">
                <Link href="/auth/login" className="w-full">
                  <Button variant="outline" className="w-full h-12 rounded-2xl text-base font-semibold border-[#ECECEC]">Log in</Button>
                </Link>
                <Link href="/auth/signup" className="w-full">
                  <button className="w-full h-12 rounded-2xl bg-black text-white hover:bg-black/90 font-bold text-base transition-colors shadow-sm">
                    Get Started
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <main className="max-w-[1400px] mx-auto px-8 pt-48 pb-32 w-full flex flex-col justify-center gap-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center w-full">
          
          {/* LEFT: Premium Copy & Actions */}
          <div className="lg:col-span-5 flex flex-col items-start text-left gap-8 z-10">
            <motion.div 
              variants={heroTextVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-blue-100 bg-blue-50/50 text-blue-600 text-xs font-semibold tracking-wide"
            >
              <Sparkles className="h-4 w-4" />
              AI-Powered Smart Home Management
            </motion.div>

            <motion.h1 
              variants={heroTextVariants}
              initial="hidden"
              animate="visible"
              className="text-[52px] sm:text-[76px] lg:text-[84px] font-extrabold tracking-[-0.06em] text-[#111111] leading-[0.9] -ml-1"
            >
              Your Home. <br />
              <span className="text-blue-600">Smarter.</span>
            </motion.h1>

            <motion.p 
              variants={heroTextVariants}
              initial="hidden"
              animate="visible"
              className="text-lg sm:text-[21px] text-[#6B7280] leading-relaxed max-w-xl font-normal tracking-tight"
            >
              Diagnose appliance status, optimize warranties, monitor dynamic system health logs, and unlock automatic certified technician dispatch in one single dashboard.
            </motion.p>

            {/* CTA buttons */}
            <motion.div 
              variants={ctaVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-2"
            >
              <Link href="/auth/signup" className="w-full sm:w-auto">
                <button className="h-14 px-9 rounded-[20px] bg-black text-white hover:bg-black/95 font-semibold text-base transition-all shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto cursor-pointer">
                  Get Started Free
                </button>
              </Link>
              <button className="h-14 px-9 rounded-[20px] bg-white border border-[#ECECEC] text-[#111111] hover:bg-slate-50 font-semibold text-base transition-all shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 w-full sm:w-auto cursor-pointer">
                <Play className="h-4.5 w-4.5 fill-[#111111] text-[#111111] ml-0.5" />
                Watch Demo
              </button>
            </motion.div>

            {/* Micro Feature badges */}
            <motion.div 
              variants={ctaVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-2.5 pt-4"
            >
              {["Active Diagnostics", "Warranty Vault", "Automated Dispatch"].map((pill, idx) => (
                <span key={idx} className="text-xs font-semibold text-[#6B7280] px-4 py-2 rounded-full border border-[#ECECEC] bg-white shadow-xxs">
                  {pill}
                </span>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: Floating live CSS dashboard mockup inside macOS window */}
          <motion.div 
            variants={dashboardVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 relative flex justify-center items-center py-8"
          >
            {/* Glowing radial circles behind mockup */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-radial-gradient from-blue-500/10 to-transparent blur-3xl rounded-full pointer-events-none -z-10" />

            {/* MacOS Window Container */}
            <div className="w-full rounded-[32px] border border-[#ECECEC] bg-white p-3 shadow-[0_32px_80px_rgba(0,0,0,0.06)] overflow-hidden relative select-none">
              
              {/* macOS Window Controls */}
              <div className="h-12 px-6 flex items-center justify-between border-b border-[#ECECEC] bg-[#F8F9FB] rounded-t-[20px]">
                <div className="flex items-center gap-2">
                  <div className="h-3.5 w-3.5 rounded-full bg-red-400/80" />
                  <div className="h-3.5 w-3.5 rounded-full bg-yellow-400/80" />
                  <div className="h-3.5 w-3.5 rounded-full bg-green-400/80" />
                </div>
                <span className="text-xs font-semibold text-[#6B7280] tracking-tight">Dwellix Portal</span>
                <div className="w-12" />
              </div>

              {/* Dynamic Live CSS Dashboard Layout */}
              <div className="w-full bg-[#F8F9FB] rounded-b-[20px] overflow-hidden flex text-left font-sans text-xs select-none">
                
                {/* Mini Sidebar */}
                <div className="w-[180px] bg-white border-r border-[#ECECEC] p-4 flex flex-col justify-between hidden sm:flex shrink-0">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2.5 px-1 py-1">
                      <div className="h-7 w-7 rounded-lg bg-black text-white flex items-center justify-center font-bold text-[10px]">D</div>
                      <span className="font-extrabold text-[13px] tracking-tight text-[#111111]">Dwellix</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </div>
                      <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-[#6B7280] font-semibold hover:bg-slate-50 transition-colors">
                        <Cpu className="h-4 w-4" />
                        Appliances
                      </div>
                      <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-[#6B7280] font-semibold hover:bg-slate-50 transition-colors">
                        <Shield className="h-4 w-4" />
                        Warranties
                      </div>
                      <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-[#6B7280] font-semibold hover:bg-slate-50 transition-colors">
                        <Sparkles className="h-4 w-4" />
                        AI Agent
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-8 border-t border-[#ECECEC]">
                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-[#6B7280] font-semibold">
                      <User className="h-4 w-4" />
                      Profile
                    </div>
                  </div>
                </div>

                {/* Dashboard Viewport */}
                <div className="flex-1 p-5 space-y-5 bg-[#F8F9FB] min-h-[380px] overflow-hidden">
                  
                  {/* Viewport Header */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-[14px] text-[#111111]">Overview</h4>
                      <p className="text-[10px] text-[#6B7280] font-medium">Smart status is active</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-white border border-[#ECECEC] flex items-center justify-center text-[#6B7280]">
                        <Bell className="h-3.5 w-3.5" />
                      </div>
                      <div className="h-7 w-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] shadow-sm">
                        JD
                      </div>
                    </div>
                  </div>

                  {/* Summary grid */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { l: "Appliances", v: "14", c: "bg-white" },
                      { l: "Active Coverages", v: "11", c: "bg-white" },
                      { l: "Service Alerts", v: "0", c: "bg-white text-emerald-500" }
                    ].map((s, idx) => (
                      <div key={idx} className={`${s.c} border border-[#ECECEC] rounded-xl p-3.5 shadow-[0_4px_12px_rgba(0,0,0,0.01)]`}>
                        <div className="text-[9px] text-[#6B7280] font-bold uppercase tracking-wider">{s.l}</div>
                        <div className="text-lg font-black mt-1 text-[#111111]">{s.v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Grid details */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    
                    {/* Device Statuses */}
                    <div className="sm:col-span-7 bg-white border border-[#ECECEC] rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.01)] space-y-3 text-left">
                      <div className="font-bold text-[11px] text-[#111111] border-b border-[#F8F9FB] pb-1.5 flex justify-between items-center">
                        <span>Appliances</span>
                        <span className="text-[10px] text-blue-600 font-semibold cursor-pointer">View All</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          { name: "Samsung Refrigerator", status: "Healthy", score: "98%", border: "border-emerald-500 bg-emerald-50 text-emerald-600" },
                          { name: "Bosch Dishwasher", status: "Healthy", score: "95%", border: "border-emerald-500 bg-emerald-50 text-emerald-600" },
                          { name: "Carrier HVAC System", status: "Needs Service", score: "74%", border: "border-amber-500 bg-amber-50 text-amber-600" }
                        ].map((d, idx) => (
                          <div key={idx} className="flex items-center justify-between py-1 border-b border-[#F8F9FB] last:border-0">
                            <div>
                              <div className="font-bold text-[10px] text-[#111111]">{d.name}</div>
                              <div className="text-[9px] text-[#6B7280] mt-0.5">{d.status}</div>
                            </div>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${d.border}`}>{d.score}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Chat insight */}
                    <div className="sm:col-span-5 bg-white border border-[#ECECEC] rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-blue-600 font-bold text-[10px]">
                          <Sparkles className="h-3.5 w-3.5" />
                          AI Agent Recommendation
                        </div>
                        <p className="text-[9px] text-[#6B7280] leading-relaxed mt-1">
                          &quot;I detected a slight temperature shift in your freezer logs. Filter replacement is scheduled. Request technician dispatch?&quot;
                        </p>
                      </div>
                      <button className="w-full mt-3 h-7 bg-black text-white hover:bg-black/90 font-semibold rounded-lg text-[9px] transition-colors">
                        Confirm Dispatch
                      </button>
                    </div>

                  </div>
                </div>

              </div>

              {/* Floating Glass Widgets Around Mockup */}
              {/* Top-Left Widget */}
              <div className="absolute top-10 left-[-40px] bg-white/70 backdrop-blur-md rounded-[20px] border border-white/60 px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex items-center gap-3 scale-90 sm:scale-100 origin-left">
                <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-[#111111] tracking-tight">Active Diagnostics</div>
                  <div className="text-[10px] text-[#6B7280] font-semibold mt-0.5">Monitoring Active</div>
                </div>
              </div>

              {/* Bottom-Right Widget */}
              <div className="absolute bottom-12 right-[-30px] bg-[#0A0E1A]/95 backdrop-blur-md rounded-[20px] border border-slate-800 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.12)] text-white flex items-center gap-3.5 scale-90 sm:scale-100 origin-right">
                <div className="h-9 w-9 rounded-full border-2 border-emerald-500 flex items-center justify-center text-xs font-black text-emerald-400">
                  98%
                </div>
                <div className="text-left">
                  <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Baseline score</div>
                  <div className="text-xs font-extrabold text-emerald-400">System Healthy</div>
                </div>
              </div>

            </div>
          </motion.div>

        </div>

        {/* SECTION BELOW HERO: Four Premium Statistics Cards */}
        <div className="pt-24 border-t border-[#ECECEC] w-full text-left space-y-16">
          
          {/* Monochrome partner logos */}
          <div className="space-y-6">
            <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-[0.25em]">Trusted by verified modern homeowners</p>
            <div className="flex flex-wrap items-center justify-between gap-8 opacity-35 grayscale py-4">
              {trustedBrands.map((brand, idx) => (
                <span key={idx} className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tighter text-[#111111] hover:opacity-100 transition-opacity duration-300">
                  {brand}
                </span>
              ))}
            </div>
          </div>

          <motion.div 
            variants={cardContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-10"
          >
            {[
              { title: "Homes Protected", value: "12k+", icon: Shield, desc: "Actively monitoring properties around the clock." },
              { title: "System Health", value: "98.7%", icon: Cpu, desc: "Maintained baseline health metrics average." },
              { title: "AI Monitoring", value: "24/7", icon: Clock, desc: "Real-time fault checkups and diagnoses." },
              { title: "Partner Brands", value: "50+", icon: Sparkles, desc: "Hassle-free coverage and appliance integrations." }
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={idx}
                  variants={cardVariants}
                  whileHover={{ y: -8, boxShadow: "0 24px 48px rgba(0,0,0,0.08)" }}
                  className="rounded-[28px] border border-[#ECECEC] bg-white p-8 shadow-[0_12px_40px_rgba(0,0,0,.03)] transition-all duration-300 flex flex-col justify-between min-h-[240px]"
                >
                  <div className="space-y-6">
                    <div className="h-11 w-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Icon className="h-5.5 w-5.5" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">{card.title}</div>
                      <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111]">{card.value}</div>
                    </div>
                  </div>
                  <p className="text-[13px] text-[#6B7280] leading-relaxed mt-5 font-medium">{card.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </main>

      {/* Features Showcase Section */}
      <section id="features" className="py-32 bg-white border-y border-[#ECECEC] text-left">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="max-w-2xl space-y-4 mb-20">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full">
              Full Suite
            </span>
            <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#111111] leading-none">
              All coverages. Handled.
            </h2>
            <p className="text-lg sm:text-[20px] text-[#6B7280] font-normal leading-relaxed pt-2">
              Consolidate appliance invoices, track warranty expiration timelines, and get help immediately when error codes occur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Cpu, title: "Diagnostic AI Engine", desc: "Scan or upload faulty hardware statuses to verify immediate resolutions." },
              { icon: Shield, title: "Cloud Warranty Records", desc: "Safe keeping for insurance, receipt registries, and expiration alerts." },
              { icon: Wrench, title: "On-Demand Dispatches", desc: "Connect with certified local professionals for instant priority support." }
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="rounded-[28px] border border-[#ECECEC] bg-white p-8 shadow-[0_12px_40px_rgba(0,0,0,0.03)] space-y-6">
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-[#111111]">{feat.title}</h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-20 border-t border-[#ECECEC]">
        <div className="max-w-[1280px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-10 text-sm text-[#6B7280] font-medium">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white">
              <img src="/logo/dwellix-logo-light.png" alt="Dwellix" className="h-4.5 w-4.5 object-contain invert" />
            </div>
            <span className="font-heading font-extrabold text-base tracking-tighter text-[#111111]">Dwellix</span>
          </div>
          
          <div className="flex gap-10 text-[15px] font-semibold">
            <a href="#features" className="hover:text-[#111111] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#111111] transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-[#111111] transition-colors">Pricing</a>
            <a href="#resources" className="hover:text-[#111111] transition-colors">Resources</a>
          </div>

          <div className="text-xs">
            © 2026 Dwellix. Built according to premium design system specifications.
          </div>
        </div>
      </footer>

    </div>
  );
}
