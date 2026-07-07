"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

const productLinks = [
  { label: "Features", href: "#features" },
  { label: "AI Assistant", href: "#ai-assistant" },
  { label: "Marketplace", href: "#marketplace" },
  { label: "Pricing", href: "#pricing" },
  { label: "Roadmap", href: "#roadmap" },
];

const companyLinks = [
  { label: "About Us", href: "#about" },
  { label: "Blog", href: "#blog" },
  { label: "Careers", href: "#careers" },
  { label: "Contact", href: "#contact" },
  { label: "Press Kit", href: "#press" },
];

const resourceLinks = [
  { label: "Help Center", href: "#help" },
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Terms & Conditions", href: "#terms" },
  { label: "Cookie Policy", href: "#cookies" },
  { label: "Tech Support", href: "#support" },
];

export function Footer() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    // Simple Email Regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setTimeout(() => {
        setStatus("error");
        setErrorMessage("Please enter a valid email address.");
      }, 600);
      return;
    }

    try {
      // Simulate API subscribe response latency
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setStatus("success");
      setEmail("");
      // Reset status to idle after 4 seconds
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800/80 pt-16 pb-8 select-none" aria-label="Global Footer">
      <Container className="flex flex-col gap-12">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 text-left">
          
          {/* Column 1: Brand details */}
          <div className="flex flex-col gap-5 lg:col-span-2">
            <Link href="/" className="flex items-center self-start" aria-label="Dwellix Homepage">
              <Image
                src="/logo/dwellix-logo-light.png"
                alt="Dwellix"
                width={120}
                height={32}
                priority
                className="h-8 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-xs sm:text-sm leading-relaxed max-w-sm text-slate-400/90 font-medium">
              Your Home. Smarter Every Day. Dwellix brings AI-powered diagnostics, appliance vaults, warranties and trusted technicians into one integrated workspace.
            </p>
            {/* Social Icons Strip (Using inline SVGs) */}
            <div className="flex items-center gap-4 text-slate-500">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-xs p-1" aria-label="Twitter">
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-xs p-1" aria-label="Facebook">
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-xs p-1" aria-label="LinkedIn">
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-xs p-1" aria-label="GitHub">
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="flex flex-col gap-4">
            <span className="font-heading font-extrabold text-xs text-white uppercase tracking-wider">Product</span>
            <ul className="flex flex-col gap-2.5 text-xs font-semibold">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="flex flex-col gap-4">
            <span className="font-heading font-extrabold text-xs text-white uppercase tracking-wider">Company</span>
            <ul className="flex flex-col gap-2.5 text-xs font-semibold">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div className="flex flex-col gap-4">
            <span className="font-heading font-extrabold text-xs text-white uppercase tracking-wider">Resources</span>
            <ul className="flex flex-col gap-2.5 text-xs font-semibold">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Newsletter strip & bottom divider */}
        <div className="flex flex-col lg:flex-row items-center justify-between border-t border-slate-800/80 pt-10 gap-6">
          <div className="flex flex-col gap-1 text-center lg:text-left">
            <span className="font-heading font-bold text-sm text-white">Subscribe to our newsletter</span>
            <span className="text-xs text-slate-500">Get product releases, diagnostic tips and platform news.</span>
          </div>
          
          <div className="flex flex-col gap-2 w-full max-w-sm">
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full items-center">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                required
                disabled={status === "loading"}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder="you@example.com"
                className="flex-1 bg-slate-950 border border-slate-800/85 text-xs h-[42px] px-3.5 rounded-lg text-white placeholder-slate-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary disabled:opacity-55"
              />
              <Button 
                type="submit" 
                loading={status === "loading"} 
                className="h-[42px] px-4 font-bold text-xs gap-1.5 shrink-0"
              >
                {status === "loading" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    Subscribe
                    <Send className="h-3 w-3" />
                  </>
                )}
              </Button>
            </form>
            
            {/* Feedback Status messages */}
            {status === "success" && (
              <span className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium leading-none mt-1 animate-pulse">
                <CheckCircle2 className="h-3 w-3 shrink-0" />
                Subscribed successfully! Welcome to Dwellix.
              </span>
            )}
            {status === "error" && (
              <span className="text-[11px] text-red-400 flex items-center gap-1.5 font-medium leading-none mt-1">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {errorMessage}
              </span>
            )}
          </div>
        </div>

        {/* Bottom copyright details */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-800/40 pt-8 gap-4 text-xs font-semibold text-slate-500">
          <span>&copy; {new Date().getFullYear()} Dwellix. All rights reserved.</span>
          
          <div className="flex items-center gap-6">
            <Link href="#privacy" className="hover:text-slate-400 transition-colors">Privacy</Link>
            <Link href="#terms" className="hover:text-slate-400 transition-colors">Terms</Link>
            <Link href="#cookies" className="hover:text-slate-400 transition-colors">Cookies</Link>
          </div>
        </div>

      </Container>
    </footer>
  );
}
