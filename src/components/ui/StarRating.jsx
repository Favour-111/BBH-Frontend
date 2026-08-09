import { Star } from "lucide-react";
import clsx from "clsx";

export default function StarRating({ rating = 0, size = 14, showValue = false, count }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={size}
            className={clsx(n <= Math.round(rating) ? "fill-gold text-gold" : "fill-gold-soft/40 text-gold-soft")}
          />
        ))}
      </div>
      {showValue && <span className="text-xs text-ink-soft">{rating.toFixed(1)}</span>}
      {typeof count === "number" && <span className="text-xs text-ink-soft">({count})</span>}
    </div>
  );
}
