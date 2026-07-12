"use client";

import * as React from "react";
import { 
  Sparkles, ShieldCheck, Receipt, Wrench, MapPin, 
  CalendarDays, Activity, ArrowRight, LayoutDashboard, 
  Tv, ClipboardList, CheckCircle2, ChevronRight 
} from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Paragraph } from "@/components/ui/typography";


interface FeatureItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const features: FeatureItem[] = [
  { label: "AI Diagnosis", icon: Sparkles },
  { label: "Warranty Vault", icon: ShieldCheck },
  { label: "Invoice Vault", icon: Receipt },
  { label: "Technician Marketplace", icon: Wrench },
  { label: "Live Booking Tracking", icon: MapPin },
  { label: "Maintenance Timeline", icon: CalendarDays },
  { label: "Home Health Score", icon: Activity },
];

// Section-level reveal variants
const sectionRevealVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const contentVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const dashboardVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as const,
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export function MeetDwellix() {
  return (
    <Section id="meet-dwellix" variant="secondary" spacing="lg" className="bg-slate-50 border-t border-border/40 overflow-hidden">
      <Container>
        <motion.div
          variants={sectionRevealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          className="w-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content Column */}
            <motion.div 
              className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left gap-6"
              variants={contentVariants}
            >
              {/* Small Badge */}
              <Badge variant="info" className="px-3 py-1 text-xs font-semibold tracking-wide border-primary/10">
                Complete Home Management Platform
              </Badge>

              {/* Heading */}
              <Heading level="h2" className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                Everything Your Home Needs. <br />
                <span className="text-primary">One Intelligent Platform.</span>
              </Heading>

              {/* Description */}
              <Paragraph className="text-base text-muted-foreground leading-relaxed max-w-xl">
                Dwellix combines AI-powered diagnostics, appliance management, digital warranties, invoice storage, technician booking, live tracking and maintenance reminders into one seamless experience.
              </Paragraph>

              {/* Features Bullet List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full pt-2">
                {features.map((feat) => {
                  const Icon = feat.icon;
                  return (
                    <div key={feat.label} className="flex items-center gap-2.5 text-sm text-foreground/90 font-medium group">
                      <motion.div 
                        whileHover={{ rotate: 10, scale: 1.05 }}
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/5 text-primary border border-primary/10 transition-colors"
                      >
                        <Icon className="h-4 w-4" />
                      </motion.div>
                      <span>{feat.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-4">
                <Button className="font-semibold w-full sm:w-auto gap-1.5 group">
                  Explore Features
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Button>
                <Button variant="outline" className="font-semibold w-full sm:w-auto bg-white border border-border/80 text-muted-foreground hover:text-foreground">
                  See Dashboard
                </Button>
              </div>
            </motion.div>

            {/* Right Dashboard Mockup Column */}
            <motion.div 
              className="lg:col-span-7 w-full flex justify-center z-10"
              variants={dashboardVariants}
            >
              {/* SaaS Mockup Container */}
              <div className="w-full max-w-[620px] aspect-[4/3] bg-white rounded-2xl border border-border/60 shadow-xl overflow-hidden flex text-left font-sans text-xs text-foreground select-none">
                
                {/* Sidebar */}
                <div className="w-[145px] bg-slate-50 border-r border-border/40 p-4 flex flex-col gap-6 shrink-0">
                  {/* Typographic Logo */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-extrabold text-[10px]">
                      D
                    </div>
                    <span className="font-heading font-extrabold text-xs text-foreground">Dwellix</span>
                  </div>
                  
                  {/* Navigation Items */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-primary/5 text-primary font-medium">
                      <LayoutDashboard className="h-3.5 w-3.5" />
                      <span>Dashboard</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-muted-foreground hover:bg-slate-100 hover:text-foreground transition-colors font-medium">
                      <Tv className="h-3.5 w-3.5" />
                      <span>Appliances</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-muted-foreground hover:bg-slate-100 hover:text-foreground transition-colors font-medium">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Warranties</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-muted-foreground hover:bg-slate-100 hover:text-foreground transition-colors font-medium">
                      <ClipboardList className="h-3.5 w-3.5" />
                      <span>Bookings</span>
                    </div>
                  </div>
                </div>

                {/* Main Panel */}
                <div className="flex-1 bg-white p-5 flex flex-col gap-4 overflow-y-auto">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-border/40">
                    <span className="font-heading font-bold text-sm text-foreground">Dashboard Overview</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                      <span className="text-[10px] text-muted-foreground font-medium">System status normal</span>
                    </div>
                  </div>

                  {/* Dashboard Grid Row 1 */}
                  <div className="grid grid-cols-2 gap-3">
                    
                    {/* Home Health Score Card */}
                    <motion.div variants={cardItemVariants} className="p-3 border border-border/50 rounded-xl bg-slate-50/50 flex flex-col gap-2">
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Home Health</span>
                      <div className="flex items-center gap-3">
                        <div className="relative flex items-center justify-center h-10 w-10 shrink-0">
                          {/* Radial Progress Circular mockup */}
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="20" cy="20" r="16" stroke="#E2E8F0" strokeWidth="3" fill="transparent" />
                            <circle cx="20" cy="20" r="16" stroke="#10B981" strokeWidth="3" fill="transparent" strokeDasharray="100" strokeDashoffset="6" />
                          </svg>
                          <span className="absolute text-[10px] font-bold text-foreground">94%</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground">Excellent</span>
                          <span className="text-[9px] text-muted-foreground">All appliances active</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Upcoming Booking Card */}
                    <motion.div variants={cardItemVariants} className="p-3 border border-border/50 rounded-xl bg-slate-50/50 flex flex-col gap-1.5">
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Next Service</span>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground leading-tight">AC Maintenance</span>
                        <span className="text-[9px] text-muted-foreground leading-tight">Today, 2:00 PM</span>
                      </div>
                      <div className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-full bg-primary/10 text-[9px] font-bold text-primary">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        <span>Technician Assigned</span>
                      </div>
                    </motion.div>

                  </div>

                  {/* AI Recommendation (Gemini Diagnoser box) */}
                  <motion.div 
                    variants={cardItemVariants} 
                    className="p-3.5 border border-primary/10 rounded-xl bg-primary/5 flex items-start gap-2.5"
                  >
                    <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-primary text-[10px]">Gemini AI Assistant</span>
                      <p className="text-foreground leading-normal text-[11px] font-normal">
                        Refrigerator water filter is at 9% lifetime. Schedule a replacement in the next 12 days to prevent system calcification.
                      </p>
                    </div>
                  </motion.div>

                  {/* Row 3 - Recent Activity & Reminders */}
                  <div className="flex flex-col gap-2.5">
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Action Items & Logs</span>
                    
                    <div className="flex flex-col gap-2">
                      
                      {/* Action Item 1: Warranty Reminder */}
                      <motion.div 
                        variants={cardItemVariants} 
                        className="flex items-center justify-between p-2.5 border border-border/40 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-warning" />
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground">Refrigerator Warranty</span>
                            <span className="text-[9px] text-muted-foreground">Expires in 30 days</span>
                          </div>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                      </motion.div>

                      {/* Action Item 2: Invoice Log */}
                      <motion.div 
                        variants={cardItemVariants} 
                        className="flex items-center justify-between p-2.5 border border-border/40 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-success" />
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground">Dishwasher Invoice</span>
                            <span className="text-[9px] text-muted-foreground">Uploaded yesterday</span>
                          </div>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                      </motion.div>

                    </div>
                  </div>

                </div>

              </div>
            </motion.div>

          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
