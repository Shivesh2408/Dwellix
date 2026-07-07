"use client";

import * as React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Paragraph, Subheading } from "@/components/ui/typography";

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
}

const plans: PricingPlan[] = [
  {
    name: "FREE",
    price: "₹0",
    period: "/month",
    description: "Perfect for individuals getting started.",
    features: [
      "Manage one home",
      "Up to 20 appliances",
      "Warranty Vault",
      "Invoice Vault",
      "Basic AI Diagnosis",
      "Maintenance Timeline",
    ],
    buttonText: "Get Started",
  },
  {
    name: "SMART HOME",
    price: "₹299",
    period: "/month",
    description: "Ideal for comprehensive home coverage.",
    features: [
      "Everything in Free",
      "Unlimited appliances",
      "Advanced AI Diagnosis",
      "Priority technician booking",
      "Unlimited AI conversations",
      "Home Health Score",
      "Smart notifications",
    ],
    buttonText: "Start Smart Plan",
    isPopular: true,
  },
  {
    name: "FAMILY PRO",
    price: "₹599",
    period: "/month",
    description: "Best for multiple properties and families.",
    features: [
      "Everything in Smart Home",
      "Multiple homes",
      "Family members",
      "Shared appliance management",
      "Premium support",
      "Future smart home integrations",
    ],
    buttonText: "Contact Sales",
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

export function Pricing() {
  return (
    <Section id="pricing" variant="default" spacing="lg" className="bg-white border-t border-border/40 overflow-hidden">
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
              Simple Pricing. <br />
              No Surprises.
            </Heading>
            <Subheading className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Choose the plan that fits your home management needs.
            </Subheading>
          </div>

          {/* Pricing Cards Grid */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full max-w-6xl items-stretch"
          >
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`flex flex-col gap-6 p-6 sm:p-8 rounded-2xl border bg-white shadow-xs hover:shadow-md transition-all duration-300 relative ${
                  plan.isPopular 
                    ? "border-primary shadow-sm ring-1 ring-primary/10" 
                    : "border-border"
                }`}
              >
                {/* Popular / Recommended Badge */}
                {plan.isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold tracking-wider uppercase rounded-full px-3 py-1 border border-primary-foreground/10 shadow-sm">
                    Recommended
                  </span>
                )}

                {/* Plan Info */}
                <div className="flex flex-col gap-1.5 text-left">
                  <span className="text-[10px] font-bold text-primary tracking-wider uppercase">{plan.name}</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground tracking-tight">{plan.price}</span>
                    <span className="text-xs text-muted-foreground font-semibold">{plan.period}</span>
                  </div>
                  <Paragraph className="text-xs leading-relaxed text-muted-foreground mt-2 font-normal">
                    {plan.description}
                  </Paragraph>
                </div>

                {/* Call-to-Action Button */}
                <Link href="/auth/signup" passHref className="w-full">
                  <Button 
                    variant={plan.isPopular ? "default" : "outline"} 
                    className={`w-full font-bold text-xs h-10 shadow-xs ${
                      !plan.isPopular ? "border-border/80 text-muted-foreground hover:text-foreground hover:bg-slate-50" : ""
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                </Link>

                {/* Divider */}
                <div className="h-[1px] bg-border/40 w-full" />

                {/* Features List */}
                <ul className="flex flex-col gap-3 text-left flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-xs text-foreground/90 font-medium">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-success/10 text-success shrink-0 mt-0.5">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

              </motion.div>
            ))}
          </motion.div>
        </motion.div>

      </Container>
    </Section>
  );
}
