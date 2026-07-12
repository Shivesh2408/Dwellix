"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Wrench, Sparkles, ArrowRight, Shield, Calendar, Cpu, Bell
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DashboardSummaryResponse } from "./service";
import Link from "next/link";

export function DashboardHero({ userName }: { userName: string }) {
  const firstName = userName?.split(" ")[0] || "Alex";
  return (
    <div className="text-left space-y-1 mb-8">
      <h2 className="text-3xl font-heading font-extrabold tracking-tight text-foreground">
        Good morning, {firstName} 👋
      </h2>
      <p className="text-sm text-muted-foreground font-medium">Here&apos;s what&apos;s happening with your home today.</p>
    </div>
  );
}

export function DashboardStats({ 
  appliancesCount, 
  activeWarranties, 
  expiringWarranties, 
  totalValue,
  healthScore
}: {
  appliancesCount: number;
  activeWarranties: number;
  expiringWarranties: number;
  totalValue: number;
  healthScore: number;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 text-left">
      {/* Stat 1: Total Appliances */}
      <Card className="rounded-[24px] border border-border bg-card p-5 shadow-sm flex flex-col justify-between min-h-[130px]">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Total Appliances</span>
        <div className="mt-2 space-y-0.5">
          <div className="text-3.5xl font-heading font-extrabold text-foreground">{appliancesCount ?? 0}</div>
          <p className="text-[10px] text-muted-foreground font-bold">Registered</p>
        </div>
      </Card>

      {/* Stat 2: Active Warranties */}
      <Card className="rounded-[24px] border border-border bg-card p-5 shadow-sm flex flex-col justify-between min-h-[130px]">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Active Warranties</span>
        <div className="mt-2 space-y-0.5">
          <div className="text-3.5xl font-heading font-extrabold text-foreground">{activeWarranties ?? 0}</div>
          <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Valid & Active
          </p>
        </div>
      </Card>

      {/* Stat 3: Expiring Soon */}
      <Card className="rounded-[24px] border border-border bg-card p-5 shadow-sm flex flex-col justify-between min-h-[130px]">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Expiring Soon</span>
        <div className="mt-2 space-y-0.5">
          <div className="text-3.5xl font-heading font-extrabold text-foreground">{expiringWarranties ?? 0}</div>
          <p className="text-[10px] text-red-500 font-bold flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Within 30 days
          </p>
        </div>
      </Card>

      {/* Stat 4: Total Value */}
      <Card className="rounded-[24px] border border-border bg-card p-5 shadow-sm flex flex-col justify-between min-h-[130px]">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Total Value</span>
        <div className="mt-2 space-y-0.5">
          <div className="text-3.5xl font-heading font-extrabold text-foreground">
            ₹{new Intl.NumberFormat("en-IN").format(totalValue ?? 0)}
          </div>
          <p className="text-[10px] text-muted-foreground font-bold">Covered Value</p>
        </div>
      </Card>

      {/* Stat 5: Home Health Score (Dark Card) */}
      <Card className="rounded-[24px] bg-[#2B2421] border border-[#3F332E]/30 p-5 shadow-lg flex flex-col justify-between min-h-[130px] text-white">
        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Home Health Score</span>
        <div className="flex items-center justify-between gap-2 mt-2">
          <div className="flex items-center gap-2.5">
            <div className="relative h-11 w-11 flex items-center justify-center flex-shrink-0">
              <svg className="transform -rotate-90 w-full h-full">
                <circle cx="22" cy="22" r="18" className="stroke-slate-800" strokeWidth="3" fill="transparent" />
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  stroke="#10B981"
                  strokeWidth="3.5"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 18}
                  strokeDashoffset={(2 * Math.PI * 18) - ((healthScore ?? 0) / 100) * (2 * Math.PI * 18)}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-[10px] font-bold text-white">{healthScore ?? 0}%</span>
            </div>
            <div className="text-left">
              <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider block">
                {(healthScore ?? 0) >= 90 ? "Excellent" : (healthScore ?? 0) >= 75 ? "Good" : "Needs Review"}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function ApplianceHealthCard({ score }: { score: number }) {
  return (
    <Card className="rounded-[24px] border border-border bg-card p-6 shadow-sm text-left flex flex-col justify-between min-h-[290px]">
      <h3 className="text-xs font-bold text-foreground uppercase tracking-wider block">Appliance Health Overview</h3>
      <div className="flex items-center justify-between gap-6 py-4 flex-grow">
        {/* Circular progress bar */}
        <div className="relative h-28 w-28 flex items-center justify-center flex-shrink-0">
          <svg className="transform -rotate-90 w-full h-full">
            <circle cx="56" cy="56" r="46" className="stroke-secondary" strokeWidth="8" fill="transparent" />
            <circle
              cx="56"
              cy="56"
              r="46"
              stroke="#10B981"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 46}
              strokeDashoffset={(2 * Math.PI * 46) - (score / 100) * (2 * Math.PI * 46)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-heading font-extrabold text-foreground leading-none">{score}%</span>
            <span className="text-[9px] font-bold uppercase text-emerald-500 tracking-wider mt-1.5">Excellent</span>
          </div>
        </div>

        {/* Legend matching mockup values */}
        <div className="space-y-2.5 text-xs font-semibold text-muted-foreground flex-grow">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Excellent</span>
            <span className="text-foreground font-extrabold">{score >= 90 ? 1 : 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary/60" /> Good</span>
            <span className="text-foreground font-extrabold">{score >= 75 && score < 90 ? 1 : 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-500" /> Fair</span>
            <span className="text-foreground font-extrabold">{score >= 50 && score < 75 ? 1 : 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-rose-500" /> Attention</span>
            <span className="text-foreground font-extrabold">{score < 50 ? 1 : 0}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function formatIndianDate(dateString: string | Date): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";
  const day = d.getDate();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

interface MaintenanceItem {
  applianceName: string;
  taskName: string;
  date?: string;
}

export function UpcomingMaintenanceCard({ maintenanceItems }: { maintenanceItems: MaintenanceItem[] }) {
  return (
    <Card className="rounded-[24px] border border-border bg-card p-6 shadow-sm text-left flex flex-col justify-between min-h-[290px]">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider block">Upcoming Maintenance</h3>
        <Link href="/dashboard/maintenance" className="text-xs text-primary font-bold hover:underline">View all</Link>
      </div>
      <div className="space-y-4 py-2 mt-4 flex-grow flex flex-col justify-center">
        {maintenanceItems.length > 0 ? (
          maintenanceItems.slice(0, 3).map((item, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-8.5 w-8.5 rounded-xl bg-primary-soft flex items-center justify-center text-primary flex-shrink-0">
                  <Wrench className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground leading-tight">{item.applianceName}</h4>
                  <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{item.taskName}</p>
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground font-bold">{item.date ? formatIndianDate(item.date) : ""}</span>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground font-medium text-center">No pending maintenance.</p>
        )}
      </div>
    </Card>
  );
}

export function AIInsightCard() {
  return (
    <Card className="rounded-[24px] border border-border bg-card p-6 shadow-sm text-left flex flex-col justify-between min-h-[290px] relative overflow-hidden">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider block">AI Insight</h3>
        <Badge className="bg-primary-soft text-primary border-none rounded-full text-[8px] font-bold uppercase">New</Badge>
      </div>
      <div className="flex items-center justify-between gap-4 py-2 mt-4 flex-grow">
        <div className="space-y-3.5 max-w-[200px]">
          <h4 className="text-xs font-bold text-foreground leading-snug">
            Your Samsung Air Conditioner is performing better than usual this week.
          </h4>
          <p className="text-[10px] text-muted-foreground font-medium">
            Energy consumption reduced by 12% compared to last week.
          </p>
          <Link href="/dashboard/ai-assistant" className="text-xs text-primary font-extrabold hover:underline flex items-center gap-1 pt-1.5">
            View Full Insights <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="h-20 w-20 rounded-2xl bg-primary-soft flex items-center justify-center text-primary shadow-xxs flex-shrink-0 self-center">
          <Sparkles className="h-8 w-8 animate-pulse" />
        </div>
      </div>
    </Card>
  );
}

interface DashboardContentProps {
  data: DashboardSummaryResponse;
  onDiagnoseClick?: () => void;
  onBookClick?: () => void;
  onUploadInvoiceClick?: () => void;
  onAddApplianceClick?: () => void;
  onViewMarketplaceClick?: () => void;
}

export function DashboardContent({
  data,
  onDiagnoseClick,
  onBookClick,
  onUploadInvoiceClick,
  onAddApplianceClick,
  onViewMarketplaceClick
}: DashboardContentProps) {
  const router = useRouter();

  const {
    userName,
    appliancesCount,
    healthScore,
    upcomingBookings,
    upcomingMaintenance,
    recentActivity,
    aiRecommendations,
    warrantyAlerts,
    recentAppliances,
    notifications
  } = data;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } as unknown as import("framer-motion").Transition }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-16"
    >
      {/* 1. Dashboard Hero Greeting Block */}
      <motion.div variants={itemVariants}>
        <DashboardHero userName={userName} />
      </motion.div>

      {/* 2. Key Statistics Row matching 5-column layout */}
      <motion.div variants={itemVariants}>
        <DashboardStats 
          appliancesCount={appliancesCount}
          activeWarranties={warrantyAlerts.filter(a => a.status === "SAFE").length}
          expiringWarranties={warrantyAlerts.filter(a => a.status === "EXPIRING_SOON").length}
          totalValue={18940}
          healthScore={healthScore}
        />
      </motion.div>

      {/* 3. Recreated Mockup Dashboard Main Cards Row (Appliance Health, Upcoming Maintenance, AI Insight) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants}>
          <ApplianceHealthCard score={healthScore} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <UpcomingMaintenanceCard maintenanceItems={upcomingMaintenance} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <AIInsightCard />
        </motion.div>
      </div>

      {/* 4. Quick Actions Panel */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h3 className="font-heading font-bold text-xl tracking-tight text-foreground text-left">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { title: "Diagnose Appliance", action: onDiagnoseClick, bg: "bg-primary text-white hover:bg-primary-hover shadow-sm border border-transparent" },
            { title: "Book Technician", action: onBookClick, bg: "bg-card text-foreground border border-border hover:bg-secondary shadow-sm" },
            { title: "Upload Invoice", action: onUploadInvoiceClick, bg: "bg-card text-foreground border border-border hover:bg-secondary shadow-sm" },
            { title: "Add Appliance", action: onAddApplianceClick, bg: "bg-card text-foreground border border-border hover:bg-secondary shadow-sm" },
            { title: "View Marketplace", action: onViewMarketplaceClick, bg: "bg-card text-foreground border border-border hover:bg-secondary shadow-sm" }
          ].map((act, idx) => (
            <motion.button
              key={idx}
              whileHover={{ y: -2 }}
              onClick={act.action}
              className={cn(
                "p-4 rounded-[20px] flex flex-col justify-between items-start text-left cursor-pointer transition-all duration-200 shadow-sm h-[100px]",
                act.bg
              )}
            >
              <span className="text-xs font-bold leading-tight">{act.title}</span>
              <ArrowRight className="h-4 w-4 opacity-75 self-end" />
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
