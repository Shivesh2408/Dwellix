"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function OnboardingIllustration({ stepIndex }: { stepIndex: number }) {
  return (
    <div className="relative h-full min-h-[760px] overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-[0_30px_110px_-50px_rgba(15,23,42,0.5)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.14),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(249,115,22,0.12),_transparent_30%),linear-gradient(145deg,_#ffffff_0%,_#f8fafc_55%,_#eef2ff_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.55)_50%,transparent_70%)] opacity-60" />
      <div className="relative flex h-full flex-col justify-between p-6">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="border-border/70 bg-white/80 text-muted-foreground">
            Premium setup
          </Badge>
          <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Dwellix</span>
        </div>

        <div className="grid gap-4">
          <Card className="border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
            <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Setup progress</div>
            <div className="mt-3 text-3xl font-semibold tracking-tight">{stepIndex + 1}/5</div>
            <div className="mt-2 text-sm leading-6 text-muted-foreground">Large spacing, clean hierarchy, and zero empty states in your dashboard setup journey.</div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
              <div className="text-sm font-semibold">Home scope</div>
              <div className="mt-1 text-xs text-muted-foreground">Structured from the start</div>
            </Card>
            <Card className="border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
              <div className="text-sm font-semibold">Rooms</div>
              <div className="mt-1 text-xs text-muted-foreground">Dynamic and editable</div>
            </Card>
            <Card className="border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
              <div className="text-sm font-semibold">Appliances</div>
              <div className="mt-1 text-xs text-muted-foreground">Warranty-aware records</div>
            </Card>
            <Card className="border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
              <div className="text-sm font-semibold">Finish</div>
              <div className="mt-1 text-xs text-muted-foreground">Ready for dashboard</div>
            </Card>
          </div>
        </div>

        <Card className="border-white/80 bg-white/85 p-5 shadow-xl backdrop-blur-xl">
          <div className="text-sm font-semibold">What good looks like</div>
          <div className="mt-2 text-sm leading-6 text-muted-foreground">
            A calm, premium setup flow that captures the essentials once and keeps the dashboard useful from the first visit.
          </div>
        </Card>
      </div>
    </div>
  );
}
