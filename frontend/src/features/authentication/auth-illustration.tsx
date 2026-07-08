"use client";

import React from "react";
import {
  Sparkles,
  ShieldCheck,
  Calendar,
  Wrench,
  FileText,
  ShoppingBag,
  Cpu,
  CheckCircle,
  Activity,
  ArrowUpRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function AuthIllustration() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-8 flex flex-col justify-between shadow-[0_40px_120px_-30px_rgba(15,23,42,0.85)] select-none">
      
      {/* Dynamic blurred radial glow layers */}
      <div className="absolute -left-12 -top-12 h-72 w-72 rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
      <div className="absolute -right-16 -bottom-16 h-80 w-80 rounded-full bg-indigo-500/20 blur-[110px] pointer-events-none" />
      <div className="absolute left-1/3 top-1/4 h-60 w-60 rounded-full bg-cyan-500/10 blur-[90px] pointer-events-none" />

      {/* Grid Pattern overlay for depth */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header branding */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl overflow-hidden shadow-lg shadow-primary/10">
            <img
              src="/logo/dwellix-logo-light.png"
              alt="Dwellix Logo"
              className="h-9 w-9 object-contain"
            />
          </div>
          <span className="font-heading font-extrabold text-white text-lg tracking-tight">Dwellix OS</span>
        </div>
        <Badge variant="outline" className="border-white/10 bg-white/5 text-slate-300 font-extrabold text-[10px] uppercase tracking-wider px-3 py-1">
          Active Monitoring
        </Badge>
      </div>

      {/* Central Visual Showcase: Mock Smart Home Panel */}
      <div className="relative z-10 my-auto py-8">
        <div className="relative mx-auto max-w-sm rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-[9px] font-bold shadow-md">
            AI
          </div>
          
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <div className="space-y-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Status
              </div>
              <div className="text-sm font-extrabold text-white">Smart Home Dashboard</div>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg">
              92% Health
            </Badge>
          </div>

          <div className="space-y-3.5 pt-4">
            <div className="flex items-center justify-between p-3 border border-white/5 rounded-xl bg-white/5">
              <div className="flex items-center gap-2.5 text-xs text-white">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-semibold block">Warranty Vault</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">2 Items Expiring</span>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-500" />
            </div>

            <div className="flex items-center justify-between p-3 border border-white/5 rounded-xl bg-white/5">
              <div className="flex items-center gap-2.5 text-xs text-white">
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-semibold block">Technician Booking</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">Confirmed for AC Service</span>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="space-y-4 z-10 pt-4">
        <div className="text-[10px] text-primary font-extrabold uppercase tracking-[0.2em] mb-2">Platform Capabilities</div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { title: "AI Assistant", desc: "Diagnostic intelligence.", icon: Sparkles, color: "text-amber-400" },
            { title: "Warranty Tracking", desc: "Secure digital registry.", icon: ShieldCheck, color: "text-emerald-400" },
            { title: "Technician Booking", desc: "Certified dispatchers.", icon: Calendar, color: "text-blue-400" },
            { title: "Marketplace", desc: "Direct local professionals.", icon: ShoppingBag, color: "text-purple-400" },
            { title: "Proactive Reminders", desc: "Smart upkeep alerts.", icon: Wrench, color: "text-indigo-400" },
            { title: "Secure Cloud Storage", desc: "Encrypted invoice vault.", icon: FileText, color: "text-cyan-400" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex gap-3 items-start p-1.5 rounded-xl transition-colors hover:bg-white/5">
                <div className={cn("p-2 rounded-xl bg-white/5 flex-shrink-0 mt-0.5 border border-white/5 shadow-sm", item.color)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide">{item.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal font-medium">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer copyright and security indicators */}
      <div className="pt-6 border-t border-white/5 text-[10px] text-slate-500 font-semibold z-10 flex justify-between items-center">
        <span>© 2026 Dwellix. All rights reserved.</span>
        <span>Secure Session Strategy v2</span>
      </div>
    </div>
  );
}
