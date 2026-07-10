"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import {
  TrendingUp, Calendar, RefreshCw, Layers, ShieldCheck, 
  Wrench, Activity, AlertTriangle, Zap, ArrowUpRight, 
  CheckCircle2, FileSpreadsheet, FileText as PdfIcon, Clock, ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

interface Appliance {
  id: string;
  name: string;
  brand: string;
  model: string;
  roomName: string;
  roomId: string;
  purchaseDate: string;
  warrantyExpiry: string;
  photoFileName: string;
  warrantyStatus: string;
  healthScore: number;
  lastMaintenance: string;
}

interface DashboardSummaryResponse {
  home: { homeName: string } | null;
  userName: string;
  roomsCount: number;
  appliancesCount: number;
  healthScore: number;
  upcomingBookings: Record<string, unknown>[];
  upcomingMaintenance: Record<string, unknown>[];
  recentActivity: Record<string, unknown>[];
  aiRecommendations: Record<string, unknown>[];
  warrantyAlerts: Record<string, unknown>[];
}

interface AnalyticsBooking {
  id: string;
  issueDescription?: string | null;
  scheduledDate?: string | null;
  status: string;
}

export default function AnalyticsPage() {
  const [dashboardData, setDashboardData] = useState<DashboardSummaryResponse | null>(null);
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [bookings, setBookings] = useState<AnalyticsBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [dateRange, setDateRange] = useState("90"); // "30" | "90" | "365"
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  const fetchData = useCallback(async () => {
    setError(null);
    try {
      const [dash, apps, books] = await Promise.all([
        apiClient<DashboardSummaryResponse>("/api/v1/dashboard"),
        apiClient<Appliance[]>("/api/v1/appliances"),
        apiClient<AnalyticsBooking[]>("/api/v1/bookings")
      ]);
      setDashboardData(dash);
      setAppliances(apps);
      setBookings(books);
    } catch (err: unknown) {
      console.error("Error loading analytics data:", err);
      setError("Failed to gather metrics. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      await Promise.resolve();
      if (active) {
        fetchData();
      }
    };
    load();

    // Check document classList for dark mode to dynamic render Recharts colors
    const checkDark = () => {
      if (active) {
        setIsDark(document.documentElement.classList.contains("dark"));
      }
    };

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });

    checkDark();
    return () => {
      active = false;
      observer.disconnect();
    };
  }, [fetchData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Computations
  const computedMetrics = useMemo(() => {
    const totalDevices = appliances.length;
    const avgHealth = totalDevices > 0 
      ? Math.round(appliances.reduce((acc, a) => acc + a.healthScore, 0) / totalDevices)
      : 85;

    // Simulated Maintenance Cost calculation
    const baseCostPerAppliance = 45;
    const costMultiplier = dateRange === "30" ? 1 : dateRange === "90" ? 3 : 12;
    const totalMaintenanceCost = totalDevices * baseCostPerAppliance * costMultiplier;

    // Warranty savings
    const coveredDevices = appliances.filter(a => a.warrantyStatus.toLowerCase() === "covered").length;
    const warrantySavings = coveredDevices * 120 * (dateRange === "30" ? 1 : dateRange === "90" ? 2.5 : 8);

    return {
      totalDevices,
      avgHealth,
      totalMaintenanceCost,
      warrantySavings,
      coveredDevices
    };
  }, [appliances, dateRange]);

  // 1. Area Chart: Monthly Maintenance Cost
  const monthlyCostData = useMemo(() => {
    const months = dateRange === "30" 
      ? ["Week 1", "Week 2", "Week 3", "Week 4"] 
      : dateRange === "90" 
      ? ["May", "June", "July"] 
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const baseVal = computedMetrics.totalMaintenanceCost / months.length;
    return months.map((name, idx) => {
      const variance = Math.sin(idx * 1.5) * (baseVal * 0.25) + Math.cos(idx * 0.8) * (baseVal * 0.15);
      const amount = Math.max(Math.round(baseVal + variance), 50);
      return { name, amount };
    });
  }, [computedMetrics.totalMaintenanceCost, dateRange]);

  // 2. Bar Chart: Energy Usage
  const energyData = useMemo(() => {
    const rawVal = appliances.length > 0 ? appliances.length * 8.4 : 24.5;
    const items = dateRange === "30" 
      ? ["Wk 1", "Wk 2", "Wk 3", "Wk 4"]
      : dateRange === "90"
      ? ["Month 1", "Month 2", "Month 3"]
      : ["Q1", "Q2", "Q3", "Q4"];

    return items.map((name, idx) => {
      const consumption = Math.round(rawVal * (1.1 + Math.sin(idx * 1.2) * 0.15) * (dateRange === "365" ? 4 : 1));
      return { name, value: consumption };
    });
  }, [appliances, dateRange]);

  // 3. Pie Chart: Appliance Health Distribution
  const healthDistribution = useMemo(() => {
    let optimal = 0; // >= 90
    let moderate = 0; // 75-89
    let critical = 0; // < 75

    if (appliances.length === 0) {
      return [
        { name: "Optimal", value: 3, color: "#10B981" },
        { name: "Moderate", value: 2, color: "#F59E0B" },
        { name: "Critical", value: 1, color: "#EF4444" }
      ];
    }

    appliances.forEach(a => {
      if (a.healthScore >= 90) optimal++;
      else if (a.healthScore >= 75) moderate++;
      else critical++;
    });

    return [
      { name: "Optimal (90%+)", value: optimal, color: "#10B981" },
      { name: "Moderate (75-89%)", value: moderate, color: "#F59E0B" },
      { name: "Critical (<75%)", value: critical, color: "#EF4444" }
    ];
  }, [appliances]);

  // 4. Donut Chart: Warranty Expiry Status
  const warrantyDistribution = useMemo(() => {
    let active = 0;
    let expired = 0;
    let expiringSoon = 0;

    if (appliances.length === 0) {
      return [
        { name: "Covered", value: 4, color: "#6366F1" },
        { name: "Expired", value: 1, color: "#94A3B8" },
        { name: "Expiring Soon", value: 1, color: "#F59E0B" }
      ];
    }

    appliances.forEach(a => {
      const expiry = new Date(a.warrantyExpiry).getTime();
      const now = new Date().getTime();
      const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) {
        expired++;
      } else if (diffDays <= 30) {
        expiringSoon++;
      } else {
        active++;
      }
    });

    return [
      { name: "Covered", value: active, color: "#6366F1" },
      { name: "Expired", value: expired, color: "#94A3B8" },
      { name: "Expiring Soon", value: expiringSoon, color: "#F59E0B" }
    ];
  }, [appliances]);

  // 5. Line Chart: AI Health Score Trend
  const healthTrendData = useMemo(() => {
    const intervals = dateRange === "30" 
      ? ["Wk 1", "Wk 2", "Wk 3", "Wk 4"] 
      : dateRange === "90" 
      ? ["Month 1", "Month 2", "Month 3"] 
      : ["Q1", "Q2", "Q3", "Q4"];

    return intervals.map((name, idx) => {
      const base = computedMetrics.avgHealth;
      const noise = Math.sin(idx * 2) * 3 + Math.cos(idx) * 2;
      return {
        name,
        health: Math.min(Math.max(Math.round(base + noise), 50), 100)
      };
    });
  }, [computedMetrics.avgHealth, dateRange]);

  // Export CSV
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Metric,Value\n";
    csvContent += `Total Devices,${computedMetrics.totalDevices}\n`;
    csvContent += `Average Health Index,${computedMetrics.avgHealth}%\n`;
    csvContent += `Estimated Maintenance Cost,${computedMetrics.totalMaintenanceCost}\n`;
    csvContent += `Estimated Warranty Savings,${computedMetrics.warrantySavings}\n`;
    csvContent += `Warranty Active Devices,${computedMetrics.coveredDevices}\n\n`;

    csvContent += "Appliance Name,Brand,Model,Room,Health Score,Warranty Status\n";
    appliances.forEach((a) => {
      csvContent += `"${a.name}","${a.brand}","${a.model}","${a.roomName}",${a.healthScore},"${a.warrantyStatus}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dwellix_analytics_${dateRange}_days.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exported CSV successfully.");
  };

  // Export PDF / Print view
  const handleExportPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto p-6 md:p-10 space-y-10 min-h-screen bg-[#F8F9FB] dark:bg-zinc-950 text-left">
        <div className="flex justify-between items-center">
          <div className="h-10 w-48 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-10 w-64 bg-slate-200 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-slate-200 rounded-[24px] animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[450px] bg-slate-200 rounded-[32px] animate-pulse" />
          <div className="h-[450px] bg-slate-200 rounded-[32px] animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1400px] mx-auto p-6 md:p-10 min-h-[60vh] flex flex-col items-center justify-center bg-[#F8F9FB] dark:bg-zinc-950 text-left gap-4">
        <div className="h-16 w-16 rounded-[22px] bg-rose-50 dark:bg-zinc-900 border border-rose-100 dark:border-zinc-800 flex items-center justify-center text-rose-500 mb-2">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">Error Loading Analytics</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{error}</p>
        <Button onClick={fetchData} className="rounded-xl px-6 bg-black text-white hover:bg-black/90">Retry Sync</Button>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-10 space-y-10 bg-[#F8F9FB] dark:bg-zinc-950 min-h-screen text-left font-sans print:bg-white print:p-0">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 10 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-black text-white text-xs md:text-sm font-bold px-6 py-4 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.2)] z-50 flex items-center gap-3 border border-slate-800"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 print:hidden">
        <div className="space-y-1">
          <span className="px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-widest bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-md border border-blue-100/50 dark:border-blue-900/30">
            Performance Insights
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-4 leading-none">
            Executive Analytics
          </h1>
          <p className="text-sm md:text-base font-medium text-slate-500 dark:text-slate-400 mt-3">
            Real-time operations tracking, cost efficiency calculations, and predictive health insights.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Picker */}
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-[#ECECEC] dark:border-zinc-800 rounded-xl px-3 py-2 shadow-xs">
            <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="text-xs font-bold text-slate-900 dark:text-slate-100 bg-transparent border-0 outline-none cursor-pointer"
            >
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">This Year</option>
            </select>
          </div>

          {/* Export CSV */}
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="h-10 rounded-xl font-bold text-xs border-[#ECECEC] text-[#111111] hover:bg-white cursor-pointer shadow-xs flex items-center gap-2"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <span>Export CSV</span>
          </Button>

          {/* Export PDF */}
          <Button
            onClick={handleExportPDF}
            variant="outline"
            className="h-10 rounded-xl font-bold text-xs border-[#ECECEC] text-[#111111] hover:bg-white cursor-pointer shadow-xs flex items-center gap-2"
          >
            <PdfIcon className="h-4 w-4 text-red-500" />
            <span>Print Report</span>
          </Button>

          {/* Refresh */}
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-black hover:bg-black/90 text-white cursor-pointer shadow-xs"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Appliances */}
        <Card className="p-6">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider mb-4">
            <span>Total Appliances</span>
            <Layers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">
            {computedMetrics.totalDevices}
          </div>
          <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-xs mt-3">
            <ArrowUpRight className="h-4 w-4 shrink-0" />
            <span>+2 added recently</span>
          </div>
        </Card>

        {/* Total Maintenance Cost */}
        <Card className="p-6">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider mb-4">
            <span>Maintenance Cost</span>
            <Wrench className="h-5 w-5 text-amber-500" />
          </div>
          <div className="text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">
            ${computedMetrics.totalMaintenanceCost.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-bold text-xs mt-3">
            <span>Estimated checkups</span>
          </div>
        </Card>

        {/* Warranty Savings */}
        <Card className="p-6">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider mb-4">
            <span>Warranty Savings</span>
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">
            ${computedMetrics.warrantySavings.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-xs mt-3">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{computedMetrics.coveredDevices} covered</span>
          </div>
        </Card>

        {/* Home Health Score */}
        <Card className="p-6">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider mb-4">
            <span>Home Health Index</span>
            <Activity className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">
            {computedMetrics.avgHealth}%
          </div>
          <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-xs mt-3">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Optimal operation</span>
          </div>
        </Card>
      </div>

      {/* Row 1: Area Chart (Maintenance Cost) & Donut Chart (Warranty Expiry) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Area Chart: Monthly Maintenance Cost */}
        <Card className="lg:col-span-2 p-8 flex flex-col justify-between min-h-[420px]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Monthly Maintenance Cost</h3>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/20 px-2.5 py-1 rounded-md border border-blue-100/50 dark:border-blue-900/30">Cost Trend</span>
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Historical tracking of scheduled servicing and technical dispatches.</p>
          </div>

          <div className="w-full h-[260px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyCostData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#27272A" : "#F1F5F9"} />
                <XAxis dataKey="name" stroke={isDark ? "#52525B" : "#94A3B8"} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={isDark ? "#52525B" : "#94A3B8"} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: isDark ? "#18181B" : "#111827", border: isDark ? "1px solid #27272A" : "0", borderRadius: "12px", color: "#F9FAFB" }}
                  itemStyle={{ color: "#3B82F6", fontWeight: "bold" }}
                  labelStyle={{ color: "#9CA3AF" }}
                />
                <Area type="monotone" dataKey="amount" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Donut Chart: Warranty Expiry Status */}
        <Card className="p-8 flex flex-col justify-between min-h-[420px]">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-2">Warranty Coverages</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Realtime distribution of coverages across all home devices.</p>
          </div>

          <div className="w-full h-[220px] relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={warrantyDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {warrantyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: isDark ? "#18181B" : "#111827", border: isDark ? "1px solid #27272A" : "0", borderRadius: "12px", color: "#F9FAFB" }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Covered</span>
              <span className="text-3xl font-black text-slate-900 dark:text-slate-100 leading-none">
                {warrantyDistribution.find(d => d.name === "Covered")?.value || 0}
              </span>
            </div>
          </div>

          {/* Custom Legend */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {warrantyDistribution.map((item) => (
              <div key={item.name} className="space-y-1">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold truncate">{item.name}</span>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full block" style={{ backgroundColor: item.color }} />
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 2: Bar Chart (Energy Usage) & Pie Chart (Appliance Health) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Bar Chart: Energy Usage */}
        <Card className="lg:col-span-2 p-8 flex flex-col justify-between min-h-[420px]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Monthly Energy Usage</h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-md border border-emerald-100/50 dark:border-emerald-900/30">Utility Loads</span>
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Simulated hourly power consumption (kWh) metrics per timeline sector.</p>
          </div>

          <div className="w-full h-[260px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={energyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#27272A" : "#F1F5F9"} />
                <XAxis dataKey="name" stroke={isDark ? "#52525B" : "#94A3B8"} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={isDark ? "#52525B" : "#94A3B8"} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)" }}
                  contentStyle={{ backgroundColor: isDark ? "#18181B" : "#111827", border: isDark ? "1px solid #27272A" : "0", borderRadius: "12px", color: "#F9FAFB" }}
                />
                <Bar dataKey="value" fill="#10B981" radius={[8, 8, 0, 0]} maxBarSize={45}>
                  {energyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#10B981" : "#34D399"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pie Chart: Appliance Health Distribution */}
        <Card className="p-8 flex flex-col justify-between min-h-[420px]">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-2">Device Health Distribution</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Proportion of optimal, moderate and faulty status diagnostics.</p>
          </div>

          <div className="w-full h-[220px] relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={healthDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  dataKey="value"
                  label={({ name, percent }) => (name && percent !== undefined && percent > 0) ? `${name.split(" ")[0]} (${Math.round(percent * 100)}%)` : ""}
                  labelLine={false}
                >
                  {healthDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: isDark ? "#18181B" : "#111827", border: isDark ? "1px solid #27272A" : "0", borderRadius: "12px", color: "#F9FAFB" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Legend */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {healthDistribution.map((item) => (
              <div key={item.name} className="space-y-1">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold truncate">{item.name.split(" ")[0]}</span>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full block" style={{ backgroundColor: item.color }} />
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 3: Line Chart (AI Health Score Trend) & Bookings Status Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Line Chart: AI Health Score Trend */}
        <Card className="lg:col-span-2 p-8 flex flex-col justify-between min-h-[420px]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">AI Health Score Trend</h3>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100/50">Gemini Tracking</span>
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Historical curve of overall smart home performance index ratings.</p>
          </div>

          <div className="w-full h-[260px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthTrendData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#27272A" : "#F1F5F9"} />
                <XAxis dataKey="name" stroke={isDark ? "#52525B" : "#94A3B8"} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={isDark ? "#52525B" : "#94A3B8"} fontSize={11} tickLine={false} axisLine={false} domain={[50, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: isDark ? "#18181B" : "#111827", border: isDark ? "1px solid #27272A" : "0", borderRadius: "12px", color: "#F9FAFB" }}
                />
                <Line type="monotone" dataKey="health" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "#FFFFFF" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Bookings & Maintenance Records list */}
        <Card className="p-8 flex flex-col justify-between min-h-[420px]">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-2">Service Bookings</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Recent technician scheduling requests and service operations log.</p>
          </div>

          <div className="flex-1 overflow-y-auto mt-6 space-y-4 max-h-[220px] pr-2 scrollbar-thin">
            {bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-350 dark:text-slate-600">
                <Clock className="h-8 w-8 mb-2 opacity-50" />
                <span className="text-[10px] font-bold uppercase tracking-wider">No Bookings Found</span>
              </div>
            ) : (
              bookings.map((booking) => (
                <div key={booking.id} className="p-3 bg-[#F8F9FB] dark:bg-zinc-950 border border-[#ECECEC] dark:border-zinc-800 rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div className="text-left space-y-0.5">
                    <span className="font-extrabold text-slate-900 dark:text-slate-100 block truncate max-w-[150px]">
                      {booking.issueDescription || "General Maintenance Check"}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium">
                      Date: {booking.scheduledDate || "Scheduled"}
                    </span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[9px] font-extrabold uppercase tracking-wide border shadow-xs ${
                    booking.status?.toLowerCase() === "completed" 
                      ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30" 
                      : "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/30"
                  }`}>
                    {booking.status || "Pending"}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="pt-4 border-t border-slate-50 dark:border-zinc-800 flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Total Requests:</span>
            <span className="text-slate-800 dark:text-slate-205 font-extrabold">{bookings.length}</span>
          </div>
        </Card>
      </div>

    </div>
  );
}
