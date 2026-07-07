"use client";

import * as React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log exception to logging services
    console.error("Runtime exception caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow flex items-center justify-center py-20 px-6">
        <div className="max-w-md w-full text-center flex flex-col items-center gap-6 select-none">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/5 text-destructive border border-destructive/10 mb-2">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-extrabold text-destructive uppercase tracking-wider">500 Error</span>
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground tracking-tight">
              Internal Server Error
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground font-normal max-w-sm mx-auto">
              Something went wrong on our end. Please try resetting the application state or contact support if the issue persists.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Button onClick={() => reset()} className="w-full sm:w-auto font-semibold shadow-xs gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" />
              Try Again
            </Button>
            <Button onClick={() => window.location.href = "/"} variant="outline" className="w-full sm:w-auto font-semibold border-border/80 text-muted-foreground">
              Go Back Home
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
