"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Cpu,
  Wrench,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
  ShoppingBag,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Bookmark,
  Bell
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DashboardSummaryResponse } from "./service";

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
  const {
    home,
    roomsCount,
    appliancesCount,
    healthScore,
    healthRecommendation,
    upcomingBookings,
    upcomingMaintenance,
    recentActivity,
    aiRecommendations,
    warrantyAlerts,
    recentAppliances,
    notifications
  } = data;

  // Calculate pending warranties (expired + expiring soon)
  const pendingWarrantiesCount = warrantyAlerts.filter(a => a.status === "EXPIRED" || a.status === "EXPIRING_SOON").length;

  // Circular progress parameters for health score
  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (healthScore / 100) * circumference;

  // Color coding for health score
  const getHealthColorClass = (score: number) => {
    if (score >= 90) return "text-success border-success/20 bg-success/5";
    if (score >= 75) return "text-warning border-warning/20 bg-warning/5";
    return "text-destructive border-destructive/20 bg-destructive/5";
  };

  const getHealthStrokeColor = (score: number) => {
    if (score >= 90) return "#10B981"; // Success
    if (score >= 75) return "#F59E0B"; // Warning
    return "#EF4444"; // Error/Destructive
  };

  // Section animation settings
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
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-10 pb-16"
    >
      {/* SECTION 1: HOME HEALTH OVERVIEW */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {/* Card 1: Health Score */}
        <Card className="rounded-[18px] border-border/70 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] bg-white/70 backdrop-blur-xs relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <span className="text-sm font-semibold text-muted-foreground">Health Score</span>
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Heart className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-heading font-extrabold tracking-tight text-foreground">{healthScore}</span>
              <span className="text-xs text-muted-foreground font-semibold">/100</span>
            </div>
            <p className="text-xs font-semibold text-muted-foreground mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-success" />
              <span>Calculated dynamically</span>
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Active Appliances */}
        <Card className="rounded-[18px] border-border/70 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] bg-white/70 backdrop-blur-xs relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <span className="text-sm font-semibold text-muted-foreground">Appliances</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                <Cpu className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-heading font-extrabold tracking-tight text-foreground">{appliancesCount}</span>
              <span className="text-xs text-muted-foreground font-semibold">Active</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              In {roomsCount} mapped rooms
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Upcoming Maintenance */}
        <Card className="rounded-[18px] border-border/70 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] bg-white/70 backdrop-blur-xs relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <span className="text-sm font-semibold text-muted-foreground">Maintenance</span>
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                <Wrench className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-heading font-extrabold tracking-tight text-foreground">{upcomingMaintenance.length}</span>
              <span className="text-xs text-muted-foreground font-semibold">Pending</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              Next 30 days
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Pending Warranties */}
        <Card className="rounded-[18px] border-border/70 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] bg-white/70 backdrop-blur-xs relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <span className="text-sm font-semibold text-muted-foreground">Warranties</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-heading font-extrabold tracking-tight text-foreground">{pendingWarrantiesCount}</span>
              <span className="text-xs text-muted-foreground font-semibold">Attention</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              Expired or expiring soon
            </p>
          </CardContent>
        </Card>

        {/* Card 5: Open Bookings */}
        <Card className="rounded-[18px] border-border/70 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] bg-white/70 backdrop-blur-xs relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <span className="text-sm font-semibold text-muted-foreground">Bookings</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                <Calendar className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-heading font-extrabold tracking-tight text-foreground">{upcomingBookings.length}</span>
              <span className="text-xs text-muted-foreground font-semibold">Active</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              Scheduled bookings
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* SECTION 2: HEALTH SCORE & AI SUMMARY RECOMMENDATION */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-2xl border border-border/70 bg-white shadow-sm overflow-hidden p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
          {/* Circular Chart */}
          <div className="relative h-40 w-40 flex items-center justify-center flex-shrink-0">
            <svg className="transform -rotate-90 w-full h-full">
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-muted/20"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <motion.circle
                cx="80"
                cy="80"
                r={radius}
                stroke={getHealthStrokeColor(healthScore)}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-heading font-black text-foreground tracking-tight">{healthScore}</span>
              <span className="text-xxs uppercase tracking-wider text-muted-foreground font-bold">Health Score</span>
            </div>
          </div>

          {/* AI Recommendation Summary */}
          <div className="flex-grow space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Dwellix AI Assistant</span>
            </div>
            <h3 className="font-heading font-bold text-xl md:text-2xl tracking-tight text-foreground">
              Overall Home Status
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {healthRecommendation}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
              <Badge variant="outline" className={cn("px-2.5 py-1 text-xs font-semibold rounded-full border", getHealthColorClass(healthScore))}>
                Status: {healthScore >= 90 ? "Excellent" : healthScore >= 75 ? "Needs Care" : "Critical"}
              </Badge>
              <Badge variant="outline" className="px-2.5 py-1 text-xs font-semibold rounded-full border border-border">
                {appliancesCount} Mapped Assets
              </Badge>
            </div>
          </div>
        </Card>

        {/* QUICK NOTIFICATIONS (Within section 2 area) */}
        <Card className="rounded-2xl border border-border/70 bg-white shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center pb-4 border-b border-border mb-4">
            <h3 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
              <Bell className="h-4.5 w-4.5 text-primary" />
              <span>System Alerts</span>
            </h3>
            <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">Clear</span>
          </div>
          <div className="flex-grow space-y-4 overflow-y-auto max-h-52 pr-1">
            {notifications.map((notif) => (
              <div key={notif.id} className="flex gap-3 items-start text-sm">
                <div className={cn(
                  "p-1.5 rounded-lg flex-shrink-0 mt-0.5",
                  notif.type === "WARNING" ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary"
                )}>
                  {notif.type === "WARNING" ? <AlertTriangle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-foreground text-xs leading-none">{notif.title}</div>
                  <div className="text-xxs text-muted-foreground leading-tight">{notif.message}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* SECTION 5: QUICK ACTIONS (Presented centrally for accessibility) */}
      <motion.div variants={itemVariants} className="space-y-5">
        <h3 className="font-heading font-bold text-2xl tracking-tight text-foreground">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {[
            { title: "Diagnose Appliance", desc: "Run AI checks on fault codes", action: onDiagnoseClick, icon: Sparkles, color: "bg-primary text-white hover:bg-primary/95" },
            { title: "Book Technician", desc: "Schedule certified assistance", action: onBookClick, icon: Calendar, color: "bg-white text-foreground hover:bg-secondary-background" },
            { title: "Upload Invoice", desc: "Register invoice and warranty docs", action: onUploadInvoiceClick, icon: FileText, color: "bg-white text-foreground hover:bg-secondary-background" },
            { title: "Add Appliance", desc: "Add assets to rooms manually", action: onAddApplianceClick, icon: Cpu, color: "bg-white text-foreground hover:bg-secondary-background" },
            { title: "View Marketplace", desc: "Find replacement services & deals", action: onViewMarketplaceClick, icon: ShoppingBag, color: "bg-white text-foreground hover:bg-secondary-background" }
          ].map((act, idx) => {
            const Icon = act.icon;
            const isPrimary = act.color.includes("bg-primary");
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={act.action}
                className={cn(
                  "rounded-2xl border p-5 flex flex-col justify-between cursor-pointer transition-all duration-300 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.04)]",
                  isPrimary
                    ? "border-primary bg-primary text-white hover:shadow-lg hover:shadow-primary/20"
                    : "border-border/70 bg-white hover:border-primary/20 hover:shadow-md hover:shadow-muted/50"
                )}
              >
                <div className="space-y-3">
                  <div className={cn("p-2.5 rounded-xl inline-block", isPrimary ? "bg-white/10 text-white" : "bg-primary/5 text-primary")}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-tight tracking-tight">{act.title}</h4>
                    <p className={cn("text-xxs mt-1 leading-normal font-medium", isPrimary ? "text-white/80" : "text-muted-foreground")}>{act.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xxs font-bold uppercase tracking-wider mt-5">
                  <span>Open</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* TWO COLUMN GRID FOR TABLES & TIMELINES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT & CENTER COLUMN: TABLES & ALERTS */}
        <div className="lg:col-span-2 space-y-10">
          {/* SECTION 3: UPCOMING MAINTENANCE */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-heading font-bold text-xl tracking-tight text-foreground">
                Upcoming Maintenance
              </h3>
              <Button variant="ghost" size="sm" className="text-primary font-semibold text-xs gap-1">
                <span>View Schedule</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
            <Card className="rounded-2xl border border-border/70 bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-secondary-background/60 border-b border-border/60">
                      <th className="p-4.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Date</th>
                      <th className="p-4.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Appliance</th>
                      <th className="p-4.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Task</th>
                      <th className="p-4.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="p-4.5 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {upcomingMaintenance.length > 0 ? (
                      upcomingMaintenance.map((task) => (
                        <tr key={task.id} className="hover:bg-secondary-background/35 transition-colors">
                          <td className="p-4.5 text-xs font-semibold text-foreground">
                            {new Date(task.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </td>
                          <td className="p-4.5 text-xs font-semibold text-foreground">{task.applianceName}</td>
                          <td className="p-4.5 text-xs text-muted-foreground font-medium">{task.taskName}</td>
                          <td className="p-4.5">
                            <Badge className={cn(
                              "px-2.5 py-0.5 rounded-full text-xxs font-semibold",
                              task.status === "OVERDUE"
                                ? "bg-destructive/10 text-destructive border border-destructive/10"
                                : "bg-warning/10 text-warning border border-warning/10"
                            )}>
                              {task.status}
                            </Badge>
                          </td>
                          <td className="p-4.5 text-right">
                            <button className="text-xs text-primary font-bold hover:underline cursor-pointer">
                              {task.actionLabel}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-xs text-muted-foreground">
                          No upcoming maintenance tasks. Add appliances to map maintenance.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>

          {/* SECTION 6: AI RECOMMENDATIONS */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="font-heading font-bold text-xl tracking-tight text-foreground">
              AI Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {aiRecommendations.map((rec) => (
                <Card key={rec.id} className="rounded-2xl border border-border/70 bg-gradient-to-tr from-white to-secondary-background shadow-xs p-5 relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
                  <div className="absolute top-0 right-0 h-24 w-24 bg-primary/5 rounded-bl-full flex items-center justify-end p-4 text-primary opacity-40 group-hover:scale-110 transition-transform">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div className="space-y-3">
                    <Badge variant="outline" className={cn(
                      "px-2 py-0.5 text-xxs font-bold rounded-full",
                      rec.urgency === "HIGH" ? "bg-destructive/5 text-destructive border-destructive/20" : rec.urgency === "MEDIUM" ? "bg-warning/5 text-warning border-warning/20" : "bg-success/5 text-success border-success/20"
                    )}>
                      {rec.urgency} Priority
                    </Badge>
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide leading-none mb-1">{rec.applianceName}</h4>
                      <p className="text-sm font-bold text-foreground leading-snug">{rec.recommendation}</p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{rec.recommendedAction}</p>
                    <div className="pt-2">
                      <Button variant="outline" size="sm" className="h-9 text-xs rounded-xl border border-border/80 hover:bg-primary hover:text-white transition-all">
                        Schedule Maintenance
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* SECTION 7: WARRANTY ALERTS */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="font-heading font-bold text-xl tracking-tight text-foreground">
              Warranty Alerts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Expiring Soon */}
              <Card className="rounded-2xl border border-warning/30 bg-warning/5 p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-warning uppercase tracking-wider">Expiring Soon</span>
                  <Clock className="h-4.5 w-4.5 text-warning" />
                </div>
                <div className="text-2xl font-heading font-black text-warning">
                  {warrantyAlerts.filter(a => a.status === "EXPIRING_SOON").length}
                </div>
                <div className="text-xxs text-muted-foreground leading-normal font-medium">
                  Warranties expiring within 30 days. Needs immediate renewal or extension.
                </div>
              </Card>

              {/* Expired */}
              <Card className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-destructive uppercase tracking-wider">Expired</span>
                  <AlertTriangle className="h-4.5 w-4.5 text-destructive" />
                </div>
                <div className="text-2xl font-heading font-black text-destructive">
                  {warrantyAlerts.filter(a => a.status === "EXPIRED").length}
                </div>
                <div className="text-xxs text-muted-foreground leading-normal font-medium">
                  Appliances out of warranty coverage. Unprotected from repair costs.
                </div>
              </Card>

              {/* Safe */}
              <Card className="rounded-2xl border border-success/30 bg-success/5 p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-success uppercase tracking-wider">Safe</span>
                  <ShieldCheck className="h-4.5 w-4.5 text-success" />
                </div>
                <div className="text-2xl font-heading font-black text-success">
                  {warrantyAlerts.filter(a => a.status === "SAFE").length}
                </div>
                <div className="text-xxs text-muted-foreground leading-normal font-medium">
                  Active warranties with 30+ days remaining coverage.
                </div>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: RECENT ACTIVITY & UPCOMING BOOKINGS */}
        <div className="space-y-10">
          {/* UPCOMING BOOKINGS DETAIL */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="font-heading font-bold text-xl tracking-tight text-foreground">
              Upcoming Bookings
            </h3>
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => (
                <Card key={booking.id} className="rounded-2xl border border-border/70 bg-white shadow-xs p-5 space-y-4 hover:border-primary/20 transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{booking.serviceName}</h4>
                      <p className="text-xxs text-muted-foreground font-semibold mt-0.5">{booking.applianceName}</p>
                    </div>
                    <Badge className="bg-primary/10 text-primary border border-primary/10 rounded-full text-xxs font-semibold">
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xxs font-medium uppercase tracking-wider">Technician</span>
                      <span className="font-bold text-foreground mt-0.5">{booking.technicianName}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-muted-foreground text-xxs font-medium uppercase tracking-wider">Scheduled Date</span>
                      <span className="font-bold text-foreground mt-0.5">
                        {new Date(booking.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="rounded-2xl border border-border/70 bg-white p-5 text-center text-xs text-muted-foreground">
                No active bookings. Use Quick Actions to book.
              </Card>
            )}
          </motion.div>

          {/* SECTION 4: RECENT ACTIVITY TIMELINE */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="font-heading font-bold text-xl tracking-tight text-foreground">
              Recent Activity
            </h3>
            <Card className="rounded-2xl border border-border/70 bg-white shadow-xs p-6">
              <div className="relative border-l border-border pl-6 space-y-6">
                {recentActivity.map((activity) => {
                  const getCategoryIcon = (category: string) => {
                    switch (category) {
                      case "WARRANTY": return ShieldCheck;
                      case "BOOKING": return Calendar;
                      case "AI": return Sparkles;
                      case "INVOICE": return FileText;
                      case "MAINTENANCE": return Wrench;
                      default: return Bookmark;
                    }
                  };
                  const Icon = getCategoryIcon(activity.category);
                  return (
                    <div key={activity.id} className="relative">
                      {/* Timeline Dot */}
                      <span className="absolute -left-[35px] top-1 h-4.5 w-4.5 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center shadow-xs">
                        <Icon className="h-2 w-2" />
                      </span>
                      <div className="space-y-1">
                        <div className="flex justify-between items-baseline gap-2">
                          <h4 className="text-xs font-bold text-foreground leading-none">{activity.title}</h4>
                          <span className="text-[10px] text-muted-foreground font-semibold">
                            {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xxs text-muted-foreground leading-normal font-medium">{activity.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* SECTION 8: RECENT APPLIANCES */}
      <motion.div variants={itemVariants} className="space-y-5">
        <div className="flex justify-between items-center">
          <h3 className="font-heading font-bold text-xl tracking-tight text-foreground">
            Registered Appliances
          </h3>
          <Button variant="ghost" size="sm" className="text-primary font-semibold text-xs gap-1">
            <span>View All Assets</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recentAppliances.map((app) => {
            const todayDate = new Date();
            const expDate = new Date(app.warrantyExpiry);
            const isExpired = expDate < todayDate;
            return (
              <Card key={app.id} className="rounded-2xl border border-border/70 bg-white overflow-hidden shadow-xs hover:shadow-md hover:border-primary/20 transition-all duration-300 flex flex-col">
                <div className="h-36 bg-secondary-background flex items-center justify-center p-6 text-muted-foreground/60 border-b border-border/40">
                  <Cpu className="h-10 w-10 text-muted-foreground/45 group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-5 flex-grow flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{app.brand}</span>
                    <h4 className="font-bold text-sm text-foreground mt-0.5 leading-tight">{app.name}</h4>
                    <p className="text-xxs text-muted-foreground font-medium mt-1">Model: {app.model}</p>
                  </div>
                  <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xxs">
                    <span className="text-muted-foreground font-medium">Warranty</span>
                    <Badge className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                      isExpired ? "bg-destructive/10 text-destructive border border-destructive/10" : "bg-success/10 text-success border border-success/10"
                    )}>
                      {isExpired ? "Expired" : "Active"}
                    </Badge>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
