"use client";

import * as React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#2B2421] text-[#978C85] border-t border-[#3F332E]/30 pt-16 pb-12 select-none" aria-label="Global Footer">
      <div className="max-w-[1280px] mx-auto px-8 flex flex-col gap-12">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 text-left">
          
          {/* Column 1: Brand details (takes 2 spans on large screens) */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 self-start group" aria-label="Dwellix Homepage">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFFCF8] border border-[#E7DDD5] shadow-sm">
                <img
                  src="/logo/dwellix-logo-light.png"
                  alt="Dwellix"
                  className="h-6 w-6 object-contain"
                />
              </div>
              <span className="font-heading font-extrabold text-xl tracking-tighter text-[#FFFCF8] transition-colors group-hover:text-[#F28A70]">
                Dwellix
              </span>
            </Link>
            <div className="space-y-2">
              <p className="text-sm font-bold text-[#FFFCF8]">
                “Your Home. Smarter Every Day.”
              </p>
              <p className="text-[13px] leading-relaxed max-w-sm font-medium">
                A smarter way to organize your home, appliances, maintenance, and service workflows.
              </p>
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="flex flex-col gap-4">
            <span className="font-heading font-extrabold text-xs text-[#FFFCF8] uppercase tracking-wider">Product</span>
            <ul className="flex flex-col gap-3 text-[13px] font-semibold">
              <li>
                <a href="/#features" className="hover:text-[#F28A70] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm py-0.5 px-1 -mx-1">
                  Features
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-[#F28A70] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm py-0.5 px-1 -mx-1">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/#pricing" className="hover:text-[#F28A70] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm py-0.5 px-1 -mx-1">
                  Pricing
                </a>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#F28A70] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm py-0.5 px-1 -mx-1">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="flex flex-col gap-4">
            <span className="font-heading font-extrabold text-xs text-[#FFFCF8] uppercase tracking-wider">Resources</span>
            <ul className="flex flex-col gap-3 text-[13px] font-semibold">
              <li>
                <Link href="/resources" className="hover:text-[#F28A70] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm py-0.5 px-1 -mx-1">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="hover:text-[#F28A70] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm py-0.5 px-1 -mx-1">
                  Getting Started
                </Link>
              </li>
              <li>
                <Link href="/auth/forgot-password" className="hover:text-[#F28A70] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm py-0.5 px-1 -mx-1">
                  Account & Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className="flex flex-col gap-4">
            <span className="font-heading font-extrabold text-xs text-[#FFFCF8] uppercase tracking-wider">Company</span>
            <ul className="flex flex-col gap-3 text-[13px] font-semibold">
              <li>
                <Link href="/about" className="hover:text-[#F28A70] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm py-0.5 px-1 -mx-1">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#F28A70] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm py-0.5 px-1 -mx-1">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#F28A70] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm py-0.5 px-1 -mx-1">
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Account */}
          <div className="flex flex-col gap-4">
            <span className="font-heading font-extrabold text-xs text-[#FFFCF8] uppercase tracking-wider">Account</span>
            <ul className="flex flex-col gap-3 text-[13px] font-semibold">
              <li>
                <Link href="/auth/login" className="hover:text-[#F28A70] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm py-0.5 px-1 -mx-1">
                  Log In
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="hover:text-[#F28A70] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm py-0.5 px-1 -mx-1">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright details */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#3F332E]/30 pt-8 gap-4 text-xs font-semibold text-[#756B65]">
          <span>© 2026 Dwellix. All rights reserved.</span>
          <span className="hidden sm:inline font-bold text-[#FFFCF8]">Your Home. Smarter Every Day.</span>
        </div>

      </div>
    </footer>
  );
}
