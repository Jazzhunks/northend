import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function usePaged(items, pageSize = 25) {
  const [page, setPage] = useState(1);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);
  const pageItems = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize]
  );
  return { page, setPage, total, totalPages, pageItems, pageSize };
}

export function Paginator({ page, setPage, total, totalPages, pageSize = 25, testid = "paginator" }) {
  if (total <= pageSize) return null;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const btn =
    "w-8 h-8 grid place-items-center rounded-lg border border-border bg-background text-foreground hover:bg-muted/60 transition disabled:opacity-40 disabled:cursor-not-allowed";
  return (
    <div className="flex items-center justify-between gap-3 pt-4 flex-wrap" data-testid={testid}>
      <div className="text-xs text-muted-foreground">
        Showing <b className="text-foreground">{start}–{end}</b> of <b className="text-foreground">{total}</b>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className={btn}
          data-testid={`${testid}-prev`}
          aria-label="Previous page"
        >
          <ChevronLeft size={15} />
        </button>
        <span className="text-xs font-mono px-2 text-muted-foreground select-none">
          {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className={btn}
          data-testid={`${testid}-next`}
          aria-label="Next page"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
