import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { 
  BookOpen, Home, PlusCircle, FileText, Sparkles, Wrench, Shield, ArrowRight 
} from "lucide-react";

export const metadata: Metadata = {
  title: "Dwellix | Resources & Guides",
  description: "Learn how to manage your home, track warranties, diagnose appliance issues, and navigate Dwellix features.",
};

const guides = [
  {
    category: "Getting Started",
    title: "Getting Started with Dwellix",
    description: "Welcome to Dwellix! Learn how to create your profile, verify your email, and take your first steps in centralizing your household data.",
    icon: BookOpen,
  },
  {
    category: "Home Setup",
    title: "Setting Up Your Home",
    description: "Learn how to define your home coordinates, add basic building metadata, and prepare your account for appliance tracking.",
    icon: Home,
  },
  {
    category: "Inventory",
    title: "Adding Rooms and Appliances",
    description: "A step-by-step guide to dividing your home into functional rooms and adding appliances with serial numbers, brands, and categories.",
    icon: PlusCircle,
  },
  {
    category: "Documents",
    title: "Managing Appliance Records",
    description: "Keep invoices, digital receipts, and warranty details securely stored. Learn how to parse purchase details and set up notifications.",
    icon: FileText,
  },
  {
    category: "AI Diagnosis",
    title: "Understanding AI-Assisted Diagnostics",
    description: "Discover how the Dwellix AI diagnostic engine analyzes error codes, symptom descriptions, and active status reports to suggest solutions.",
    icon: Sparkles,
  },
  {
    category: "Service Booking",
    title: "Booking a Home Service",
    description: "Learn how to connect with certified local technicians, coordinate schedules, check pricing baselines, and monitor bookings from your panel.",
    icon: Wrench,
  },
  {
    category: "Account & Security",
    title: "Account and Security",
    description: "Guides on managing credentials, updating email verification status, managing active login sessions, and troubleshooting passwords.",
    icon: Shield,
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />

      {/* Hero Header */}
      <main className="flex-grow max-w-[1280px] mx-auto px-8 pt-36 pb-24 w-full">
        <div className="flex flex-col gap-4 text-left max-w-3xl mb-16">
          <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary-soft px-3 py-1 rounded-full self-start">
            Knowledge Base
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Resources & Product Guides
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Find simple documentation and guides on organizing your home, tracking warranties, and leveraging Dwellix's smart diagnostic workflows.
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {guides.map((guide, idx) => {
            const Icon = guide.icon;
            return (
              <div 
                key={idx}
                className="flex flex-col justify-between p-6 bg-card border border-border rounded-[24px] shadow-sm transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/5 rounded-md px-2 py-1">
                      {guide.category}
                    </span>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-heading font-bold text-base text-foreground tracking-tight">
                      {guide.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {guide.description}
                    </p>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-border mt-6 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-muted-foreground/80">Guide Summary</span>
                  <span className="text-[11px] font-bold text-primary inline-flex items-center gap-1">
                    Ready to read
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Card */}
        <div className="mt-16 bg-card border border-border rounded-[28px] p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 text-left">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Need additional support?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              If you have operational questions or technical issues, you can submit inquiries directly to our support desk.
            </p>
          </div>
          <Link href="mailto:support@dwellix.com" className="shrink-0 w-full md:w-auto">
            <button className="w-full md:w-auto h-12 px-6 rounded-xl bg-primary text-white hover:bg-primary-hover font-bold text-sm transition-colors shadow-sm cursor-pointer">
              Contact Support
            </button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
