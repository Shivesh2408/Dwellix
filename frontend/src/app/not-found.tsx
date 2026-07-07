"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow flex items-center justify-center py-20 px-6">
        <div className="max-w-md w-full text-center flex flex-col items-center gap-6 select-none">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/5 text-primary border border-primary/10 mb-2">
            <AlertCircle className="h-8 w-8" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-extrabold text-primary uppercase tracking-wider">404 Error</span>
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground tracking-tight">
              Page Not Found
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground font-normal max-w-sm mx-auto">
              The page you are looking for doesn&apos;t exist or has been relocated to another address.
            </p>
          </div>
          <Link href="/" passHref className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto font-semibold shadow-xs">
              Go Back Home
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
