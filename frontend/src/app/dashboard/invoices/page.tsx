"use client";

import React, { useState, useEffect, useCallback } from "react";
import { apiClient, apiBaseUrl } from "@/lib/api-client";
import { FileText, Download, Eye, ExternalLink, Calendar, Search, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

interface Appliance {
  id: string;
  name: string;
  brand: string;
  model: string;
  purchaseDate: string;
  photoFileName: string;
  invoiceFileName?: string | null;
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

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Appliance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchInvoices = useCallback(() => {
    setLoading(true);
    setError(null);
    apiClient<Appliance[]>("/api/v1/appliances")
      .then((data) => {
        // Filter out appliances that have an invoice uploaded
        const withInvoices = data.filter((app) => app.invoiceFileName);
        setInvoices(withInvoices);
      })
      .catch((err) => {
        console.error("Failed to load invoices:", err);
        setError("Unable to retrieve invoice documents. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      await Promise.resolve();
      if (active) {
        fetchInvoices();
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [fetchInvoices]);

  const filteredInvoices = invoices.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="text-sm font-bold text-destructive font-heading">Error Loading Invoices</div>
        <p className="text-xs text-muted-foreground text-center">{error}</p>
        <Button onClick={fetchInvoices} size="sm">Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 max-w-6xl mx-auto w-full space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-heading">Invoice Vault</h1>
          <p className="text-sm text-muted-foreground mt-1">Review, access, and download purchasing receipts for your home appliances.</p>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-border/70 shadow-sm">
        <Search className="h-5 w-5 text-muted-foreground ml-2" />
        <Input
          placeholder="Search by appliance, brand, or model..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
        />
      </div>

      {filteredInvoices.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed border-2 border-border/80 bg-white/50 rounded-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
            <FileText className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-semibold text-foreground font-heading">No Invoices Found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {searchQuery ? "No search results match your criteria." : "No purchasing invoices have been uploaded to your appliances yet."}
          </p>
        </Card>
      ) : (
        <Card className="border-border/70 rounded-2xl bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-border/70 text-[10px] uppercase font-extrabold tracking-wider text-muted-foreground">
                  <th className="py-4 px-6">Appliance Details</th>
                  <th className="py-4 px-6">Purchase Date</th>
                  <th className="py-4 px-6">Document Name</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredInvoices.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-500 flex-shrink-0">
                          <Cpu className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-slate-800 block">{item.name}</span>
                          <span className="text-xs text-muted-foreground mt-0.5">{item.brand} • {item.model}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-xs text-slate-700">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatIndianDate(item.purchaseDate)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-border/70">
                        {item.invoiceFileName}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="ghost" size="sm" className="h-8.5 w-8.5 p-0 hover:bg-slate-100 hover:text-foreground">
                          <a href={`${apiBaseUrl}/api/v1/uploads/${item.invoiceFileName}`} target="_blank" rel="noreferrer" title="View Document">
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button asChild variant="ghost" size="sm" className="h-8.5 w-8.5 p-0 hover:bg-slate-100 hover:text-foreground">
                          <a href={`${apiBaseUrl}/api/v1/uploads/${item.invoiceFileName}`} download title="Download Document">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
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
