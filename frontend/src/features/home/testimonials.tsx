"use client";

import * as React from "react";
import { 
  Home, Wrench, Heart, Star, Lock, 
  Database, UserCheck, Sparkles 
} from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/ui/heading";
import { Paragraph, Subheading } from "@/components/ui/typography";
import { Counter } from "@/components/ui/counter";

interface StatItem {
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const stats: StatItem[] = [
  { value: 25000, suffix: "+", label: "Homes Managed", icon: Home },
  { value: 12000, suffix: "+", label: "Verified Service Bookings", icon: Wrench },
  { value: 98, suffix: "%", label: "Customer Satisfaction", icon: Heart },
  { value: 4.9, decimals: 1, suffix: "/5", label: "Average User Rating", icon: Star },
];

interface TestimonialItem {
  name: string;
  role: string;
  review: string;
  initials: string;
  gradient: string;
}

const testimonials: TestimonialItem[] = [
  {
    name: "Rahul Sharma",
    role: "Homeowner",
    review: "Dwellix helped me organize every appliance, invoice and warranty in one place. The AI diagnosis even saved me an unnecessary repair visit.",
    initials: "RS",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    name: "Ananya Gupta",
    role: "Apartment Owner",
    review: "I no longer worry about losing warranty papers or forgetting maintenance schedules. Everything is available in seconds.",
    initials: "AG",
    gradient: "from-emerald-400 to-teal-600",
  },
  {
    name: "Amit Verma",
    role: "Working Professional",
    review: "Booking technicians is incredibly smooth, and the maintenance history gives me complete confidence in managing my home.",
    initials: "AV",
    gradient: "from-purple-500 to-pink-600",
  },
];

interface TrustBadge {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const trustBadges: TrustBadge[] = [
  { label: "Secure Authentication", icon: Lock },
  { label: "Encrypted Data", icon: Database },
  { label: "Verified Technicians", icon: UserCheck },
  { label: "AI Powered Assistance", icon: Sparkles },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
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

export function Testimonials() {
  return (
    <Section id="testimonials" variant="secondary" spacing="lg" className="bg-slate-50 border-t border-border/40 overflow-hidden">
      <Container className="flex flex-col gap-16 items-center">
        
        {/* Top Stats Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ y: -4, borderColor: "rgba(37,99,235,0.3)" }}
                className="flex flex-col items-center lg:items-start p-6 rounded-xl border border-border bg-white shadow-xs hover:shadow-md transition-all duration-300 select-none text-center lg:text-left"
              >
                {/* Subtle Icon Rotate/Scale Hover interaction */}
                <motion.div 
                  whileHover={{ rotate: 10, scale: 1.05 }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/5 text-primary border border-primary/10 mb-4 transition-colors"
                >
                  <Icon className="h-4.5 w-4.5" />
                </motion.div>
                
                {/* Counting stats number */}
                <span className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight leading-none">
                  <Counter 
                    value={stat.value} 
                    decimals={stat.decimals} 
                    suffix={stat.suffix} 
                  />
                </span>
                
                <span className="text-xs text-muted-foreground font-semibold leading-normal mt-2">
                  {stat.label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Heading Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="max-w-2xl text-center flex flex-col gap-4"
        >
          <Heading level="h2" align="center" className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Trusted by homeowners who value peace of mind.
          </Heading>
          <Subheading className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Thousands of homeowners rely on Dwellix to organize their homes, manage appliances and book trusted professionals.
          </Subheading>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 w-full max-w-6xl"
        >
          {testimonials.map((test) => (
            <motion.div
              key={test.name}
              variants={itemVariants}
              whileHover={{ y: -4, borderColor: "rgba(37,99,235,0.4)" }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5 p-6 rounded-xl border border-border bg-white text-card-foreground shadow-xs hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-0.5 text-warning">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>

              <blockquote className="text-sm leading-relaxed text-muted-foreground font-normal italic flex-grow">
                &ldquo;{test.review}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3 pt-3 border-t border-border/40 shrink-0">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${test.gradient} text-sm font-extrabold text-white shadow-inner`}>
                  {test.initials}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-heading font-bold text-sm text-foreground leading-tight">{test.name}</span>
                  <span className="text-[10px] text-muted-foreground font-semibold leading-tight">{test.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Trust Badges Strip */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="w-full max-w-5xl border border-border/60 bg-white rounded-2xl py-6 px-8 flex flex-col md:flex-row flex-wrap items-center justify-around gap-6 shadow-xs"
        >
          {trustBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div key={badge.label} className="flex items-center gap-2.5 text-sm text-muted-foreground font-semibold">
                <motion.div 
                  whileHover={{ rotate: 10, scale: 1.05 }}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/5 text-primary border border-primary/10 shrink-0"
                >
                  <Icon className="h-4 w-4" />
                </motion.div>
                <span>{badge.label}</span>
              </div>
            );
          })}
        </motion.div>

      </Container>
    </Section>
  );
}
