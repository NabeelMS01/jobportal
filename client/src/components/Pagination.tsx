import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./ui/Button";
import { cn } from "@/lib/utils";

export default function Pagination({ page, totalPages, setPage }: { page: number; totalPages: number; setPage: (p: number) => void }) {
  // If no pages, hide pagination
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-2 px-6 py-4 border-t border-border">
      <p className="text-xs text-muted-foreground">
        Page <span className="font-semibold text-foreground">{page}</span> of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <Button size="sm" variant="secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>
          <ChevronLeft className="h-4 w-4" />Prev
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => setPage(p)}
            className={cn("h-9 w-9 rounded-lg text-sm font-medium transition-all",
              p === page ? "text-primary-foreground shadow-elegant [background:var(--gradient-primary)]" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
            {p}
          </button>
        ))}
        <Button size="sm" variant="secondary" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Next<ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
