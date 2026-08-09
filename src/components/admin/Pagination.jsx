import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  const nums = Array.from({ length: pages }).map((_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)} className="flex h-8 w-8 items-center justify-center rounded-sm border border-cream-deep disabled:opacity-30">
        <ChevronLeft size={14} />
      </button>
      {nums.map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={clsx("flex h-8 w-8 items-center justify-center rounded-sm border text-sm", page === n ? "border-ink bg-ink text-ivory" : "border-cream-deep hover:bg-cream-deep")}
        >
          {n}
        </button>
      ))}
      <button disabled={page >= pages} onClick={() => onChange(page + 1)} className="flex h-8 w-8 items-center justify-center rounded-sm border border-cream-deep disabled:opacity-30">
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
