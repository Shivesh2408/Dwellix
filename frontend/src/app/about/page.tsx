import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { 
  ShieldCheck, Layout, Lock, Settings2, HelpCircle 
} from "lucide-react";

export const metadata: Metadata = {
  title: "Dwellix | About Us",
  description: "Learn about the mission, product principles, and design philosophy behind Dwellix.",
};

const principles = [
  {
    title: "Simple by default",
    description: "Interfaces should be clean, focused, and intuitive, preventing cognitive overload when organizing home metrics.",
    icon: Layout,
  },
  {
    title: "Useful automation",
    description: "Automate reminders, document categorization, and troubleshooting paths without adding unnecessary complexity.",
    icon: Settings2,
  },
  {
    title: "Clear user control",
    description: "Users retain full visibility and final authority over all household logs, data uploads, and technician bookings.",
    icon: HelpCircle,
  },
  {
    title: "Secure account workflows",
    description: "Strong encryption and authentication patterns ensure that address listings, appliance details, and credentials remain private.",
    icon: Lock,
  },
  {
    title: "Practical home management",
    description: "Build features that solve real household problems, such as tracking warranties and diagnosing hardware errors.",
    icon: ShieldCheck,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-[1280px] mx-auto px-8 pt-36 pb-24 w-full">
        
        {/* Header Block */}
        <div className="flex flex-col gap-4 text-left max-w-3xl mb-16">
          <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary-soft px-3 py-1 rounded-full self-start">
            Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            About Dwellix
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Organizing your household information shouldn't feel like a full-time job. Dwellix was created to unify scattered records into a single intelligent workspace.
          </p>
        </div>

        {/* Why Dwellix Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start py-12 border-t border-border">
          <div className="lg:col-span-4 text-left">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground uppercase">
              Why Dwellix
            </h2>
          </div>
          <div className="lg:col-span-8 text-left space-y-6 text-muted-foreground leading-relaxed text-sm font-medium">
            <p>
              Important home information is usually scattered across physical binders, email search threads, custom appliance apps, calendar reminders, and contact lists. When an appliance breaks down or a warranty expires, finding the right receipt or diagnosing the issue can take hours of stressful coordination.
            </p>
            <p>
              Dwellix resolves this fragmentation by establishing a centralized dashboard. It gives homeowners one structured place to track room configurations, register appliance assets, verify warranty coverage timelines, and access step-by-step diagnostic workflows.
            </p>
          </div>
        </div>

        {/* What We Are Building Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start py-12 border-t border-border">
          <div className="lg:col-span-4 text-left">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground uppercase">
              What We Are Building
            </h2>
          </div>
          <div className="lg:col-span-8 text-left space-y-6 text-muted-foreground leading-relaxed text-sm font-medium">
            <p>
              We are building a smart home registry that focuses on accessibility, utility, and user security. By leveraging AI-assisted diagnostics, Dwellix allows users to quickly describe error codes or functional symptoms and receive structured troubleshooting instructions before choosing to request professional service.
            </p>
            <p>
              Through clean UI layouts and minimal workflows, Dwellix simplifies the administrative overhead of maintaining a home, making homeownership a more manageable and organized experience.
            </p>
          </div>
        </div>

        {/* Product Principles Section */}
        <div className="py-12 border-t border-border text-left">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground mb-12 uppercase">
            Our Product Principles
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((principle, idx) => {
              const Icon = principle.icon;
              return (
                <div 
                  key={idx}
                  className="p-6 bg-card border border-border rounded-[24px] shadow-sm transition-all duration-300 space-y-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-heading font-bold text-base text-foreground tracking-tight">
                      {principle.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {principle.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
