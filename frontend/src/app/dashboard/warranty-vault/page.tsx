"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";

import { ShieldCheck, ShieldAlert, Calendar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";


interface Appliance {
  id: string;
  name: string;
  brand: string;
  model: string;
  warrantyExpiry: string;
  warrantyStatus: string;
}

export default function WarrantyVaultPage() {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchWarranties = () => {
    setLoading(true);
    setError(null);
    apiClient<Appliance[]>("/api/v1/appliances")
      .then((data) => setAppliances(data))
      .catch((err) => {
        console.error("Failed to load warranties:", err);
        setError("Unable to retrieve warranty schedules. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWarranties();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const filteredAppliances = appliances.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDaysRemaining = (expiryStr: string) => {
    const expiry = new Date(expiryStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-44 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 max-w-md mx-auto h-[60vh] gap-4">
        <div className="text-sm font-bold text-destructive font-heading">Error Loading Warranty Schedules</div>
        <p className="text-xs text-muted-foreground text-center">{error}</p>
        <Button onClick={fetchWarranties} size="sm">Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex-grow p-8 max-w-6xl mx-auto w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-heading">Warranty Vault</h1>
        <p className="text-sm text-muted-foreground mt-1">Track appliance coverages, expirations, and active guarantees.</p>
      </div>

      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-border/70 shadow-sm">
        <Search className="h-5 w-5 text-muted-foreground ml-2" />
        <Input
          placeholder="Search appliances, brands, models..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
        />
      </div>

      {filteredAppliances.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed border-2 border-border/80 bg-white/50 rounded-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 mb-4">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-semibold text-foreground font-heading">No Warranties Found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {searchQuery ? "No search results match your criteria." : "You don't have any registered appliances tracked under warranty."}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAppliances.map((app) => {
            const daysLeft = getDaysRemaining(app.warrantyExpiry);
            const isExpired = daysLeft <= 0;

            return (
              <Card key={app.id} className="border-border/70 bg-white rounded-2xl shadow-sm p-6 hover:shadow-md hover:border-border transition-all flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className={`p-2.5 rounded-xl flex-shrink-0 ${isExpired ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-500"}`}>
                        {isExpired ? <ShieldAlert className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-800 line-clamp-1 group-hover:text-primary transition-colors">{app.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{app.brand} • {app.model}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Expires:</span>
                    </div>
                    <span className="font-semibold">{new Date(app.warrantyExpiry).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Badge variant={isExpired ? "destructive" : "success"} className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {isExpired ? "Expired" : "Active"}
                  </Badge>

                  <span className={`text-xs font-semibold ${isExpired ? "text-rose-500 font-bold" : daysLeft <= 30 ? "text-amber-500 font-bold animate-pulse" : "text-emerald-500"}`}>
                    {isExpired ? "Expired" : `${daysLeft} days left`}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
