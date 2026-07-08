"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { Bell, Info, AlertTriangle, AlertOctagon, CheckCircle2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string; // e.g. "INFO", "WARNING", "ALERT"
  read: boolean;
  createdAt: string;
}

interface DashboardSummary {
  notifications: NotificationItem[];
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = () => {
    setLoading(true);
    setError(null);
    apiClient<DashboardSummary>("/api/v1/dashboard")
      .then((data) => setNotifications(data.notifications || []))
      .catch((err) => {
        console.error("Failed to load notifications:", err);
        setError("Unable to retrieve notifications log. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getIcon = (type: string) => {
    const t = type.toUpperCase();
    if (t === "WARNING") return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    if (t === "ALERT" || t === "ERROR") return <AlertOctagon className="h-5 w-5 text-rose-500" />;
    return <Info className="h-5 w-5 text-blue-500" />;
  };

  const getBgColor = (type: string, read: boolean) => {
    if (read) return "bg-white border-border/70";
    const t = type.toUpperCase();
    if (t === "WARNING") return "bg-amber-50/20 border-amber-200/60";
    if (t === "ALERT" || t === "ERROR") return "bg-rose-50/20 border-rose-200/60";
    return "bg-blue-50/20 border-blue-200/60";
  };

  if (loading) {
    return (
      <div className="flex-grow p-8 space-y-6 max-w-4xl mx-auto w-full">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 max-w-md mx-auto h-[60vh] gap-4">
        <div className="text-sm font-bold text-destructive font-heading">Error Loading Alerts Log</div>
        <p className="text-xs text-muted-foreground text-center">{error}</p>
        <Button onClick={fetchNotifications} size="sm">Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex-grow p-8 max-w-4xl mx-auto w-full space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-heading">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">Review system alerts, active updates, and diagnostics status changes.</p>
        </div>
        {notifications.length > 0 && (
          <Button variant="ghost" size="sm" className="text-xs gap-1">
            <CheckCircle2 className="h-4 w-4" /> Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed border-2 border-border/80 bg-white/50 rounded-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
            <Bell className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-semibold text-foreground font-heading">Inbox is Empty</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Everything is quiet! You don't have any notifications or maintenance alerts at this time.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((item) => (
            <Card key={item.id} className={`p-5 rounded-2xl border transition-all hover:shadow-sm flex gap-4 items-start ${getBgColor(item.type, item.read)}`}>
              <div className="p-2.5 rounded-xl bg-white border border-border/60 shadow-sm flex-shrink-0 mt-0.5">
                {getIcon(item.type)}
              </div>
              <div className="flex-grow space-y-1">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-semibold">
                    <Calendar className="h-3 w-3" />
                    {new Date(item.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-normal">{item.message}</p>
                {!item.read && (
                  <Badge variant="default" className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.25 mt-2 rounded bg-indigo-500 text-white border-0">
                    New Alert
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
