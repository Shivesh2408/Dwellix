"use client";

import * as React from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/ui/heading";
import { Subheading } from "@/components/ui/typography";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is Dwellix?",
    answer: "Dwellix is an AI-powered home management platform that centralizes warranties, invoices, appliance tracking, and technician services. It acts as an intelligent digital brain for your home's upkeep and maintenance.",
  },
  {
    question: "How does AI diagnosis work?",
    answer: "Using our integrated Gemini API model, you can specify appliance symptoms in natural language. The assistant analyzes user reports, asks smart follow-up questions to isolate faults, and provides diagnostic codes, price guides, and repair recommendations.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes. All appliance records, warranty paperwork, invoices, and user metrics are protected with enterprise-grade AES-256 encryption. We utilize industry-standard JWT protocols to authenticate and safeguard user records.",
  },
  {
    question: "Can I manage multiple homes?",
    answer: "Multiple home setups are supported on our Family Pro tier. You can switch between active properties in your dashboard, invite co-owners, and separate billing, scheduling, and invoice storage records by home location.",
  },
  {
    question: "How do technician bookings work?",
    answer: "Dwellix matches you with vetted local appliance service technicians. Select your issue, choose from available slots, lock in upfront rates, and track the status and live location of your technician as they head to your home.",
  },
  {
    question: "Can I upload invoices and warranties?",
    answer: "Absolutely. The digital Warranty Vault and Invoice Vault let you drag and drop files (PDFs, images) directly from mobile or desktop. Dwellix indexes document details and monitors expiry timelines in real time.",
  },
  {
    question: "Will Dwellix remind me about maintenance?",
    answer: "Yes, our automated scheduling system reviews appliance diagnostics and logs to prompt reminders (filter cleaning, hardware checks, general tune-ups) before minor problems become expensive breakdowns.",
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

export function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section id="faq" variant="secondary" spacing="lg" className="bg-slate-50 border-t border-border/40 overflow-hidden">
      <Container className="flex flex-col gap-12 items-center">
        
        <motion.div
          variants={sectionRevealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          className="flex flex-col gap-12 items-center w-full"
        >
          {/* Header Block */}
          <div className="max-w-2xl text-center flex flex-col gap-4">
            <Heading level="h2" align="center" className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              Frequently Asked Questions
            </Heading>
            <Subheading className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Everything you need to know about Dwellix home management services.
            </Subheading>
          </div>

          {/* Accessible Accordion List */}
          <div className="w-full max-w-3xl flex flex-col gap-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={faq.question} 
                  className="bg-white rounded-xl border border-border/60 overflow-hidden shadow-xs hover:border-border transition-colors duration-200"
                >
                  {/* Accordion Trigger button */}
                  <button
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left font-heading font-bold text-sm sm:text-base text-foreground focus-visible:outline-none focus-visible:bg-slate-50/50 hover:bg-slate-50/30 transition-colors"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    id={`faq-trigger-${index}`}
                  >
                    <span className="pr-4">{faq.question}</span>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-50 text-muted-foreground shrink-0 border border-border/10">
                      {isOpen ? (
                        <Minus className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Accordion Content */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${index}`}
                        role="region"
                        aria-labelledby={`faq-trigger-${index}`}
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm leading-relaxed text-muted-foreground font-normal border-t border-border/10">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>

      </Container>
    </Section>
  );
}
