import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps {
  children: React.ReactNode;
  tone?: "neutral" | "primary" | "success" | "warning" | "info" | "danger";
}

export default function Badge({ children, tone = "neutral" }: BadgeProps) {
  const tones = {
    neutral: "bg-muted text-muted-foreground",
    primary: "bg-accent text-accent-foreground",
    success: "bg-[color-mix(in_oklab,var(--success)_15%,transparent)] text-[var(--success)]",
    warning: "bg-[color-mix(in_oklab,var(--warning)_22%,transparent)] text-[oklch(0.4_0.12_80)]",
    info: "bg-[color-mix(in_oklab,var(--info)_15%,transparent)] text-[var(--info)]",
    danger: "bg-[color-mix(in_oklab,var(--destructive)_15%,transparent)] text-[var(--destructive)]",
  };
  
  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold", tones[tone])}>
      {children}
    </span>
  );
}
