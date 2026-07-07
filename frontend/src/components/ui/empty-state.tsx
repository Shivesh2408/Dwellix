"use client";

import * as React from "react";
import { Inbox, WifiOff, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}

export function EmptyState({
  title = "No data found",
  description = "There are no records matching your request at this time.",
  actionText,
  onAction,
  icon: Icon = Inbox,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-border/80 rounded-2xl bg-slate-50/50 max-w-md mx-auto select-none gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-muted-foreground">
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-heading font-bold text-sm text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed font-normal">{description}</p>
      </div>
      {actionText && onAction && (
        <Button onClick={onAction} className="font-bold text-xs h-9 mt-2">
          {actionText}
        </Button>
      )}
    </div>
  );
}

export function NetworkError({
  title = "Connection Lost",
  description = "We couldn't reach the server. Please check your internet connection and try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border border-border/60 rounded-2xl bg-white shadow-xs max-w-md mx-auto select-none gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <WifiOff className="h-6 w-6" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-heading font-bold text-sm text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed font-normal">{description}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="font-bold text-xs h-9 border-border/80">
          Retry Connection
        </Button>
      )}
    </div>
  );
}
