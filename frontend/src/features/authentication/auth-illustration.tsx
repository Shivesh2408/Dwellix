"use client";

import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function PlaceholderVisual() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.22),_transparent_45%),linear-gradient(135deg,_#0f172a_0%,_#111827_40%,_#1f2937_100%)] p-6 shadow-[0_40px_120px_-32px_rgba(15,23,42,0.9)]">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.08)_45%,transparent_60%)]" />
      <div className="absolute -left-16 top-10 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute -right-12 bottom-6 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl" />
      <div className="relative flex h-full flex-col justify-between gap-6">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="border-white/15 bg-white/5 text-white/80 backdrop-blur">
            Secure access
          </Badge>
          <span className="text-xs uppercase tracking-[0.28em] text-white/45">Dwellix Auth</span>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-white/10 bg-white/8 p-5 text-white shadow-none backdrop-blur">
            <div className="text-sm font-medium text-white/60">Session integrity</div>
            <div className="mt-3 text-3xl font-semibold tracking-tight">JWT + refresh rotation</div>
            <div className="mt-2 text-sm leading-6 text-white/70">
              Stateless access tokens, secure refresh cookies, and revocation-ready storage.
            </div>
          </Card>

          <Card className="border-white/10 bg-white/8 p-5 text-white shadow-none backdrop-blur">
            <div className="text-sm font-medium text-white/60">Protection layers</div>
            <ul className="mt-3 space-y-2 text-sm text-white/75">
              <li>BCrypt password hashing</li>
              <li>Rate limiting ready</li>
              <li>XSS and CSRF strategy</li>
            </ul>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            ["99.95%", "Availability ready"],
            ["RBAC", "Role-based access"],
            ["Secure", "Cookie ready"],
          ].map(([value, label]) => (
            <Card key={label} className="border-white/10 bg-white/8 p-4 text-white shadow-none backdrop-blur">
              <div className="text-lg font-semibold">{value}</div>
              <div className="mt-1 text-xs text-white/60">{label}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AuthIllustration() {
  const [imageFailed, setImageFailed] = useState(false);

  if (imageFailed) {
    return <PlaceholderVisual />;
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-[0_24px_80px_-40px_rgba(15,23,42,0.4)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(249,115,22,0.12),_transparent_36%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_35%,rgba(255,255,255,0.16)_50%,transparent_65%)] opacity-50" />
      <Image
        src="/images/authentication/login-side-image.webp"
        alt="Authentication side illustration"
        fill
        priority
        sizes="(min-width: 1280px) 42vw, 0vw"
        className={cn("object-cover object-center", imageFailed && "hidden")}
        onError={() => setImageFailed(true)}
      />
      <div className="absolute inset-0 flex items-end p-6">
        <Card className="max-w-md border-white/20 bg-white/85 p-5 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Access layer</div>
              <div className="mt-2 text-lg font-semibold text-foreground">Premium authentication UX</div>
            </div>
            <Badge variant="success">Production ready</Badge>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div className="rounded-2xl border border-border/60 bg-background/80 p-3">
              Real-time validation
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/80 p-3">
              Accessible feedback
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
