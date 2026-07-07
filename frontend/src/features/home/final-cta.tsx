"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Paragraph } from "@/components/ui/typography";

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

export function FinalCTA() {
  return (
    <Section id="final-cta" variant="default" spacing="lg" className="bg-white border-t border-border/40 overflow-hidden">
      <Container>
        <motion.div
          variants={sectionRevealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          className="w-full"
        >
          {/* Rounded Primary Blue Card */}
          <div className="relative w-full bg-primary text-primary-foreground rounded-3xl p-8 md:p-16 text-center overflow-hidden shadow-lg select-none border border-blue-600/20">
            {/* Subtle glow accents */}
            <div 
              className="absolute top-0 right-0 w-[500px] aspect-square rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_70%)] pointer-events-none -z-10"
              aria-hidden="true"
            />
            <div 
              className="absolute bottom-0 left-0 w-[400px] aspect-square rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0%,transparent_70%)] pointer-events-none -z-10"
              aria-hidden="true"
            />

            <div className="max-w-3xl mx-auto flex flex-col items-center gap-6 z-10 relative">
              {/* Title */}
              <Heading level="h2" align="center" className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] text-white">
                Your Home Deserves Better Management.
              </Heading>
              
              {/* Description */}
              <Paragraph className="text-base sm:text-lg text-blue-100 leading-relaxed max-w-xl mx-auto font-normal">
                Join thousands of homeowners using Dwellix to organize appliances, warranties, maintenance and technician bookings in one intelligent platform.
              </Paragraph>

              {/* CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto pt-4">
                <Button className="w-full sm:w-auto h-[50px] px-8 text-sm font-semibold bg-white text-primary hover:bg-blue-50 transition-colors border border-transparent shadow-xs gap-1.5 group">
                  Create Free Account
                  <ArrowRight className="h-4 w-4 text-primary transition-transform duration-200 group-hover:translate-x-0.5" />
                </Button>
                <Button className="w-full sm:w-auto h-[50px] px-8 text-sm font-semibold bg-transparent border border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all">
                  Book Demo
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
