import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Dwellix | Privacy Policy",
  description: "Understand how we protect your personal and home configuration data at Dwellix.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-[1280px] mx-auto px-8 pt-36 pb-24 w-full">
        
        {/* Header Block */}
        <div className="flex flex-col gap-4 text-left max-w-3xl mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Privacy Policy
          </h1>
          <p className="text-base text-muted-foreground">
            Last Updated: July 2026. This policy describes how we collect, store, and protect your home records.
          </p>
        </div>

        <div className="max-w-4xl text-left space-y-8 text-sm text-muted-foreground leading-relaxed font-medium">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">1. Information We Collect</h2>
            <p>
              We collect information you directly provide when setting up your account and inputting home records. This includes your email address, profile credentials, room divisions, lists of appliances (including brand names and model numbers), and uploaded purchase invoices or warranty documents.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">2. How We Use Your Data</h2>
            <p>
              Your data is solely used to deliver home management features. This includes calculating your Home Health Score, scheduling recurring maintenance checkups, parsing warranty expiration notices, and providing structured troubleshooting guidance through our AI diagnostic engine.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">3. Data Security and Storage</h2>
            <p>
              All passwords and refresh tokens are securely hashed and stored. External document uploads are processed through encrypted cloud storage links. We do not sell, rent, or trade your personal information or household registry records with third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">4. User Authority & Control</h2>
            <p>
              You maintain full authority over all data associated with your home profile. You can modify, delete, or export your appliance lists, document logs, and user profile information at any time directly through the smart home dashboard.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
