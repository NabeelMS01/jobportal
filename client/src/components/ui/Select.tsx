import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ children, className, ...rest }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          {...rest}
          className={cn(
            "w-full appearance-none h-11 pl-3 pr-10 rounded-xl bg-card border border-input text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-[color-mix(in_oklab,var(--primary)_15%,transparent)] cursor-pointer",
            className
          )}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
