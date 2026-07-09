"use client";

import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AuthIllustration } from "./auth-illustration";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  backHref?: string;
  backLabel?: string;
  statusLabel?: string;
};

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
  backHref = "/",
  backLabel = "Back to home",
  statusLabel = "Authentication",
}: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(37,99,235,0.03),_transparent_40%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8 z-10">
        {/* Modern Nav Header */}
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/40 bg-white/80 px-6 py-3 shadow-xs backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden bg-white border border-border/40 shadow-xs">
              <img
                src="/logo/dwellix-logo-light.png"
                alt="Dwellix Logo"
                className="h-6 w-6 object-contain"
              />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">Dwellix</div>
              <div className="text-[10px] text-muted-foreground font-medium">Smart Home Platform</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="hidden md:inline-flex border-border/60 bg-background text-muted-foreground font-medium">
              {statusLabel}
            </Badge>
            <Button asChild variant="ghost" size="sm" className="gap-1.5 h-9 rounded-xl text-xs">
              <Link href={backHref} aria-label={backLabel}>
                <ArrowLeft className="h-3.5 w-3.5" />
                {backLabel}
              </Link>
            </Button>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid flex-1 items-center gap-12 py-10 lg:grid-cols-[1fr_1fr] lg:py-12">
          <section className="mx-auto w-full max-w-lg lg:max-w-none">
            <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
              {eyebrow}
            </div>
            <Card className="border-border/40 bg-white/95 shadow-premium backdrop-blur-md">
              <CardHeader className="space-y-2">
                <CardTitle className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</CardTitle>
                <CardDescription className="text-sm leading-6 text-muted-foreground font-medium">{description}</CardDescription>
              </CardHeader>
              <CardContent>{children}</CardContent>
            </Card>
            {footer ? <div className="mt-6">{footer}</div> : null}
          </section>

          <aside className="hidden h-[640px] lg:block rounded-3xl overflow-hidden shadow-premium border border-border/40 relative bg-white">
            <AuthIllustration />
          </aside>
        </div>
      </div>
    </main>
  );
}
