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
  { name: "Homes", href: "/dashboard/homes", icon: HomeIcon },
  { name: "Appliances", href: "/dashboard/appliances", icon: Cpu },
  { name: "AI Assistant", href: "/dashboard/ai-assistant", icon: Bot },
  { name: "Marketplace", href: "/dashboard/marketplace", icon: ShoppingBag },
  { name: "Bookings", href: "/dashboard/bookings", icon: Calendar },
  { name: "Invoices", href: "/dashboard/invoices", icon: FileText },
  { name: "Warranty Vault", href: "/dashboard/warranty-vault", icon: ShieldCheck },
  { name: "Maintenance", href: "/dashboard/maintenance", icon: Wrench },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Profile", href: "/dashboard/profile", icon: User },
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
    <div className="flex h-screen w-screen overflow-hidden bg-secondary-background font-sans">
      {/* DESKTOP/TABLET SIDEBAR */}
      <motion.aside
        animate={{ width: isCollapsed ? "80px" : "280px" }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex flex-col h-full bg-white border-r border-border relative z-20"
      >
        {/* Sidebar Header */}
        <div className={cn("flex items-center h-20 px-6 border-b border-border", isCollapsed ? "justify-center" : "justify-between")}>
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden shadow-md shadow-primary/10">
                <img
                  src="/logo/dwellix-logo-light.png"
                  alt="Dwellix Logo"
                  className="h-10 w-10 object-contain"
                />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-foreground">Dwellix</span>
            </div>
          )}
          {isCollapsed && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden shadow-md shadow-primary/10">
              <img
                src="/logo/dwellix-logo-light.png"
                alt="Dwellix Logo"
                className="h-10 w-10 object-contain"
              />
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-8 h-6 w-6 rounded-full border border-border bg-white flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary-background transition-colors"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-grow overflow-y-auto py-6 px-4 space-y-1.5 scrollbar-thin">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href}>
                <span
                  className={cn(
                    "flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer",
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/15"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary-background"
                  )}
                >
                  <Icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-white" : "text-muted-foreground")} />
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border bg-white">
          <button
            onClick={handleLogoutClick}
            className={cn(
              "w-full flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/5 transition-all duration-200",
              isCollapsed ? "justify-center" : ""
            )}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* MOBILE DRAWER SIDEBAR */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black z-30 md:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-40 flex flex-col h-full shadow-2xl border-r border-border md:hidden"
            >
              <div className="flex items-center justify-between h-20 px-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden shadow-md shadow-primary/10">
                    <img
                      src="/logo/dwellix-logo-light.png"
                      alt="Dwellix Logo"
                      className="h-10 w-10 object-contain"
                    />
                  </div>
                  <span className="font-heading font-bold text-xl tracking-tight text-foreground">Dwellix</span>
                </div>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-2 -mr-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary-background transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto py-6 px-4 space-y-1.5 scrollbar-none">
                {sidebarItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link key={item.name} href={item.href} onClick={() => setIsMobileDrawerOpen(false)}>
                      <span
                        className={cn(
                          "flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer",
                          isActive
                            ? "bg-primary text-white shadow-md shadow-primary/15"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary-background"
                        )}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span>{item.name}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="p-4 border-t border-border bg-white">
                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/5 transition-all duration-200"
                >
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <div className="flex-grow flex flex-col h-full overflow-hidden">
        {/* TOP HEADER */}
        <header className="flex items-center justify-between h-20 px-4 md:px-8 border-b border-border bg-white relative z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="p-2 -ml-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary-background md:hidden transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs text-muted-foreground font-medium">Greeting</span>
              <h1 className="font-heading font-bold text-lg text-foreground">Good Morning, {userName}</h1>
            </div>
          </div>

          {/* Search, Home Selector, Notifications, Profile */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* Search Bar */}
            <div className="relative hidden lg:block w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-secondary-background text-sm font-medium focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Current Home Selector */}
            {homeSelectorOptions.length > 0 && (
              <div className="relative">
                <select
                  value={selectedHome}
                  onChange={(e) => onHomeChange?.(e.target.value)}
                  className="h-10 px-3 pr-8 rounded-xl border border-border bg-white text-xs font-semibold text-foreground focus:outline-none focus:border-primary/50 appearance-none cursor-pointer"
                >
                  {homeSelectorOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                  <ChevronRight className="h-3 w-3 rotate-90" />
                </div>
              </div>
            )}

            {/* Notification Icon */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2.5 rounded-xl border border-border hover:bg-secondary-background text-muted-foreground hover:text-foreground transition-colors relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
              </button>
              {/* Simple notification dropdown */}
              <AnimatePresence>
                {notificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setNotificationsOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 bg-white border border-border rounded-2xl shadow-xl z-30 p-4"
                    >
                      <div className="flex justify-between items-center pb-2 border-b border-border mb-2">
                        <span className="font-heading font-bold text-sm">Notifications</span>
                        <span className="text-xs text-primary font-semibold hover:underline cursor-pointer">Mark all read</span>
                      </div>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        <div className="p-2 hover:bg-secondary-background rounded-lg transition-colors cursor-pointer">
                          <div className="text-xs font-semibold">Welcome to Dwellix!</div>
                          <div className="text-xxs text-muted-foreground mt-0.5">Your home dashboard is active.</div>
                        </div>
                        <div className="p-2 hover:bg-secondary-background rounded-lg transition-colors cursor-pointer border-t border-border/40">
                          <div className="text-xs font-semibold text-warning">Action Recommended</div>
                          <div className="text-xxs text-muted-foreground mt-0.5 font-medium">One or more warranties are expiring.</div>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Menu */}
            <div className="flex items-center gap-3 p-1 pl-3 rounded-full hover:bg-secondary-background transition-colors cursor-pointer">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-foreground leading-tight">{userName}</span>
                <span className="text-xxs text-muted-foreground font-medium">Home Owner</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white font-bold shadow-sm">
                {userName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* CENTER DASHBOARD CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin">
          <div className="max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* MOBILE BOTTOM NAVIGATION */}
        <nav className="md:hidden flex h-16 bg-white border-t border-border items-center justify-around px-2 pb-safe z-10">
          <Link href="/dashboard" className="flex flex-col items-center justify-center w-12 text-primary">
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-xxs font-semibold mt-1">Dashboard</span>
          </Link>
          <Link href="/dashboard/appliances" className="flex flex-col items-center justify-center w-12 text-muted-foreground hover:text-foreground">
            <Cpu className="h-5 w-5" />
            <span className="text-xxs font-semibold mt-1">Appliances</span>
          </Link>
          <Link href="/dashboard/ai-assistant" className="flex flex-col items-center justify-center w-12 text-muted-foreground hover:text-foreground">
            <Bot className="h-5 w-5" />
            <span className="text-xxs font-semibold mt-1">AI Chat</span>
          </Link>
          <Link href="/dashboard/bookings" className="flex flex-col items-center justify-center w-12 text-muted-foreground hover:text-foreground">
            <Calendar className="h-5 w-5" />
            <span className="text-xxs font-semibold mt-1">Bookings</span>
          </Link>
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="flex flex-col items-center justify-center w-12 text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
            <span className="text-xxs font-semibold mt-1">More</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
