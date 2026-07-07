"use client";

import * as React from "react";
import { Shield, Folder, UserCheck, CalendarClock } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/ui/heading";
import { Subheading, Paragraph } from "@/components/ui/typography";

interface ProblemCard {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const problemCards: ProblemCard[] = [
  {
    title: "Lost Warranties",
    description: "Important warranty documents disappear when you need them most.",
    icon: Shield,
  },
  {
    title: "Scattered Home Records",
    description: "Invoices, appliance details and maintenance history are spread across multiple places.",
    icon: Folder,
  },
  {
    title: "Finding Trusted Technicians",
    description: "Searching for reliable service providers every time is frustrating and time-consuming.",
    icon: UserCheck,
  },
  {
    title: "Missed Maintenance",
    description: "Forgotten servicing leads to costly repairs and shorter appliance life.",
    icon: CalendarClock,
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
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export function Problem() {
  return (
    <Section id="problem" variant="default" spacing="lg" className="bg-white border-t border-border/40 overflow-hidden">
      <Container>
        <motion.div
          variants={sectionRevealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          className="flex flex-col gap-16 items-center w-full"
        >
          {/* Centered Heading */}
          <div className="max-w-3xl text-center flex flex-col gap-4">
            <Heading level="h2" align="center" className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              Managing a Home Shouldn&apos;t Feel Like a Full-Time Job.
            </Heading>
            <Subheading className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Homeowners waste time juggling repairs, warranties, invoices and finding reliable technicians. Dwellix brings everything together into one intelligent platform.
            </Subheading>
          </div>

          {/* 2x2 Grid of Premium Cards */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 w-full max-w-5xl"
          >
            {problemCards.map((card) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  variants={cardVariants}
                  whileHover={{ y: -4, borderColor: "rgba(37,99,235,0.4)" }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-start gap-4 p-6 rounded-xl border border-border bg-card text-card-foreground shadow-xs hover:shadow-md transition-all duration-300 group"
                >
                  {/* Top Icon Wrapper (Subtle rotate on hover) */}
                  <motion.div 
                    whileHover={{ rotate: 8, scale: 1.05 }}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 text-primary border border-primary/10 transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                  </motion.div>
                  
                  {/* Title */}
                  <h3 className="font-heading font-bold text-lg text-foreground tracking-tight">
                    {card.title}
                  </h3>
                  
                  {/* Description */}
                  <Paragraph className="text-sm leading-relaxed text-muted-foreground font-normal">
                    {card.description}
                  </Paragraph>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Transition statement */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center pt-4"
          >
            <p className="font-heading text-lg md:text-xl font-bold tracking-tight text-foreground/95">
              That&apos;s why we built <span className="text-primary">Dwellix</span>.
            </p>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
