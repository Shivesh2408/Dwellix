"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Cpu,
  Bot,
  ShoppingBag,
  Calendar,
  ShieldCheck,
  Bell,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import dynamic from "next/dynamic";
import Image from "next/image";

const CommandPalette = dynamic(
  () => import("@/components/common/command-palette").then((mod) => mod.CommandPalette),
  { ssr: false }
);
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
  { name: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
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
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Dynamic real-time notifications
  interface NotificationItem {
    id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: string;
  }
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isRinging, setIsRinging] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchNotifications = async () => {
      try {
        const data = await apiClient<{ notifications?: NotificationItem[] }>("/api/v1/dashboard");
        if (!active) return;
        const list = data.notifications || [];
        setNotifications(list);
        
        const newUnread = list.filter(n => !n.read).length;
        setUnreadCount((prev) => {
          if (newUnread > prev) {
            setIsRinging(true);
            setTimeout(() => setIsRinging(false), 600);
          }
          return newUnread;
        });
      } catch (err) {
        console.error("Failed to load notifications in layout:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const bellVariants = {
    ring: {
      rotate: [0, -15, 15, -15, 15, -10, 10, -5, 5, 0],
      transition: { duration: 0.6 }
    },
    idle: { rotate: 0 }
  };

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
      // Toggle Command Palette on Ctrl+K or Cmd+K anywhere
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

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
      <div className="hidden md:flex p-4 pr-0 h-full flex-col relative z-20 bg-[#F8F9FB]">
        <motion.aside
          animate={{ width: isCollapsed ? "80px" : "260px" }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col h-full bg-white border border-[#ECECEC] rounded-[28px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] relative"
        >
          {/* Sidebar Header */}
          <div className={cn("flex items-center h-20 px-6 border-b border-[#ECECEC]/60", isCollapsed ? "justify-center" : "justify-between")}>
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl overflow-hidden bg-white border border-[#ECECEC]/60 shadow-xs">
                  <Image
                    src="/logo/dwellix-logo-light.png"
                    alt="Dwellix Logo"
                    width={28}
                    height={28}
                    className="h-7 w-7 object-contain"
                    priority
                  />
                </div>
                <span className="font-heading font-bold text-lg tracking-tight text-slate-900">Dwellix</span>
              </div>
            )}
            {isCollapsed && (
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl overflow-hidden bg-white border border-[#ECECEC]/60 shadow-xs">
                <Image
                  src="/logo/dwellix-logo-light.png"
                  alt="Dwellix Logo"
                  width={28}
                  height={28}
                  className="h-7 w-7 object-contain"
                  priority
                />
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="absolute -right-3 top-8 h-6 w-6 rounded-full border border-[#ECECEC]/80 bg-white flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[#F8F9FB] shadow-xs transition-colors cursor-pointer z-30"
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
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-350 cursor-pointer relative",
                      isActive
                        ? "text-white font-bold"
                        : "text-muted-foreground hover:text-foreground hover:bg-slate-50"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeSidebarItem"
                        className="absolute inset-0 bg-slate-900 rounded-xl border border-slate-950 shadow-sm z-0"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon className={cn("h-4.5 w-4.5 flex-shrink-0 z-10", isActive ? "text-white" : "text-muted-foreground/80")} />
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
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/5  transition-all duration-205 cursor-pointer",
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
              className="fixed inset-y-0 left-0 w-72 bg-white z-40 flex flex-col h-full shadow-2xl border-r border-[#ECECEC] md:hidden"
            >
              <div className="flex items-center justify-between h-20 px-6 border-b border-[#ECECEC]/60">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl overflow-hidden bg-white border border-[#ECECEC]/60 shadow-xs">
                    <Image
                      src="/logo/dwellix-logo-light.png"
                      alt="Dwellix Logo"
                      width={28}
                      height={28}
                      className="h-7 w-7 object-contain"
                      priority
                    />
                  </div>
                  <span className="font-heading font-bold text-lg tracking-tight text-slate-900">Dwellix</span>
                </div>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-2 -mr-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-slate-50 transition-colors cursor-pointer"
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
                            ? "bg-slate-900  text-white  shadow-sm font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-slate-50 "
                        )}
                      >
                        <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                        <span>{item.name}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="p-4 border-t border-[#ECECEC]/60 bg-transparent">
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
      <div className="flex-grow flex flex-col h-full overflow-hidden bg-[#F8F9FB]">
        {/* TOP HEADER */}
        <header className="flex items-center justify-between h-20 px-4 md:px-8 border-b border-border/40 bg-white/80 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-4 flex-grow">
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="p-2 -mr-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-slate-50 md:hidden transition-colors cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Search Input on left as shown in mockup */}
            <div className="relative hidden md:block w-96 max-w-lg">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search appliances, invoices, warranties..."
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-border/80 bg-[#F8F9FB] text-slate-900 text-sm font-medium focus:outline-none focus:border-blue-600/40 focus:ring-1 focus:ring-blue-600/20 transition-all"
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
              <motion.button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                animate={isRinging ? "ring" : "idle"}
                variants={bellVariants}
                className="p-2 rounded-xl border border-border/60 hover:bg-slate-50 text-muted-foreground hover:text-foreground transition-colors relative cursor-pointer"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-extrabold text-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </motion.button>
              
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
                        <span onClick={handleMarkAllRead} className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer select-none">Mark all read</span>
                      </div>
                      
                      <div className="space-y-2 max-h-60 overflow-y-auto text-left scrollbar-none">
                        {notifications.length === 0 ? (
                          <div className="py-6 text-center text-xs text-slate-400 font-medium">
                            No notifications yet.
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div 
                              key={n.id} 
                              onClick={() => {
                                setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
                                setUnreadCount(prev => Math.max(0, prev - (n.read ? 0 : 1)));
                              }}
                              className={cn(
                                "p-2 rounded-lg transition-colors cursor-pointer border-b border-border/10  last:border-b-0",
                                n.read ? "hover:bg-slate-50 " : "bg-blue-50/20  hover:bg-slate-50  border-l-2 border-blue-600"
                              )}
                            >
                              <div className="flex items-start justify-between gap-1.5">
                                <div className="text-xs font-bold text-slate-900">{n.title}</div>
                                {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1 shrink-0" />}
                              </div>
                              <div className="text-[10px] text-muted-foreground mt-0.5 leading-normal">{n.message}</div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="pt-2 border-t border-border/40 mt-2 text-center">
                        <Link 
                          href="/dashboard/notifications" 
                          onClick={() => setNotificationsOpen(false)}
                          className="text-xs text-blue-600 font-bold hover:underline"
                        >
                          View all notifications
                        </Link>
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
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
    </div>
  );
}
