import React from "react";
import { cn } from "@/lib/utils";
import Tooltip from "./Tooltip";

export default function IconButton({
  label,
  onClick,
  tone = "neutral",
  children,
}: {
  label: string;
  onClick?: () => void;
  tone?: "neutral" | "danger";
  children: React.ReactNode;
}) {
  return (
    <Tooltip label={label}>
      <button
        onClick={onClick}
        aria-label={label}
        className={cn(
          "h-9 w-9 inline-flex items-center justify-center rounded-lg border border-transparent transition-all hover:scale-105",
          tone === "danger"
            ? "text-muted-foreground hover:text-[var(--destructive)] hover:bg-[color-mix(in_oklab,var(--destructive)_10%,transparent)]"
            : "text-muted-foreground hover:text-primary hover:bg-accent"
        )}
      >
        {children}
      </button>
    </Tooltip>
  );
}
