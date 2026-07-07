"use client";

import * as React from "react";
import { Sparkles, MessageSquare, HelpCircle, Tag, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Paragraph } from "@/components/ui/typography";
import { Counter } from "@/components/ui/counter";

interface FeatureItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const features: FeatureItem[] = [
  { label: "AI Diagnosis", icon: Sparkles },
  { label: "Smart Follow-up Questions", icon: HelpCircle },
  { label: "Repair Cost Estimation", icon: Tag },
  { label: "Service Recommendation", icon: CheckCircle2 },
  { label: "Conversation History", icon: MessageSquare },
  { label: "Instant Assistance", icon: Zap },
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

// Motion animation variations
const chatContainerVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const chatBubbleVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const contentVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const statContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const statItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export function AIShowcase() {
  return (
    <Section id="ai-showcase" variant="default" spacing="lg" className="bg-white border-t border-border/40 overflow-hidden">
      <Container>
        <motion.div
          variants={sectionRevealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          className="w-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Premium AI Chat Mockup */}
            <motion.div 
              className="lg:col-span-6 w-full flex justify-center z-10"
              variants={chatContainerVariants}
            >
              {/* Chat Box Wrapper */}
              <div className="w-full max-w-[480px] bg-slate-50 border border-border/60 rounded-2xl shadow-xl flex flex-col font-sans select-none overflow-hidden h-[540px]">
                
                {/* Chat Header */}
                <div className="bg-white border-b border-border/40 px-5 py-4 flex items-center gap-3">
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 border border-primary/5">
                    <Sparkles className="h-4 w-4" />
                    <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-success ring-2 ring-white" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-heading font-bold text-xs text-foreground">Gemini Appliance Advisor</span>
                    <span className="text-[10px] text-muted-foreground font-medium">Diagnostic Assistant</span>
                  </div>
                </div>

                {/* Chat Conversation Scroll area */}
                <div className="flex-1 p-5 flex flex-col gap-4 overflow-y-auto">
                  
                  {/* Message 1: User */}
                  <motion.div variants={chatBubbleVariants} className="flex flex-col gap-1 max-w-[85%] self-end items-end">
                    <div className="bg-primary text-primary-foreground px-4 py-2.5 rounded-2xl rounded-tr-xs text-xs font-normal leading-relaxed text-left shadow-xs">
                      My washing machine is making a loud noise while spinning.
                    </div>
                    <span className="text-[9px] text-muted-foreground mr-1">Just now</span>
                  </motion.div>

                  {/* Message 2: AI Assistant */}
                  <motion.div variants={chatBubbleVariants} className="flex gap-2.5 max-w-[85%] items-start">
                    <div className="h-7 w-7 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/5 mt-1">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="bg-white border border-border/40 text-foreground px-4 py-2.5 rounded-2xl rounded-tl-xs text-xs font-normal leading-relaxed text-left shadow-xs">
                        I can help diagnose that. <br /><br />
                        A few quick questions:<br />
                        • Does the noise happen every cycle?<br />
                        • Is the drum overloaded?<br />
                        • Do you notice any water leakage?
                      </div>
                      <span className="text-[9px] text-muted-foreground ml-1">Just now</span>
                    </div>
                  </motion.div>

                  {/* Message 3: User */}
                  <motion.div variants={chatBubbleVariants} className="flex flex-col gap-1 max-w-[85%] self-end items-end">
                    <div className="bg-primary text-primary-foreground px-4 py-2.5 rounded-2xl rounded-tr-xs text-xs font-normal leading-relaxed text-left shadow-xs">
                      No leakage. Noise only during spinning.
                    </div>
                    <span className="text-[9px] text-muted-foreground mr-1">Just now</span>
                  </motion.div>

                  {/* Message 4: AI Diagnosis Card */}
                  <motion.div variants={chatBubbleVariants} className="flex gap-2.5 max-w-[90%] items-start">
                    <div className="h-7 w-7 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/5 mt-1">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      
                      {/* Diagnosis Result Card */}
                      <div className="bg-white border border-primary/10 rounded-2xl rounded-tl-xs p-4 flex flex-col gap-3 shadow-md text-left">
                        
                        {/* Badge Header */}
                        <div className="flex items-center justify-between border-b border-border/40 pb-2">
                          <span className="font-heading font-bold text-xs text-foreground flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-primary" />
                            AI Diagnosis
                          </span>
                          <Badge variant="success" className="text-[9px] font-bold py-0.5 px-2">91% Confidence</Badge>
                        </div>
                        
                        {/* Analysis Details */}
                        <div className="flex flex-col gap-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Possible Cause</span>
                            <span className="font-bold text-foreground">Loose Drum Bearing</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Estimated Repair Cost</span>
                            <span className="font-bold text-foreground text-primary">₹1,200 – ₹2,000</span>
                          </div>
                          <div className="flex flex-col gap-0.5 pt-1">
                            <span className="text-muted-foreground">Recommended Action</span>
                            <span className="font-semibold text-foreground">Schedule a technician within the next 3 days.</span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <Button className="w-full h-8 text-[11px] font-bold mt-1 shadow-xs">
                          Book Technician
                        </Button>

                      </div>
                      <span className="text-[9px] text-muted-foreground ml-1">Just now</span>
                    </div>
                  </motion.div>

                </div>

              </div>
            </motion.div>

            {/* Right Column: Information & Stats */}
            <motion.div 
              className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left gap-6"
              variants={contentVariants}
            >
              {/* Small Badge */}
              <Badge variant="info" className="px-3 py-1 text-xs font-semibold tracking-wide border-blue-500/10">
                AI Powered Assistance
              </Badge>

              {/* Heading */}
              <Heading level="h2" className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                Diagnose Problems Before You Spend Money.
              </Heading>

              {/* Description */}
              <Paragraph className="text-base text-muted-foreground leading-relaxed max-w-xl">
                Describe your appliance issue in plain language. Dwellix AI analyzes the symptoms, asks intelligent follow-up questions, estimates repair costs and recommends the right service before you book anyone.
              </Paragraph>

              {/* Features Bullet List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full pt-2">
                {features.map((feat) => {
                  const Icon = feat.icon;
                  return (
                    <div key={feat.label} className="flex items-center gap-2.5 text-sm text-foreground/90 font-medium justify-center lg:justify-start group">
                      <motion.div 
                        whileHover={{ rotate: 10, scale: 1.05 }}
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/5 text-primary border border-primary/10 shrink-0 transition-colors"
                      >
                        <Icon className="h-4 w-4" />
                      </motion.div>
                      <span>{feat.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Three Premium Statistic Cards with count-up animations */}
              <motion.div 
                className="grid grid-cols-3 gap-3.5 w-full pt-4"
                variants={statContainerVariants}
              >
                {/* Stat 1: 91% */}
                <motion.div 
                  variants={statItemVariants}
                  whileHover={{ y: -3, borderColor: "rgba(37,99,235,0.25)" }}
                  className="flex flex-col items-center lg:items-start p-3.5 border border-border bg-slate-50/50 rounded-xl shadow-xs transition-all duration-300 select-none text-center lg:text-left"
                >
                  <span className="font-heading font-extrabold text-lg sm:text-2xl text-primary tracking-tight">
                    <Counter value={91} suffix="%" />
                  </span>
                  <span className="text-[10px] text-muted-foreground font-semibold leading-normal mt-0.5">Diagnosis Accuracy</span>
                </motion.div>

                {/* Stat 2: 30 sec */}
                <motion.div 
                  variants={statItemVariants}
                  whileHover={{ y: -3, borderColor: "rgba(37,99,235,0.25)" }}
                  className="flex flex-col items-center lg:items-start p-3.5 border border-border bg-slate-50/50 rounded-xl shadow-xs transition-all duration-300 select-none text-center lg:text-left"
                >
                  <span className="font-heading font-extrabold text-lg sm:text-2xl text-primary tracking-tight">
                    <Counter value={30} suffix=" sec" />
                  </span>
                  <span className="text-[10px] text-muted-foreground font-semibold leading-normal mt-0.5">Avg Response Time</span>
                </motion.div>

                {/* Stat 3: 24/7 */}
                <motion.div 
                  variants={statItemVariants}
                  whileHover={{ y: -3, borderColor: "rgba(37,99,235,0.25)" }}
                  className="flex flex-col items-center lg:items-start p-3.5 border border-border bg-slate-50/50 rounded-xl shadow-xs transition-all duration-300 select-none text-center lg:text-left"
                >
                  <span className="font-heading font-extrabold text-lg sm:text-2xl text-primary tracking-tight">24/7</span>
                  <span className="text-[10px] text-muted-foreground font-semibold leading-normal mt-0.5">AI Availability</span>
                </motion.div>
              </motion.div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-4">
                <Button className="font-semibold w-full sm:w-auto gap-1.5 group">
                  Try AI Assistant
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Button>
                <Button variant="outline" className="font-semibold w-full sm:w-auto bg-transparent text-muted-foreground hover:text-foreground border-border/80">
                  Learn More
                </Button>
              </div>

            </motion.div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
