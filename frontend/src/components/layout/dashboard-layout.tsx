"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Home as HomeIcon,
  Cpu,
  Bot,
  ShoppingBag,
  Calendar,
  FileText,
  ShieldCheck,
  Wrench,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Search,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}
const sidebarItems: SidebarItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Appliances", href: "/dashboard/appliances", icon: Cpu },
  { name: "Warranty Vault", href: "/dashboard/warranty-vault", icon: ShieldCheck },
  { name: "AI Assistant", href: "/dashboard/ai-assistant", icon: Bot },
  { name: "Marketplace", href: "/dashboard/marketplace", icon: ShoppingBag },
  { name: "Bookings", href: "/dashboard/bookings", icon: Calendar },
  { name: "Analytics", href: "/dashboard/homes", icon: HomeIcon },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  userName: string;
  homeName: string;
  homeSelectorOptions?: string[];
  selectedHome?: string;
  onHomeChange?: (homeName: string) => void;
  onLogout?: () => void;
}

export function DashboardLayout({
  children,
  userName,
  homeName,
  homeSelectorOptions = [homeName],
  selectedHome = homeName,
  onHomeChange,
  onLogout
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Auto-collapse sidebar on smaller desktop screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && window.innerWidth < 1200) {
        setIsCollapsed(true);
      } else if (window.innerWidth >= 1200) {
        setIsCollapsed(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Keyboard Shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        if (e.key === "Escape") {
          setIsMobileDrawerOpen(false);
          setNotificationsOpen(false);
        }
        return;
      }

      if (e.ctrlKey && e.key === "/") {
        e.preventDefault();
        router.push("/dashboard/ai-assistant");
      } else if (e.altKey && e.key.toLowerCase() === "b") {
        e.preventDefault();
        router.push("/dashboard/bookings");
      } else if (e.altKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        router.push("/dashboard/appliances");
      } else if (e.altKey && e.key.toLowerCase() === "t") {
        e.preventDefault();
        router.push("/dashboard/technicians");
      } else if (e.altKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        router.push("/dashboard");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background font-sans">
      {/* DESKTOP/TABLET SIDEBAR */}
      <div className="hidden md:flex p-4 pr-0 h-full flex-col relative z-20 bg-background">
        <motion.aside
          animate={{ width: isCollapsed ? "80px" : "260px" }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col h-full bg-white border border-border rounded-3xl shadow-premium relative"
        >
          {/* Sidebar Header */}
          <div className={cn("flex items-center h-20 px-6 border-b border-border/40", isCollapsed ? "justify-center" : "justify-between")}>
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl overflow-hidden bg-white border border-border/40 shadow-xs">
                  <img
                    src="/logo/dwellix-logo-light.png"
                    alt="Dwellix Logo"
                    className="h-7 w-7 object-contain"
                  />
                </div>
                <span className="font-heading font-bold text-lg tracking-tight text-foreground">Dwellix</span>
              </div>
            )}
            {isCollapsed && (
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl overflow-hidden bg-white border border-border/40 shadow-xs">
                <img
                  src="/logo/dwellix-logo-light.png"
                  alt="Dwellix Logo"
                  className="h-7 w-7 object-contain"
                />
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="absolute -right-3 top-8 h-6 w-6 rounded-full border border-border/60 bg-white flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background shadow-xs transition-colors cursor-pointer z-30"
            >
              {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
            </button>
          </div>

          {/* Sidebar Navigation */}
          <div className="flex-grow overflow-y-auto py-6 px-4 space-y-1.5 scrollbar-none">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href}>
                  <span
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer relative",
                      isActive
                        ? "text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeSidebarItem"
                        className="absolute inset-0 bg-primary/5 rounded-xl border border-primary/10 z-0"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon className={cn("h-4.5 w-4.5 flex-shrink-0 z-10", isActive ? "text-primary" : "text-muted-foreground/80")} />
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        transition={{ duration: 0.2 }}
                        className="whitespace-nowrap z-10"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Pro Plan Card as shown in mockup */}
          {!isCollapsed && (
            <div className="px-4 mb-2">
              <div className="rounded-2xl border border-blue-100 bg-blue-50/20 p-4 text-left space-y-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  <span className="text-xs font-extrabold text-slate-800">Pro Plan</span>
                </div>
                <div className="text-[10px] text-slate-500 font-semibold">Renew on 12 Aug 2026</div>
                <Link href="/dashboard/settings" className="text-xs text-blue-600 font-bold hover:underline block pt-1">
                  Upgrade
                </Link>
              </div>
            </div>
          )}

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border/40 bg-transparent">
            <button
              onClick={handleLogoutClick}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/5 transition-all duration-200 cursor-pointer",
                isCollapsed ? "justify-center" : ""
              )}
            >
              <LogOut className="h-4.5 w-4.5 flex-shrink-0" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </motion.aside>
      </div>

      {/* MOBILE DRAWER SIDEBAR */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 z-30 md:hidden backdrop-blur-xs"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-background z-40 flex flex-col h-full shadow-2xl border-r border-border md:hidden"
            >
              <div className="flex items-center justify-between h-20 px-6 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl overflow-hidden bg-white border border-border/40 shadow-xs">
                    <img
                      src="/logo/dwellix-logo-light.png"
                      alt="Dwellix Logo"
                      className="h-7 w-7 object-contain"
                    />
                  </div>
                  <span className="font-heading font-bold text-lg tracking-tight text-foreground">Dwellix</span>
                </div>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-2 -mr-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-black/[0.02] transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto py-6 px-4 space-y-1 scrollbar-none">
                {sidebarItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link key={item.name} href={item.href} onClick={() => setIsMobileDrawerOpen(false)}>
                      <span
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer",
                          isActive
                            ? "bg-white text-foreground shadow-xs border border-border/50 font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-black/[0.02]"
                        )}
                      >
                        <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                        <span>{item.name}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="p-4 border-t border-border/40 bg-transparent">
                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/5 transition-all duration-200 cursor-pointer"
                >
                  <LogOut className="h-4.5 w-4.5 flex-shrink-0" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <div className="flex-grow flex flex-col h-full overflow-hidden bg-background">
        {/* TOP HEADER */}
        <header className="flex items-center justify-between h-20 px-4 md:px-8 border-b border-border/40 bg-white/80 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-4 flex-grow">
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="p-2 -mr-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-black/[0.02] md:hidden transition-colors cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Search Input on left as shown in mockup */}
            <div className="relative hidden md:block w-96 max-w-lg">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search appliances, invoices, warranties..."
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-border/80 bg-[#F8F9FB] text-sm font-medium focus:outline-none focus:border-blue-600/40 focus:ring-1 focus:ring-blue-600/20 transition-all"
              />
            </div>
          </div>

          {/* Search, Notifications, Profile */}
          <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
            {/* Current Home Selector (Hidden/Discreet to match mockup visual style) */}
            {homeSelectorOptions.length > 0 && (
              <div className="relative hidden">
                <select
                  value={selectedHome}
                  onChange={(e) => onHomeChange?.(e.target.value)}
                  className="h-9 pl-3 pr-8 rounded-xl border border-border/60 bg-white text-xs font-medium text-foreground focus:outline-none appearance-none cursor-pointer"
                >
                  {homeSelectorOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Notification Icon */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl border border-border/60 hover:bg-black/[0.01] text-muted-foreground hover:text-foreground transition-colors relative cursor-pointer"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-blue-600" />
              </button>
              
              <AnimatePresence>
                {notificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setNotificationsOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 bg-white border border-border/80 rounded-2xl shadow-xl z-30 p-4"
                    >
                      <div className="flex justify-between items-center pb-2 border-b border-border/40 mb-2">
                        <span className="font-heading font-bold text-sm">Notifications</span>
                        <span className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer">Mark all read</span>
                      </div>
                      <div className="space-y-2 max-h-60 overflow-y-auto text-left">
                        <div className="p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                          <div className="text-xs font-semibold">Welcome to Dwellix!</div>
                          <div className="text-xxs text-muted-foreground mt-0.5">Your home dashboard is active.</div>
                        </div>
                        <div className="p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer border-t border-border/40">
                          <div className="text-xs font-semibold text-warning">Action Recommended</div>
                          <div className="text-xxs text-muted-foreground mt-0.5 font-medium">One or more warranties are expiring.</div>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown showing name and Premium Plan */}
            <div className="flex items-center gap-3 cursor-pointer p-1 pr-2 rounded-xl">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-800 leading-tight">{userName || "Alex Morgan"}</span>
                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Premium Plan</span>
              </div>
              <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm border border-slate-100 shadow-sm flex-shrink-0">
                {userName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* CENTER DASHBOARD CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-none">
          <div className="max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* MOBILE BOTTOM NAVIGATION */}
        <nav className="md:hidden flex h-16 bg-background/90 backdrop-blur-md border-t border-border/40 items-center justify-around px-2 pb-safe z-10">
          <Link href="/dashboard" className="flex flex-col items-center justify-center w-12 text-primary">
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-[10px] font-semibold mt-1">Dashboard</span>
          </Link>
          <Link href="/dashboard/appliances" className="flex flex-col items-center justify-center w-12 text-muted-foreground hover:text-foreground">
            <Cpu className="h-5 w-5" />
            <span className="text-[10px] font-semibold mt-1">Appliances</span>
          </Link>
          <Link href="/dashboard/ai-assistant" className="flex flex-col items-center justify-center w-12 text-muted-foreground hover:text-foreground">
            <Bot className="h-5 w-5" />
            <span className="text-[10px] font-semibold mt-1">AI Chat</span>
          </Link>
          <Link href="/dashboard/bookings" className="flex flex-col items-center justify-center w-12 text-muted-foreground hover:text-foreground">
            <Calendar className="h-5 w-5" />
            <span className="text-[10px] font-semibold mt-1">Bookings</span>
          </Link>
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="flex flex-col items-center justify-center w-12 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-semibold mt-1">More</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
