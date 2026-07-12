"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Cpu, ShieldCheck, Calendar, Bot, ShoppingBag,
  Settings, Bell, Terminal, CornerDownLeft, Sparkles, TrendingUp
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { motion, AnimatePresence } from "framer-motion";

interface CommandItem {
  id: string;
  category: "Navigation" | "Appliances" | "Warranties" | "Bookings";
  title: string;
  subtitle?: string;
  href: string;
  icon: React.ReactNode;
}

interface AppliancePaletteItem {
  id: string;
  name: string;
  brand: string;
  roomName?: string | null;
  warrantyExpiry: string;
  warrantyStatus: string;
}

interface BookingPaletteItem {
  id: string;
  issueDescription?: string | null;
  scheduledDate?: string | null;
  status: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [appliances, setAppliances] = useState<AppliancePaletteItem[]>([]);
  const [bookings, setBookings] = useState<BookingPaletteItem[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  // Fetch real data on mount to populate search suggestions
  useEffect(() => {
    let active = true;
    if (isOpen) {
      const reset = async () => {
        await Promise.resolve();
        if (!active) return;
        setSearch("");
        setSelectedIndex(0);
        
        const [apps, books] = await Promise.all([
          apiClient<AppliancePaletteItem[]>("/api/v1/appliances").catch(() => []),
          apiClient<BookingPaletteItem[]>("/api/v1/bookings").catch(() => [])
        ]);
        if (!active) return;
        setAppliances(apps || []);
        setBookings(books || []);
      };
      reset();
    }
    return () => {
      active = false;
    };
  }, [isOpen]);

  // Construct command catalog
  const commandCatalog: CommandItem[] = useMemo(() => {
    const list: CommandItem[] = [
      // Navigation Actions
      {
        id: "nav-dash",
        category: "Navigation",
        title: "Go to Dashboard",
        subtitle: "Overview of your smart home",
        href: "/dashboard",
        icon: <Terminal className="h-4.5 w-4.5 text-slate-500" />
      },
      {
        id: "nav-ai",
        category: "Navigation",
        title: "AI Assistant",
        subtitle: "Ask Gemini for appliance troubleshooting",
        href: "/dashboard/ai-assistant",
        icon: <Bot className="h-4.5 w-4.5 text-primary" />
      },
      {
        id: "nav-marketplace",
        category: "Navigation",
        title: "Marketplace",
        subtitle: "Browse certified parts and verified appliances",
        href: "/dashboard/marketplace",
        icon: <ShoppingBag className="h-4.5 w-4.5 text-primary" />
      },
      {
        id: "nav-settings",
        category: "Navigation",
        title: "System Settings",
        subtitle: "Configure account and system preferences",
        href: "/dashboard/settings",
        icon: <Settings className="h-4.5 w-4.5 text-slate-700" />
      },
      {
        id: "nav-notifications",
        category: "Navigation",
        title: "Notifications Inbox",
        subtitle: "Check latest system dispatches",
        href: "/dashboard/notifications",
        icon: <Bell className="h-4.5 w-4.5 text-amber-500" />
      },
      {
        id: "nav-analytics",
        category: "Navigation",
        title: "Home Analytics",
        subtitle: "Track power logs and efficiency trends",
        href: "/dashboard/analytics",
        icon: <TrendingUp className="h-4.5 w-4.5 text-emerald-500" />
      }
    ];

    // Dynamic Appliances
    appliances.forEach((app) => {
      list.push({
        id: `app-${app.id}`,
        category: "Appliances",
        title: app.name,
        subtitle: `${app.brand} — ${app.roomName || "Unassigned"}`,
        href: `/dashboard/appliances/${app.id}`,
        icon: <Cpu className="h-4.5 w-4.5 text-primary" />
      });
      // Duplicate to Warranties category for context
      list.push({
        id: `warranty-${app.id}`,
        category: "Warranties",
        title: `${app.name} Warranty`,
        subtitle: `Expires: ${app.warrantyExpiry} (${app.warrantyStatus})`,
        href: "/dashboard/warranty-vault",
        icon: <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" />
      });
    });

    // Dynamic Bookings
    bookings.forEach((book) => {
      list.push({
        id: `booking-${book.id}`,
        category: "Bookings",
        title: book.issueDescription || "Appliance Maintenance Dispatch",
        subtitle: `Scheduled: ${book.scheduledDate} (${book.status})`,
        href: `/dashboard/bookings/${book.id}`,
        icon: <Calendar className="h-4.5 w-4.5 text-amber-600" />
      });
    });

    return list;
  }, [appliances, bookings]);

  // Filters items based on input query
  const filteredItems = useMemo(() => {
    if (!search.trim()) return commandCatalog;
    const q = search.toLowerCase();
    return commandCatalog.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle?.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [commandCatalog, search]);

  const triggerAction = useCallback((href: string) => {
    router.push(href);
    onClose();
  }, [router, onClose]);

  // Adjust selected index if it falls out of range
  useEffect(() => {
    let active = true;
    const adjust = async () => {
      await Promise.resolve();
      if (!active) return;
      setSelectedIndex((prev) => {
        if (prev >= filteredItems.length) {
          return Math.max(0, filteredItems.length - 1);
        }
        return prev;
      });
    };
    adjust();
    return () => {
      active = false;
    };
  }, [filteredItems]);

  // Keyboard navigation inside command palette
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          triggerAction(filteredItems[selectedIndex].href);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose, triggerAction]);

  // Auto-scroll inside list container
  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        const container = listRef.current;
        const elemTop = selectedElement.offsetTop;
        const elemBottom = elemTop + selectedElement.offsetHeight;
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.offsetHeight;

        if (elemTop < containerTop) {
          container.scrollTop = elemTop;
        } else if (elemBottom > containerBottom) {
          container.scrollTop = elemBottom - container.offsetHeight;
        }
      }
    }
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 font-sans text-left">
          
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/20 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-xl w-full bg-white rounded-[24px] border border-border shadow-2xl overflow-hidden flex flex-col max-h-[460px] z-50"
          >
            {/* Command search input bar */}
            <div className="flex items-center gap-3 px-4.5 py-4 border-b border-slate-100">
              <Search className="h-5 w-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type a command or search user data..."
                autoFocus
                className="w-full bg-transparent border-0 outline-none text-sm text-foreground placeholder:text-slate-400 font-semibold"
              />
              <span className="text-[10px] text-slate-450 font-bold bg-slate-100 border border-slate-200/50 px-2 py-0.5 rounded-lg shrink-0">
                ESC
              </span>
            </div>

            {/* List Panels */}
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-none"
            >
              {filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <Sparkles className="h-8 w-8 mb-2 text-slate-350" />
                  <span className="text-xs font-bold">No results found for &ldquo;{search}&rdquo;</span>
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const isSelected = selectedIndex === idx;
                  
                  // Show category header if it is the first item of that category
                  const showHeader = idx === 0 || filteredItems[idx - 1].category !== item.category;

                  return (
                    <React.Fragment key={item.id}>
                      {showHeader && (
                        <div className="text-[9px] uppercase font-bold tracking-widest text-slate-400 px-3.5 pt-3 pb-1">
                          {item.category}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => triggerAction(item.href)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-left cursor-pointer ${ isSelected ? "bg-slate-950 text-white shadow-sm" : "hover:bg-slate-50 text-slate-700 " }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <span className={isSelected ? "text-white " : "text-slate-400"}>
                            {item.icon}
                          </span>
                          <div className="min-w-0 text-left">
                            <span className="text-xs font-bold block truncate leading-none">
                              {item.title}
                            </span>
                            {item.subtitle && (
                              <span className={`text-[10px] block truncate mt-1 ${isSelected ? "text-slate-300 " : "text-slate-450 "}`}>
                                {item.subtitle}
                              </span>
                            )}
                          </div>
                        </div>

                        {isSelected && (
                          <div className="flex items-center gap-1 text-[10px] text-slate-300 font-bold shrink-0">
                            <span>Open</span>
                            <CornerDownLeft className="h-3 w-3" />
                          </div>
                        )}
                      </button>
                    </React.Fragment>
                  );
                })
              )}
            </div>

            {/* Footer controls instructions bar */}
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[10px] text-slate-400 font-bold">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span className="px-1 py-0.5 rounded bg-white border border-slate-200 shadow-xxs font-mono">&uarr;&darr;</span>
                  <span>Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="px-1 py-0.5 rounded bg-white border border-slate-200 shadow-xxs font-mono">Enter</span>
                  <span>Select</span>
                </span>
              </div>
              <span className="text-slate-450 uppercase tracking-wide">Dwellix Raycast Palette</span>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
