"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Sparkles, ShieldCheck, Wrench, Calendar, Bell, LayoutDashboard, Home,
  ChevronRight, ArrowRight 
} from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Paragraph, Subheading } from "@/components/ui/typography";

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const featureCards: FeatureCard[] = [
  {
    title: "AI-Assisted Diagnostics",
    description: "Describe appliance or home issues and receive structured troubleshooting guidance instantly.",
    icon: Sparkles,
    href: "#features",
  },
  {
    title: "Home & Appliance Management",
    description: "Maintain a centralized, organized view of rooms, appliances, and important home assets.",
    icon: Home,
    href: "#features",
  },
  {
    title: "Warranty & Document Vault",
    description: "Store and organize appliance-related warranty information, invoices, and documents securely.",
    icon: ShieldCheck,
    href: "#features",
  },
  {
    title: "Maintenance Reminders",
    description: "Keep track of recurring maintenance checklists and get notified of upcoming appliance care.",
    icon: Bell,
    href: "#features",
  },
  {
    title: "Service Booking",
    description: "Request professional home services from certified technicians through the Dwellix workflow.",
    icon: Wrench,
    href: "#features",
  },
  {
    title: "Smart Home Dashboard",
    description: "Get a consolidated view of your home's active health metrics, coverages, and recent status updates.",
    icon: LayoutDashboard,
    href: "#features",
  },
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

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export function FeaturesGrid() {
  return (
    <Section id="features" variant="secondary" spacing="lg" className="bg-secondary border-t border-border/40 overflow-hidden scroll-mt-28">
      <Container>
        <motion.div
          variants={sectionRevealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          className="flex flex-col gap-16 items-center w-full"
        >
          {/* Header Block */}
          <div className="max-w-2xl text-center flex flex-col gap-4">
            <Heading level="h2" align="center" className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              Everything You Need. <br />
              One Platform.
            </Heading>
            <Subheading className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Powerful tools designed to simplify every aspect of home management.
            </Subheading>
          </div>

          {/* 8-Card Responsive Grid */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl"
          >
            {featureCards.map((feat) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  variants={cardVariants}
                  whileHover={{ y: -4, borderColor: "rgba(232, 93, 63, 0.4)" }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-start gap-4 p-6 rounded-xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  {/* Icon block (Rotate/Scale on hover) */}
                  <motion.div 
                    whileHover={{ rotate: 10, scale: 1.05 }}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/5 text-primary border border-primary/10 transition-colors"
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </motion.div>
                  
                  {/* Info Text */}
                  <div className="flex flex-col gap-1.5 flex-grow">
                    <h3 className="font-heading font-bold text-base text-foreground tracking-tight">
                      {feat.title}
                    </h3>
                    <Paragraph className="text-xs leading-relaxed text-muted-foreground font-normal">
                      {feat.description}
                    </Paragraph>
                  </div>
                  
                  {/* Learn More link */}
                  <a 
                    href={feat.href} 
                    className="text-xs font-semibold text-primary/80 group-hover:text-primary inline-flex items-center gap-0.5 mt-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-xs"
                    aria-label={`Learn more about ${feat.title}`}
                  >
                    Learn More
                    <ChevronRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </a>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Full-width Premium CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            className="w-full max-w-5xl bg-card border border-border rounded-2xl p-8 md:p-10 shadow-md flex flex-col md:flex-row items-center justify-between gap-8 text-left"
          >
            {/* Left CTA text */}
            <div className="flex flex-col gap-2 max-w-xl text-center md:text-left">
              <Heading level="h3" className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Ready to manage your home smarter?
              </Heading>
              <Paragraph className="text-sm leading-relaxed text-muted-foreground font-normal">
                Join Dwellix and keep everything organized in one intelligent platform.
              </Paragraph>
            </div>
            
            {/* Right CTA Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto shrink-0">
              <Link href="/auth/signup" passHref className="w-full sm:w-auto">
                <Button className="font-semibold w-full sm:w-auto h-[48px] px-6 text-sm gap-1.5 group shadow-xs">
                  Get Started
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Button variant="outline" className="font-semibold w-full sm:w-auto h-[48px] px-6 text-sm bg-transparent border-border/80 text-muted-foreground hover:text-foreground">
                View Demo
              </Button>
            </div>
          </motion.div>
        </motion.div>

      </Container>
    </Section>
  );
}
