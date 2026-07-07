"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { Paragraph } from "@/components/ui/typography";

const trustItems = [
  "AI-Powered Diagnosis",
  "Secure Digital Records",
  "Trusted Service Marketplace"
];

// Reusable stagger animation container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

// Reusable child item animations
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const, // Cast as const to enforce tuple type for cubic-bezier
    },
  },
};

export function Hero() {
  return (
    <Section variant="default" spacing="lg" className="pt-32 md:pt-40 pb-20 md:pb-28 overflow-hidden min-h-screen flex items-center bg-white">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Text Content Column */}
          <motion.div 
            className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left gap-6 z-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Small Badge */}
            <motion.div variants={itemVariants}>
              <Badge variant="info" className="px-3 py-1 text-xs font-semibold tracking-wide border-blue-500/10">
                AI-Powered Home Management
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <motion.div variants={itemVariants}>
              <Heading level="h1" className="font-heading font-extrabold tracking-tight text-foreground leading-[1.08]">
                Your Home. <br />
                <span className="text-primary">Smarter Every Day.</span>
              </Heading>
            </motion.div>

            {/* Subheading */}
            <motion.div variants={itemVariants}>
              <Paragraph className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed font-normal max-w-xl">
                Manage appliances, warranties, invoices, maintenance, AI diagnosis, technician bookings, and home history — all in one intelligent platform.
              </Paragraph>
            </motion.div>

            {/* CTA Buttons - Increased height to 54px */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link href="/auth/signup" passHref className="w-full sm:w-auto">
                <Button className="font-semibold w-full sm:w-auto h-[54px] px-8 text-base gap-1.5 group">
                  Get Started
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Button variant="outline" className="font-semibold w-full sm:w-auto h-[54px] px-8 text-base gap-2 bg-transparent text-muted-foreground hover:text-foreground">
                <Play className="h-4 w-4 fill-current text-current" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Premium Pill Badges Section */}
            <motion.div 
              variants={itemVariants} 
              className="flex flex-col sm:flex-row flex-wrap items-center gap-3 pt-6 border-t border-border/60 w-full justify-center lg:justify-start"
            >
              {trustItems.map((item) => (
                <motion.div 
                  key={item}
                  whileHover={{ scale: 1.02, y: -1 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/80 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/20 hover:bg-primary/5 transition-all cursor-default"
                >
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-success/15 text-success shrink-0">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <span>{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Image Illustration Column - Moved 80px closer using -ml-20 on desktop */}
          <div className="lg:col-span-6 relative w-full flex items-center justify-center lg:-ml-20">
            
            {/* Subtle Blue Radial Gradient background behind illustration only */}
            <div 
              className="absolute w-[120%] aspect-square -z-10 rounded-full bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08)_0%,transparent_70%)] pointer-events-none"
              aria-hidden="true"
            />

            {/* Float and Fade-in Animation container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay: 0.2 }}
              className="w-full max-w-[500px] lg:max-w-none px-4"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 6, // Slower, smoother float
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative w-full aspect-[4/3] sm:aspect-square lg:aspect-[4/3]"
              >
                <Image
                  src="/images/hero-illustration-v1.webp"
                  alt="Dwellix Smart Home Management Illustration"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  className="object-contain"
                />
              </motion.div>
            </motion.div>
          </div>

        </div>
      </Container>
    </Section>
  );
}
