"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, ChevronRight, Home, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { OnboardingIllustration } from "./illustration";

const steps = [
  { key: "welcome", label: "Welcome" },
  { key: "home", label: "Home" },
  { key: "rooms", label: "Rooms" },
  { key: "appliances", label: "Appliances" },
  { key: "review", label: "Review" },
];

type OnboardingShellProps = {
  stepIndex: number;
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function OnboardingShell({ stepIndex, title, description, children, footer }: OnboardingShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.1),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.08),_transparent_28%),linear-gradient(180deg,_hsl(var(--background))_0%,_rgba(248,250,252,0.94)_100%)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4 rounded-full border border-border/60 bg-background/80 px-4 py-3 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">Dwellix Onboarding</div>
              <div className="text-xs text-muted-foreground">Personalize before entering the dashboard</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden gap-2 md:inline-flex">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </Link>
            </Button>
            <Badge variant="outline" className="border-border/70 bg-background text-muted-foreground">
              Step {stepIndex + 1} of 5
            </Badge>
          </div>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-5">
          {steps.map((step, index) => (
            <div
              key={step.key}
              className={cn(
                "rounded-2xl border px-4 py-3 text-sm transition-all duration-300",
                index <= stepIndex ? "border-primary/30 bg-primary/5 text-foreground" : "border-border/60 bg-background/80 text-muted-foreground"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{step.label}</span>
                {index < stepIndex ? <CheckCircle2 className="h-4 w-4 text-primary" /> : index === stepIndex ? <Home className="h-4 w-4 text-primary" /> : <ChevronRight className="h-4 w-4" />}
              </div>
            </div>
          ))}
        </div>

        <div className="grid flex-1 gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:items-start">
          <section className="mx-auto w-full max-w-3xl lg:max-w-none">
            <Card className="border-border/60 bg-white/90 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.45)] backdrop-blur-md">
              <CardHeader className="space-y-3">
                <Badge variant="outline" className="w-fit border-border/70 bg-secondary/40 text-muted-foreground">
                  Step {stepIndex + 1}
                </Badge>
                <CardTitle className="text-3xl tracking-tight sm:text-4xl">{title}</CardTitle>
                <CardDescription className="max-w-2xl text-base leading-7">{description}</CardDescription>
              </CardHeader>
              <CardContent>{children}</CardContent>
            </Card>
            {footer ? <div className="mt-5">{footer}</div> : null}
          </section>

          <aside className="hidden lg:block">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <OnboardingIllustration stepIndex={stepIndex} />
            </motion.div>
          </aside>
        </div>
      </div>
    </main>
  );
}
