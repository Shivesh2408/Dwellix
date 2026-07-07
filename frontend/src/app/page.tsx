import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/features/home/hero";
import { Problem } from "@/features/home/problem";
import { MeetDwellix } from "@/features/home/meet-dwellix";
import { AIShowcase } from "@/features/home/ai-showcase";
import { FeaturesGrid } from "@/features/home/features-grid";
import { HowItWorks } from "@/features/home/how-it-works";
import { Testimonials } from "@/features/home/testimonials";
import { Pricing } from "@/features/home/pricing";
import { FAQ } from "@/features/home/faq";
import { FinalCTA } from "@/features/home/final-cta";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Problem />
        <MeetDwellix />
        <AIShowcase />
        <FeaturesGrid />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
