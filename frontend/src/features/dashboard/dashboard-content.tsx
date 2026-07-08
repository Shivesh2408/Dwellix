"use client";

import React from "react";
import { motion } from "framer-motion";

import {
  Cpu,
  Wrench,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowRight,
  FileText,
  ShoppingBag,
  AlertTriangle,
  Clock,
  Bell
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DashboardSummaryResponse } from "./service";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { User } from "lucide-react";

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

  interface BookingItem {
    id: string;
    status: string;
    serviceType?: string;
    serviceName?: string;
    applianceName?: string;
    technicianName?: string;
    date?: string;
    bookingDate?: string;
    bookingTime?: string;
  }
  const [activeBookings, setActiveBookings] = React.useState<BookingItem[]>([]);

  React.useEffect(() => {
    apiClient<BookingItem[]>("/api/v1/bookings")
      .then((data) => {
        const active = data.filter((b) =>
          b.status && ["PENDING", "CONFIRMED", "IN_PROGRESS"].includes(b.status.toUpperCase())
        );
        setActiveBookings(active);
      })
      .catch((err) => console.error("Failed to load dashboard bookings widget:", err));
  }, []);



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



  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good Morning";
    if (hr < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const firstName = userName?.split(" ")[0] || "Shivesh";

  const [baseTime, setBaseTime] = React.useState(1783477995000);
  const [todayStr, setTodayStr] = React.useState("2026-07-08");

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setBaseTime(Date.now());
      setTodayStr(new Date().toISOString().split("T")[0]);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  interface TimelineEvent {
    type: string;
    title: string;
    description: string;
    date: string;
    color: string;
    badge: string;
  }

  // Dynamic combined event timeline
  const combinedEventsTimeline = React.useMemo(() => {
    const events: TimelineEvent[] = [];
    
    // Warranty alerts
    warrantyAlerts.forEach((w) => {
      if (w.status === "EXPIRING_SOON") {
        events.push({
          type: "WARRANTY",
          title: `Warranty Expiring: ${w.applianceName}`,
          description: `${w.brand} ${w.model} coverage expires in ${w.daysRemaining} days.`,
          date: new Date(baseTime + w.daysRemaining * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          color: "bg-amber-500",
          badge: "Warranty Expiring"
        });
      } else if (w.status === "EXPIRED") {
        events.push({
          type: "WARRANTY",
          title: `Warranty Expired: ${w.applianceName}`,
          description: `Coverage for ${w.brand} has expired.`,
          date: new Date(baseTime - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          color: "bg-rose-500",
          badge: "Warranty Expired"
        });
      }
    });

    // Bookings
    upcomingBookings.forEach((b) => {
      events.push({
        type: "BOOKING",
        title: `Technician Dispatch: ${b.serviceName}`,
        description: `Scheduled for ${b.applianceName} with technician ${b.technicianName || "Unassigned"}.`,
        date: b.date ? new Date(b.date).toISOString().split("T")[0] : todayStr,
        color: "bg-blue-600",
        badge: b.status
      });
    });

    // Maintenance
    upcomingMaintenance.forEach((m) => {
      events.push({
        type: "MAINTENANCE",
        title: `Maintenance: ${m.taskName}`,
        description: `Routine scheduled servicing for ${m.applianceName}.`,
        date: m.date ? new Date(m.date).toISOString().split("T")[0] : todayStr,
        color: m.status === "OVERDUE" ? "bg-rose-500" : "bg-purple-500",
        badge: m.status
      });
    });

    // Notifications
    notifications.forEach((n) => {
      events.push({
        type: "NOTIFICATION",
        title: n.title,
        description: n.message,
        date: todayStr,
        color: n.type === "WARNING" ? "bg-amber-500" : "bg-indigo-500",
        badge: "Alert"
      });
    });

    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);
  }, [warrantyAlerts, upcomingBookings, upcomingMaintenance, notifications, baseTime, todayStr]);

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
      {activeBookings.length > 0 && (
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Calendar className="h-4 w-4" />
            <span>Upcoming Service</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBookings.map((b) => (
              <Card key={b.id} className="rounded-3xl border border-indigo-100 bg-indigo-50/20 shadow-sm p-5 relative flex flex-col justify-between md:flex-row md:items-center gap-4 text-left">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 border rounded-full text-[9px] font-extrabold uppercase bg-amber-50 border-amber-100 text-amber-800">
                      {b.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{b.serviceType}</span>
                  </div>
                  <h4 className="font-heading font-extrabold text-slate-900 text-sm md:text-base">
                    {b.applianceName}
                  </h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      <span>Tech: {b.technicianName || "Unassigned"}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{b.bookingDate}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>{b.bookingTime}</span>
                    </span>
                  </div>
                </div>
                
                <Button
                  onClick={() => router.push(`/dashboard/bookings/${b.id}`)}
                  className="rounded-xl font-bold text-xs h-9 px-4 bg-primary text-white hover:bg-primary/95 cursor-pointer mt-2 md:mt-0 flex-shrink-0"
                >
                  View Booking
                </Button>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* HOME INTELLIGENCE CENTER SECTION */}
      <motion.div variants={itemVariants} className="space-y-6">
        {/* Top Greeting & Title */}
        <div className="text-left space-y-1.5">
          <h2 className="text-2xl md:text-3xl font-heading font-black tracking-tight text-slate-900">
            {getGreeting()}, {firstName} 👋
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium">Here is your home intelligence overview for today.</p>
        </div>

        {/* AI Summary Card */}
        <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl border border-slate-900 text-left space-y-4">
          <div className="absolute right-0 top-0 h-48 w-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span>AI Summary Overview</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <p className="text-sm md:text-lg font-medium text-slate-200 leading-relaxed font-heading">
              Your home contains <span className="text-white font-extrabold">{appliancesCount} appliances</span>.
              {" "}{upcomingMaintenance.length > 0 ? (
                <span><span className="text-amber-400 font-extrabold">{upcomingMaintenance.length} require maintenance</span>.</span>
              ) : (
                <span>All maintenance tasks are clear.</span>
              )}
              {" "}{warrantyAlerts.filter(a => a.status === "EXPIRING_SOON").length > 0 ? (
                <span>
                  <span className="text-rose-405 font-extrabold text-rose-400">
                    {warrantyAlerts.filter(a => a.status === "EXPIRING_SOON").length} warranty expires
                  </span>{" "}
                  in {warrantyAlerts.find(a => a.status === "EXPIRING_SOON")?.daysRemaining || 12} days.
                </span>
              ) : (
                <span>No active warranty issues.</span>
              )}
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-slate-800/80 mt-4">
              <div className="space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estimated Maintenance Cost This Month</div>
                <div className="text-2xl font-black text-white">₹{(upcomingMaintenance.length * 600 + upcomingBookings.length * 1500) || 1800}</div>
              </div>
              {aiRecommendations.length > 0 && (
                <div className="space-y-1 text-left sm:text-right">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI Priority Recommendation</div>
                  <div className="text-xs font-bold text-primary flex items-center gap-1.5 justify-start sm:justify-end">
                    <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                    <span>Service the {aiRecommendations[0].applianceName}.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4 Premium Insight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Home Health */}
          <Card className="rounded-[24px] border border-slate-200 bg-white shadow-sm p-6 flex flex-col items-center justify-center min-h-[190px] text-center">
            <div className="relative h-28 w-28 flex items-center justify-center flex-shrink-0">
              <svg className="transform -rotate-90 w-full h-full">
                <circle cx="56" cy="56" r="46" className="stroke-slate-100" strokeWidth="8" fill="transparent" />
                <motion.circle
                  cx="56"
                  cy="56"
                  r="46"
                  stroke={getHealthStrokeColor(healthScore)}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 46}
                  initial={{ strokeDashoffset: 2 * Math.PI * 46 }}
                  animate={{ strokeDashoffset: (2 * Math.PI * 46) - (healthScore / 100) * (2 * Math.PI * 46) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-heading font-black text-slate-900 leading-none">{healthScore}</span>
                <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider mt-1">Health Score</span>
              </div>
            </div>
            <span className="text-xs font-extrabold text-slate-800 mt-4 uppercase tracking-wider">Home Health</span>
          </Card>

          {/* Card 2: Warranty */}
          <Card className="rounded-[24px] border border-slate-200 bg-white shadow-sm p-6 flex flex-col justify-between min-h-[190px]">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Warranty coverage</span>
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="space-y-2 text-xs font-semibold text-slate-600">
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-500">Safe:</span>
                <span className="text-emerald-600 font-extrabold">{warrantyAlerts.filter(a => a.status === "SAFE").length}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-500">Expiring soon:</span>
                <span className="text-amber-500 font-extrabold">{warrantyAlerts.filter(a => a.status === "EXPIRING_SOON").length}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Expired:</span>
                <span className="text-rose-500 font-extrabold">{warrantyAlerts.filter(a => a.status === "EXPIRED").length}</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">Assets Warranty</span>
          </Card>

          {/* Card 3: Maintenance */}
          <Card className="rounded-[24px] border border-slate-200 bg-white shadow-sm p-6 flex flex-col justify-between min-h-[190px]">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Maintenance status</span>
              <Wrench className="h-5 w-5 text-indigo-500" />
            </div>
            <div className="space-y-2 text-xs font-semibold text-slate-600">
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-500">Completed:</span>
                <span className="text-emerald-600 font-extrabold">{recentActivity.filter(a => a.category === "MAINTENANCE").length || 1}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-500">Pending:</span>
                <span className="text-amber-500 font-extrabold">{upcomingMaintenance.filter(m => m.status === "PENDING").length}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Overdue:</span>
                <span className="text-rose-500 font-extrabold">{upcomingMaintenance.filter(m => m.status === "OVERDUE").length}</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">Schedules</span>
          </Card>

          {/* Card 4: Bookings */}
          <Card className="rounded-[24px] border border-slate-200 bg-white shadow-sm p-6 flex flex-col justify-between min-h-[190px]">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Booking operations</span>
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <div className="space-y-2 text-xs font-semibold text-slate-600">
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-500">Upcoming:</span>
                <span className="text-blue-600 font-extrabold">{upcomingBookings.length}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-500">Completed:</span>
                <span className="text-emerald-600 font-extrabold">{recentActivity.filter(a => a.category === "BOOKING").length || 1}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Cancelled:</span>
                <span className="text-slate-450 font-extrabold">0</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">Technicians dispatches</span>
          </Card>
        </div>
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
            <h3 className="font-heading font-bold text-xl tracking-tight text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Today&apos;s AI Recommendations</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {aiRecommendations.map((rec) => {
                // Determine recommendation details
                const isHigh = rec.urgency === "HIGH";
                const isMedium = rec.urgency === "MEDIUM";
                const getIcon = () => {
                  if (isHigh) return Wrench;
                  if (isMedium) return Clock;
                  return ShieldCheck;
                };
                const Icon = getIcon();
                
                const getCtaLabel = () => {
                  if (isHigh) return "Book Technician";
                  if (isMedium) return "Schedule Maintenance";
                  return "View Appliance";
                };

                const handleCtaClick = () => {
                  if (isHigh) {
                    router.push(`/dashboard/bookings/new?technician=${encodeURIComponent("Ramesh Kumar")}`);
                  } else if (isMedium) {
                    onBookClick?.();
                  } else {
                    router.push("/dashboard/appliances");
                  }
                };

                return (
                  <Card key={rec.id} className="rounded-2xl border border-border/70 bg-gradient-to-tr from-white to-slate-50/50 shadow-xs p-5 relative overflow-hidden group hover:border-primary/30 transition-all duration-300 flex flex-col justify-between text-left">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className={cn(
                          "px-2 py-0.5 text-[9px] font-extrabold rounded-full uppercase",
                          isHigh ? "bg-rose-50 text-rose-600 border-rose-100" : isMedium ? "bg-amber-55 text-amber-600 border-amber-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                        )}>
                          {rec.urgency} Priority
                        </Badge>
                        <Icon className={cn("h-4.5 w-4.5", isHigh ? "text-rose-500" : isMedium ? "text-amber-500" : "text-emerald-500")} />
                      </div>
                      
                      <div>
                        <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide mb-1 leading-none">
                          {rec.applianceName}
                        </h4>
                        <p className="text-xs font-bold text-slate-800 leading-snug">
                          {rec.recommendation}
                        </p>
                      </div>
                      
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                        {rec.recommendedAction}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 mt-4">
                      <Button
                        onClick={handleCtaClick}
                        className="w-full h-8.5 text-xs font-bold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-primary hover:text-white transition-all cursor-pointer"
                      >
                        {getCtaLabel()}
                      </Button>
                    </div>
                  </Card>
                );
              })}
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

          {/* SECTION 4: UPCOMING EVENTS TIMELINE */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="font-heading font-bold text-xl tracking-tight text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Upcoming Events Timeline</span>
            </h3>
            <Card className="rounded-2xl border border-border/70 bg-white shadow-xs p-6 text-left">
              <div className="relative border-l border-border pl-6 space-y-6">
                {combinedEventsTimeline.length > 0 ? (
                  combinedEventsTimeline.map((evt, idx) => {
                    const getIcon = (type: string) => {
                      switch (type) {
                        case "WARRANTY": return ShieldCheck;
                        case "BOOKING": return Calendar;
                        case "MAINTENANCE": return Wrench;
                        default: return Bell;
                      }
                    };
                    const Icon = getIcon(evt.type);
                    return (
                      <div key={idx} className="relative">
                        {/* Timeline Dot */}
                        <span className={cn(
                          "absolute -left-[35px] top-1 h-5 w-5 rounded-full border-2 border-white text-white flex items-center justify-center shadow-xs",
                          evt.color
                        )}>
                          <Icon className="h-2.5 w-2.5" />
                        </span>
                        <div className="space-y-1">
                          <div className="flex justify-between items-baseline gap-2 flex-wrap">
                            <h4 className="text-xs font-bold text-slate-800 leading-none">
                              {evt.title}
                            </h4>
                            <span className="text-[9px] text-slate-400 font-extrabold uppercase">{evt.date}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                            {evt.description}
                          </p>
                          <div className="pt-0.5">
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100 text-slate-500 font-extrabold uppercase">
                              {evt.badge}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-xs text-muted-foreground">
                    No active timeline events recorded.
                  </div>
                )}
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
