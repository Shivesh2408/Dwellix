"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

interface NavItem {
  label: string;
  href: string;
  id: string;
}

const navItems: NavItem[] = [
  { label: "Features", href: "/#features", id: "features" },
  { label: "How It Works", href: "/#how-it-works", id: "how-it-works" },
  { label: "Pricing", href: "/#pricing", id: "pricing" },
  { label: "Resources", href: "/resources", id: "resources" },
  { label: "About Us", href: "/about", id: "about" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("");

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for Active Link Highlighting
  React.useEffect(() => {
    const observers = navItems.map((item) => {
      const el = document.getElementById(item.id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(item.id);
          }
        },
        {
          rootMargin: "-20% 0px -60% 0px", // Focus in the upper-middle of the screen
        }
      );
      observer.observe(el);
      return { el, observer };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) {
          obs.observer.unobserve(obs.el);
        }
      });
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-card/95 backdrop-blur-md border-b border-border/60 py-2 shadow-xs"
          : "bg-transparent border-b border-transparent py-4"
      )}
    >
      <Container className="flex items-center justify-between">
        {/* Dwellix Logo - Increased by 2x */}
        <Link href="/" className="flex items-center group" aria-label="Dwellix Home">
          <Image
            src="/logo/dwellix-logo-light.png"
            alt="Dwellix"
            width={240}
            height={64}
            priority
            className="h-12 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.01]"
          />
        </Link>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-all duration-200 relative py-1",
                activeSection === item.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}            >
              {item.label}
              {activeSection === item.id && (
                <motion.span
                  layoutId="activeUnderline"
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/auth/login" passHref>
            <Button variant="ghost" className="font-semibold text-muted-foreground hover:text-foreground hover:bg-transparent">
              Login
            </Button>
          </Link>
          <Link href="/auth/signup" passHref>
            <Button className="font-semibold px-5 group gap-1">
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 transition-transform duration-200 rotate-90" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </Container>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-b border-border/60 bg-card w-full absolute left-0 overflow-hidden"
          >
            <nav className="flex flex-col px-6 py-6 gap-5 border-t border-border/10" aria-label="Mobile Navigation">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "text-base font-semibold transition-colors py-1 border-b border-border/5",
                    activeSection === item.id ? "text-primary" : "text-muted-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-3">
                <Link href="/auth/login" passHref className="w-full">
                  <Button variant="outline" className="w-full justify-center text-muted-foreground hover:text-foreground">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup" passHref className="w-full">
                  <Button className="w-full justify-center gap-1.5">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
