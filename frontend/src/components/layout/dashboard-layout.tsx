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
  userName?: string;
  homeName?: string;
  homeSelectorOptions?: string[];
  selectedHome?: string;
  onHomeChange?: (homeName: string) => void;
  onLogout?: () => void;
}

export function DashboardLayout({
  children,
  userName = "Alex Morgan",
  homeName = "My Smart Home",
  homeSelectorOptions = ["My Smart Home"],
  selectedHome = "My Smart Home",
  onHomeChange,
  onLogout
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const [userInfo, setUserInfo] = useState<{ userName: string; homeName: string }>({
    userName: userName,
    homeName: homeName
  });

  // Dynamic real-time notifications & user info
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
    const fetchDashboardInfo = async () => {
      try {
        const data = await apiClient<{ 
          userName?: string; 
          home?: { homeName?: string } | null;
          notifications?: NotificationItem[];
        }>("/api/v1/dashboard");
        if (!active) return;

        if (data.userName || data.home?.homeName) {
          setUserInfo({
            userName: data.userName || "Alex Morgan",
            homeName: data.home?.homeName || "My Smart Home"
          });
        }

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
        console.error("Failed to load dashboard info in layout:", err);
      }
    };

    fetchDashboardInfo();
    const interval = setInterval(fetchDashboardInfo, 15000);
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
      <div className="hidden md:flex py-2.5 pl-3 pr-0 h-full flex-col relative z-20 bg-background">
        <motion.aside
          animate={{ width: isCollapsed ? "80px" : "260px" }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col h-full bg-card border border-border rounded-[28px] shadow-sm relative"
        >
          {/* Sidebar Header */}
          <div className={cn("flex items-center h-14 px-6 border-b border-border/60", isCollapsed ? "justify-center" : "justify-between")}>
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl overflow-hidden bg-card border border-border/60 shadow-xs">
                  <Image
                    src="/logo/dwellix-logo-light.png"
                    alt="Dwellix Logo"
                    width={28}
                    height={28}
                    className="h-7 w-7 object-contain"
                    priority
                  />
                </div>
                <span className="font-heading font-bold text-lg tracking-tight text-foreground">Dwellix</span>
              </div>
            )}
            {isCollapsed && (
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl overflow-hidden bg-card border border-border/60 shadow-xs">
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
              className="absolute -right-3 top-4 h-6 w-6 rounded-full border border-border/80 bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary shadow-xs transition-colors cursor-pointer z-30"
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
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeSidebarItem"
                        className="absolute inset-0 bg-primary rounded-xl border border-primary-hover shadow-sm z-0"
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
              <div className="rounded-2xl border border-primary/20 bg-primary-soft p-4 text-left space-y-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-xs font-extrabold text-foreground">Pro Plan</span>
                </div>
                <div className="text-[10px] text-muted-foreground font-semibold">Renew on 12 Aug 2026</div>
                <Link href="/dashboard/settings" className="text-xs text-primary font-bold hover:underline block pt-1">
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
              className="fixed inset-y-0 left-0 w-72 bg-card z-40 flex flex-col h-full shadow-2xl border-r border-border md:hidden"
            >
              <div className="flex items-center justify-between h-20 px-6 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl overflow-hidden bg-card border border-border/60 shadow-xs">
                    <Image
                      src="/logo/dwellix-logo-light.png"
                      alt="Dwellix Logo"
                      width={28}
                      height={28}
                      className="h-7 w-7 object-contain"
                      priority
                    />
                  </div>
                  <span className="font-heading font-bold text-lg tracking-tight text-foreground">Dwellix</span>
                </div>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-2 -mr-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
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
                            ? "bg-primary text-white shadow-sm font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary "
                        )}
                      >
                        <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                        <span>{item.name}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>

              <div className="p-4 border-t border-border/60 bg-transparent">
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
      <div className="flex-grow flex flex-col h-full overflow-hidden bg-background p-2.5 md:py-2.5 md:pl-0 md:pr-3">
        {/* TOP HEADER */}
        <header className="flex items-center justify-between h-14 px-3 sm:px-6 md:px-8 border border-border/60 bg-card/85 backdrop-blur-md rounded-2xl md:rounded-t-[28px] md:rounded-b-none relative z-10">
          <div className="flex items-center gap-2.5 sm:gap-4 flex-grow min-w-0">
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary md:hidden transition-colors cursor-pointer shrink-0"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Search Input - responsive across mobile, tablet, desktop */}
            <div className="relative flex-1 max-w-xs sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search appliances, warranties..."
                className="w-full h-9.5 pl-10 pr-3 sm:pr-4 rounded-xl border border-border bg-background text-foreground text-xs font-medium focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Notifications, Profile */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Current Home Selector (Hidden/Discreet to match mockup visual style) */}
            {homeSelectorOptions && homeSelectorOptions.length > 0 && (
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
                className="p-2 rounded-xl border border-border/60 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors relative cursor-pointer"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-extrabold text-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </motion.button>
              
              {/* Notifications Dropdown Panel */}
              <AnimatePresence>
                {notificationsOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setNotificationsOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-card border border-border shadow-xl z-50 overflow-hidden text-left"
                    >
                      <div className="p-4 border-b border-border/60 flex items-center justify-between bg-card">
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-bold text-sm text-foreground">Notifications</h4>
                          {unreadCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-primary/10 text-primary">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-xs text-primary font-bold hover:underline cursor-pointer"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-border/40 scrollbar-none">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-xs text-muted-foreground font-medium">
                            No notifications yet.
                          </div>
                        ) : (
                          notifications.map((item) => (
                            <div
                              key={item.id}
                              className={cn(
                                "p-4 transition-colors hover:bg-secondary/40 flex items-start gap-3",
                                !item.read ? "bg-primary-soft/30" : ""
                              )}
                            >
                              <span
                                className={cn(
                                  "h-2 w-2 rounded-full mt-1.5 flex-shrink-0",
                                  !item.read ? "bg-primary" : "bg-muted-foreground/30"
                                )}
                              />
                              <div className="space-y-1 flex-grow min-w-0">
                                <p className="text-xs font-bold text-foreground leading-tight">{item.title}</p>
                                <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">{item.message}</p>
                                <span className="text-[9px] text-muted-foreground/70 font-semibold block pt-1">
                                  {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown showing name and Premium Plan */}
            <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer p-1 pr-1 sm:pr-2 rounded-xl">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-foreground leading-tight">{userInfo.userName || userName || "Alex Morgan"}</span>
                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Premium Plan</span>
              </div>
              <div className="h-8.5 w-8.5 sm:h-9 sm:w-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs sm:text-sm border border-border shadow-sm shrink-0">
                {(userInfo.userName || userName || "A").charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* CENTER DASHBOARD CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-none bg-card border-x border-b border-border/60 rounded-b-2xl md:rounded-b-[28px] shadow-sm">
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
