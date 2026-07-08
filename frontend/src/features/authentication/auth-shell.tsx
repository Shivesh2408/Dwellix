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
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.1),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.08),_transparent_28%),linear-gradient(180deg,_hsl(var(--background))_0%,_rgba(248,250,252,0.92)_100%)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 rounded-full border border-border/60 bg-background/80 px-4 py-3 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full overflow-hidden shadow-sm shadow-primary/10">
              <img
                src="/logo/dwellix-logo-light.png"
                alt="Dwellix Logo"
                className="h-10 w-10 object-contain"
              />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">Dwellix</div>
              <div className="text-xs text-muted-foreground">Premium home management</div>
            </div>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <Badge variant="outline" className="border-border/60 bg-background text-muted-foreground">
              {statusLabel}
            </Badge>
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link href={backHref} aria-label={backLabel}>
                <ArrowLeft className="h-4 w-4" />
                {backLabel}
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-10">
          <section className="mx-auto w-full max-w-xl lg:max-w-none">
            <div className="mb-5 inline-flex items-center rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground shadow-sm backdrop-blur">
              {eyebrow}
            </div>
            <Card className="border-border/60 bg-white/90 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.35)] backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-3xl tracking-tight sm:text-4xl">{title}</CardTitle>
                <CardDescription className="text-base leading-7">{description}</CardDescription>
              </CardHeader>
              <CardContent>{children}</CardContent>
            </Card>
            {footer ? <div className="mt-5">{footer}</div> : null}
          </section>

          <aside className="hidden h-[760px] lg:block">
            <AuthIllustration />
          </aside>
        </div>
      </div>
    </main>
  );
}
