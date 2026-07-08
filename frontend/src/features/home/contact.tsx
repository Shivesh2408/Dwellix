"use client";

import * as React from "react";
import { MapPin, Phone, Mail, Clock, Send, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Paragraph, Subheading } from "@/components/ui/typography";

// Section reveal variants
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

export function Contact() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = React.useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    // Simulate brief latency
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setStatus("success");
    setFormData({ name: "", email: "", subject: "", message: "" });
    
    // Reset status back to idle after 5 seconds
    setTimeout(() => {
      setStatus("idle");
    }, 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Section id="contact" variant="default" spacing="sm" className="bg-slate-50 border-t border-border/40 overflow-hidden">
      <Container>
        <motion.div
          variants={sectionRevealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          className="flex flex-col gap-10 items-center w-full"
        >
          {/* Header Block */}
          <div className="max-w-2xl text-center flex flex-col gap-3">
            <Heading level="h2" align="center" className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              Contact Us
            </Heading>
            <Subheading className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Have questions? We&apos;d love to hear from you.
            </Subheading>
          </div>

          {/* Grid Container */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 w-full max-w-6xl items-start">
            {/* Left Column: Contact Cards */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              
              {/* Address card */}
              <div className="flex items-start gap-4 p-5 rounded-xl border border-border bg-white shadow-xs">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary border border-primary/10">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-heading font-bold text-sm text-foreground">Address</span>
                  <span className="text-xs text-muted-foreground leading-relaxed font-semibold">
                    123 Smart Home Ave, Suite 100<br />Silicon Valley, CA 94025
                  </span>
                </div>
              </div>

              {/* Phone card */}
              <div className="flex items-start gap-4 p-5 rounded-xl border border-border bg-white shadow-xs">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary border border-primary/10">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-heading font-bold text-sm text-foreground">Phone</span>
                  <a href="tel:+919876543210" className="text-xs text-primary hover:underline font-semibold">
                    +91-9876543210
                  </a>
                </div>
              </div>

              {/* Email card */}
              <div className="flex items-start gap-4 p-5 rounded-xl border border-border bg-white shadow-xs">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary border border-primary/10">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-heading font-bold text-sm text-foreground">Email</span>
                  <a href="mailto:support@dwellix.com" className="text-xs text-primary hover:underline font-semibold">
                    support@dwellix.com
                  </a>
                </div>
              </div>

              {/* Support Hours card */}
              <div className="flex items-start gap-4 p-5 rounded-xl border border-border bg-white shadow-xs">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary border border-primary/10">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-heading font-bold text-sm text-foreground">Support Hours</span>
                  <span className="text-xs text-muted-foreground leading-relaxed font-semibold">
                    Mon–Sat: 9:00 AM – 7:00 PM<br />Sunday: Closed
                  </span>
                </div>
              </div>

            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-3 p-6 sm:p-8 rounded-xl border border-border bg-white shadow-xs">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Name</label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="bg-slate-50 border border-border text-sm h-11 px-3.5 rounded-lg text-foreground placeholder-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="bg-slate-50 border border-border text-sm h-11 px-3.5 rounded-lg text-foreground placeholder-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-subject" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Subject</label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className="bg-slate-50 border border-border text-sm h-11 px-3.5 rounded-lg text-foreground placeholder-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-message" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message here..."
                    className="bg-slate-50 border border-border text-sm p-3.5 rounded-lg text-foreground placeholder-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="rounded-full font-bold h-11 text-sm bg-primary text-white hover:bg-primary/95 cursor-pointer mt-2"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="h-4 w-4 shrink-0 text-white" />
                    </>
                  )}
                </Button>

                {status === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                    <span>Thank you for contacting Dwellix. We&apos;ll get back to you shortly.</span>
                  </motion.div>
                )}
              </form>
            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
