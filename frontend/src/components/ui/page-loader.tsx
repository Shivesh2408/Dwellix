import * as React from "react";
import { Spinner } from "@/components/ui/spinner";
import { Heading } from "@/components/ui/heading";

export interface PageLoaderProps {
  message?: string;
}

function PageLoader({ message = "Loading Dwellix..." }: PageLoaderProps) {
  return (
    <div
      role="alert"
      aria-busy="true"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm transition-all duration-300"
    >
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        {message && (
          <Heading level="h5" align="center" className="text-sm font-medium text-muted-foreground animate-pulse">
            {message}
          </Heading>
        )}
      </div>
    </div>
  );
}

export { PageLoader };
