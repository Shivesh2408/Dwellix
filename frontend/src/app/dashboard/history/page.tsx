"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import {
  Calendar,
  Percent,
  AlertTriangle,
  X,
  Wrench,
  Bot,
  ExternalLink,
  ShieldCheck,
  Activity,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface DiagnosisRecord {
  id: string;
  imageUrl: string;
  applianceType: string;
  brand: string;
  visibleProblems: string[];
  severity: string;
  possibleCauses: string[];
  recommendedActions: string[];
  technicianRequired: boolean;
  confidence: number;
  timestamp: string;
}

export default function DiagnosisHistoryPage() {
  const [records, setRecords] = useState<DiagnosisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<DiagnosisRecord | null>(null);

  useEffect(() => {
    apiClient<DiagnosisRecord[]>("/api/v1/ai/diagnose-image/history")
      .then((data) => {
        setRecords(data);
      })
      .catch((err: unknown) => {
        console.error("Failed to load diagnosis history:", err);
        setError("Could not retrieve diagnosis logs. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return "bg-rose-50 border-rose-100 text-rose-800";
      case "medium":
      case "mod":
        return "bg-amber-50 border-amber-100 text-amber-800";
      case "low":
      default:
        return "bg-emerald-50 border-emerald-100 text-emerald-800";
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const day = d.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-primary/10 text-primary rounded-full">
            Visual Insights
          </span>
          <h1 className="text-xl md:text-3xl font-heading font-extrabold tracking-tight text-foreground">
            Diagnosis History
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            Review past visual appliance health scans, severity reports, and technician repair guides.
          </p>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
          <span className="text-xs font-semibold">Loading diagnosis history...</span>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="p-5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-850 text-xs md:text-sm font-medium flex items-start gap-3.5 max-w-xl mx-auto shadow-sm">
          <AlertTriangle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-extrabold text-rose-900">Data Fetch Failed</div>
            <p className="text-rose-700">{error}</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && records.length === 0 && (
        <div className="text-center py-20 max-w-md mx-auto space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center mx-auto shadow-sm">
            <Bot className="h-7 w-7 opacity-50" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-800">No diagnoses found</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              You haven&apos;t run any visual appliance diagnoses yet. Run a scan from the media page to display details here.
            </p>
          </div>
        </div>
      )}

      {/* History Grid */}
      {!loading && !error && records.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((record) => (
            <motion.div
              key={record.id}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedRecord(record)}
              className="group bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
            >
              {/* Thumbnail Container */}
              <div className="h-44 w-full overflow-hidden bg-slate-50 relative border-b border-slate-100 flex items-center justify-center p-2">
                <img
                  src={record.imageUrl}
                  alt="Appliance scan"
                  className="h-full w-full object-cover rounded-2xl group-hover:scale-102 transition-transform duration-500"
                />
                <span className={`absolute top-3 right-3 px-2 py-0.5 border rounded-full text-[9px] font-extrabold uppercase tracking-wide shadow-sm ${getSeverityColor(record.severity)}`}>
                  {record.severity || "Low"} Severity
                </span>
              </div>

              {/* Card Details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                    {record.brand || "Unknown Brand"}
                  </div>
                  <h3 className="font-heading font-extrabold text-sm md:text-base text-foreground group-hover:text-primary transition-colors">
                    {record.applianceType || "Appliance Issue"}
                  </h3>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-50">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(record.timestamp)}</span>
                  </span>
                  <span className="flex items-center gap-1 font-bold text-slate-700 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-lg">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    <span>{Math.round(record.confidence * 100)}% Match</span>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Details Overlay Dialog */}
      <AnimatePresence>
        {selectedRecord && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRecord(null)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-100 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <span className="font-heading font-extrabold text-foreground text-sm md:text-base">
                    Diagnostic Analysis
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedRecord(null)}
                  className="rounded-full h-8 w-8 hover:bg-slate-100"
                >
                  <X className="h-4 w-4 text-slate-500" />
                </Button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* Visual Image & Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                  <div className="relative rounded-2xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50 aspect-video md:aspect-square flex items-center justify-center">
                    <img
                      src={selectedRecord.imageUrl}
                      alt="Diagnosis scan preview"
                      className="max-h-full max-w-full object-contain rounded-xl"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block mb-0.5">Brand</span>
                        <span className="font-bold text-slate-800 text-xs md:text-sm">{selectedRecord.brand || "N/A"}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block mb-0.5">Type</span>
                        <span className="font-bold text-slate-800 text-xs md:text-sm">{selectedRecord.applianceType || "N/A"}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block mb-0.5">Severity</span>
                        <span className={`inline-block px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase border mt-0.5 ${getSeverityColor(selectedRecord.severity)}`}>
                          {selectedRecord.severity || "Low"}
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block mb-0.5">Confidence</span>
                        <span className="font-bold text-slate-800 text-xs md:text-sm flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                          {Math.round(selectedRecord.confidence * 100)}%
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-primary-soft/30 border border-primary/20/50 flex items-center justify-between text-xs md:text-sm">
                      <div className="flex items-center gap-2 text-foreground font-bold">
                        <Wrench className="h-4 w-4 text-primary" />
                        <span>Professional Repair Status</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                        selectedRecord.technicianRequired
                          ? "bg-rose-50 border-rose-100 text-rose-700"
                          : "bg-emerald-50 border-emerald-100 text-emerald-700"
                      }`}>
                        {selectedRecord.technicianRequired ? "Technician Required" : "DIY Resolvable"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Lists details */}
                <div className="space-y-4 pt-4 border-t border-slate-100 text-left text-xs md:text-sm">
                  {/* Problems */}
                  {selectedRecord.visibleProblems && selectedRecord.visibleProblems.length > 0 && (
                    <div className="space-y-1.5">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
                        <span>Detected Faults / Fault Indicators</span>
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-slate-700">
                        {selectedRecord.visibleProblems.map((prob, i) => (
                          <li key={i}>{prob}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Causes */}
                  {selectedRecord.possibleCauses && selectedRecord.possibleCauses.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5 text-primary" />
                        <span>Likely Underlying Causes</span>
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-slate-700">
                        {selectedRecord.possibleCauses.map((cause, i) => (
                          <li key={i}>{cause}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  {selectedRecord.recommendedActions && selectedRecord.recommendedActions.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Actionable Resolution Guide</span>
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-slate-700">
                        {selectedRecord.recommendedActions.map((action, i) => (
                          <li key={i}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex-shrink-0 flex justify-end">
                <Button
                  onClick={() => setSelectedRecord(null)}
                  className="rounded-xl font-bold text-xs h-9 px-4 cursor-pointer"
                >
                  Close Diagnosis
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Dummy loader component to prevent missing definition compile bugs
function Loader2({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
