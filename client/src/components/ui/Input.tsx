import React from "react";
import { cn } from "@/lib/utils";

export default function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full h-11 px-4 rounded-xl bg-card border border-input text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-[color-mix(in_oklab,var(--primary)_15%,transparent)]",
        className
      )}
    />
  );
}
