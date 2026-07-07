"use client";

import * as React from "react";
import { Home, Folder, Sparkles, CalendarDays, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Paragraph, Subheading } from "@/components/ui/typography";

interface StepItem {
  number: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const steps: StepItem[] = [
  {
    number: "01",
    title: "Create Your Home",
    description: "Sign up and add your home, rooms and appliances in just a few minutes.",
    icon: Home,
  },
  {
    number: "02",
    title: "Organize Everything",
    description: "Store invoices, warranties and appliance information securely in one place.",
    icon: Folder,
  },
  {
    number: "03",
    title: "Ask Dwellix AI",
    description: "Describe any appliance issue and receive an instant diagnosis with intelligent questions.",
    icon: Sparkles,
  },
  {
    number: "04",
    title: "Book a Technician",
    description: "Choose a verified technician, schedule a visit and track the booking live.",
    icon: CalendarDays,
  },
  {
    number: "05",
    title: "Maintain Your Home",
    description: "Receive reminders, monitor your Health Score and access history anytime.",
    icon: ShieldCheck,
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

// Animation configs
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export function HowItWorks() {
  return (
    <Section id="how-it-works" variant="default" spacing="lg" className="bg-white border-t border-border/40 overflow-hidden">
      <Container className="flex flex-col gap-16 items-center">
        
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
              How Dwellix Works
            </Heading>
            <Subheading className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              From setting up your home to booking trusted technicians, everything happens in a few simple steps.
            </Subheading>
          </div>

          {/* Timeline & Card Grid Wrapper */}
          <div className="relative w-full max-w-7xl flex justify-center py-4">
            
            {/* Desktop Horizontal Timeline Line */}
            <div className="absolute top-[2.25rem] left-[10%] right-[10%] h-0.5 bg-border/40 -z-10 hidden lg:block" aria-hidden="true">
              <motion.div
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] as const }}
                className="h-full bg-primary"
              />
            </div>

            {/* Tablet Vertical Timeline Line */}
            <div className="absolute top-10 bottom-10 left-[2.25rem] w-0.5 bg-border/40 -z-10 hidden md:block lg:hidden" aria-hidden="true">
              <motion.div
                initial={{ height: "0%" }}
                whileInView={{ height: "100%" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] as const }}
                className="w-full bg-primary"
              />
            </div>

            {/* Grid Container */}
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-6 w-full relative md:pl-16 lg:pl-0"
            >
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    variants={cardVariants}
                    className="flex flex-col items-center lg:items-stretch group relative text-center lg:text-left animate-in"
                  >
                    
                    {/* Step Icon circle (acts as node on timeline) */}
                    <div className="absolute md:-left-[2.85rem] lg:left-1/2 lg:-translate-x-1/2 top-0 lg:-top-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-border bg-white text-muted-foreground group-hover:border-primary group-hover:text-primary group-hover:scale-105 transition-all duration-300 shadow-xs z-10">
                      <Icon className="h-4.5 w-4.5" />
                    </div>

                    {/* Card Container */}
                    <motion.div
                      whileHover={{ y: -4, borderColor: "rgba(37,99,235,0.4)" }}
                      transition={{ duration: 0.2 }}
                      className="mt-6 md:mt-0 lg:mt-12 flex flex-col gap-3 p-5 rounded-xl border border-border bg-white text-card-foreground shadow-xs hover:shadow-md transition-all duration-300 w-full text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-primary bg-primary/5 border border-primary/10 rounded-md px-1.5 py-0.5">
                          Step {step.number}
                        </span>
                      </div>
                      <h3 className="font-heading font-bold text-base text-foreground tracking-tight">
                        {step.title}
                      </h3>
                      
                      <Paragraph className="text-xs leading-relaxed text-muted-foreground font-normal">
                        {step.description}
                      </Paragraph>
                    </motion.div>

                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Bottom CTA Block */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center flex flex-col gap-6 pt-10 items-center w-full"
          >
            <Heading level="h3" align="center" className="text-xl sm:text-2xl font-bold tracking-tight">
              Ready to experience smarter home management?
            </Heading>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Button className="font-semibold w-full sm:w-auto h-[48px] px-6 text-sm gap-1.5 group shadow-xs">
                Create Free Account
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
              <Button variant="outline" className="font-semibold w-full sm:w-auto h-[48px] px-6 text-sm bg-transparent border-border/80 text-muted-foreground hover:text-foreground">
                Explore Features
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
