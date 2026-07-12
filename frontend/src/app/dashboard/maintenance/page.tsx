"use client";

import React, { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { Wrench, Calendar, CheckSquare, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface MaintenanceTask {
  id: string;
  applianceName: string;
  taskName: string;
  date: string;
  status: string;
  actionLabel: string;
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

interface DashboardSummary {
  upcomingMaintenance: MaintenanceTask[];
}

export default function MaintenancePage() {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMaintenance = useCallback(() => {
    setLoading(true);
    setError(null);
    apiClient<DashboardSummary>("/api/v1/dashboard")
      .then((data) => setTasks(data.upcomingMaintenance || []))
      .catch((err) => {
        console.error("Failed to load maintenance checklist:", err);
        setError("Unable to retrieve maintenance schedules. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      await Promise.resolve();
      if (active) {
        fetchMaintenance();
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [fetchMaintenance]);

  const filteredTasks = tasks.filter((task) =>
    task.applianceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.taskName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    const s = status.toLowerCase();
    if (s === "completed" || s === "done") return "success";
    if (s === "overdue" || s === "critical") return "destructive";
    return "warning"; // pending / scheduled
  };

  if (loading) {
    return (
      <div className="flex-grow p-8 space-y-6 max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
        </div>
        <Skeleton className="h-10 w-full rounded-xl" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 max-w-md mx-auto h-[60vh] gap-4">
        <div className="text-sm font-bold text-destructive font-heading">Error Loading Maintenance Checklist</div>
        <p className="text-xs text-muted-foreground text-center">{error}</p>
        <Button onClick={fetchMaintenance} size="sm">Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 max-w-6xl mx-auto w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-heading">Maintenance Center</h1>
        <p className="text-sm text-muted-foreground mt-1">Track pending service operations, filters, and smart home checkups.</p>
      </div>

      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-border/70 shadow-sm">
        <Search className="h-5 w-5 text-muted-foreground ml-2" />
        <Input
          placeholder="Search by appliance name or service task..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
        />
      </div>

      {filteredTasks.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed border-2 border-border/80 bg-white/50 rounded-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary mb-4">
            <Wrench className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-semibold text-foreground font-heading">No Tasks Scheduled</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {searchQuery ? "No results match your search." : "Your home appliances are in top shape! No upcoming maintenance jobs are scheduled."}
          </p>
        </Card>
      ) : (
        <Card className="border-border/70 rounded-2xl bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-border/70 text-[10px] uppercase font-extrabold tracking-wider text-muted-foreground">
                  <th className="py-4 px-6">Appliance</th>
                  <th className="py-4 px-6">Task Checklist</th>
                  <th className="py-4 px-6">Scheduled Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <span className="text-sm font-semibold text-slate-800 block">{task.applianceName}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <CheckSquare className="h-4.5 w-4.5 text-muted-foreground" />
                        {task.taskName}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-xs text-slate-700">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatIndianDate(task.date)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={getStatusVariant(task.status)} className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {task.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button variant="outline" size="sm" className="rounded-lg text-xs h-8">
                        {task.actionLabel || "Mark Done"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
