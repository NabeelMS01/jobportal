import React from "react";
import { cn } from "@/lib/utils";

export default function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={cn("px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground", className)}>
      {children}
    </th>
  );
}
