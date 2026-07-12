import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Dwellix | Terms of Service",
  description: "Read the terms governing the use of the Dwellix smart home registry platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-[1280px] mx-auto px-8 pt-36 pb-24 w-full">
        
        {/* Header Block */}
        <div className="flex flex-col gap-4 text-left max-w-3xl mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Terms of Service
          </h1>
          <p className="text-base text-muted-foreground">
            Last Updated: July 2026. Please read these terms carefully before accessing the platform.
          </p>
        </div>

        <div className="max-w-4xl text-left space-y-8 text-sm text-muted-foreground leading-relaxed font-medium">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">1. Agreement to Terms</h2>
            <p>
              By creating an account on the Dwellix platform, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, you should not access or use the application's home-management features.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">2. Account Responsibilities</h2>
            <p>
              When registering an account, you agree to provide accurate email details and maintain password security. You are responsible for all household modifications, room configurations, and document uploads occurring under your authorized login session.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">3. Platform Limitations</h2>
            <p>
              Dwellix's AI diagnostics are provided for reference purposes based on user symptom descriptions. Troubleshooting suggestions do not replace professional, licensed inspections. Home service bookings are coordinated through certified local providers, and Dwellix is not responsible for physical repairs or on-site safety.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">4. Acceptable Use</h2>
            <p>
              You agree not to upload fraudulent documents, receipts, or warranties. You must not attempt to compromise the authentication filters, run unauthorized vulnerability scans, or bypass refresh token loops on our servers.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
