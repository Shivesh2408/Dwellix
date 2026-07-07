import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Paragraph } from "@/components/ui/typography";

export interface NotFoundIllustrationProps {
  title?: string;
  description?: string;
  homeLink?: string;
}

function NotFoundIllustration({
  title = "Page Not Found",
  description = "The page you are looking for doesn't exist or has been moved.",
  homeLink = "/",
}: NotFoundIllustrationProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto">
      {/* Premium Minimal 404 Vector Illustration */}
      <div className="relative w-full max-w-[280px] aspect-square flex items-center justify-center mb-8">
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-primary"
        >
          {/* Subtle Background Pattern */}
          <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="opacity-15" />
          <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="opacity-25" />
          
          {/* 404 Floating Numbers */}
          <text
            x="50%"
            y="55%"
            textAnchor="middle"
            fill="currentColor"
            className="font-heading font-extrabold text-5xl tracking-tighter opacity-90"
          >
            404
          </text>
          
          {/* Decorative Geometric Blocks (inspired by Linear/Stripe) */}
          <rect x="25" y="45" width="16" height="16" rx="3" fill="currentColor" className="opacity-10 animate-bounce" style={{ animationDuration: "3s" }} />
          <rect x="155" y="135" width="20" height="20" rx="4" fill="currentColor" className="opacity-10 animate-pulse" />
          <circle cx="160" cy="55" r="8" fill="currentColor" className="opacity-20" />
          <circle cx="45" cy="145" r="10" fill="currentColor" className="opacity-20" />
          
          {/* Grid lines overlay */}
          <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="0.5" className="opacity-10" />
          <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="0.5" className="opacity-10" />
        </svg>
      </div>

      <Heading level="h3" align="center" className="text-xl sm:text-2xl font-bold mb-2">
        {title}
      </Heading>
      
      <Paragraph className="mb-6 max-w-sm">
        {description}
      </Paragraph>
      
      <Link href={homeLink} passHref>
        <Button variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </Link>
    </div>
  );
}

export { NotFoundIllustration };
