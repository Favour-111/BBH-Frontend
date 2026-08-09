import clsx from "clsx";

export default function StatCard({ icon: Icon, label, value, hint, hintTone = "gray", tone = "gold" }) {
  const toneClasses = {
    gold: "bg-gold/10 text-gold",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };
  const hintClasses = {
    green: "text-emerald-600",
    red: "text-red-500",
    amber: "text-amber-600",
    gray: "text-ink-soft",
  };

  return (
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-ink-soft">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-ink">{value}</p>
          {hint && <p className={clsx("mt-1 text-xs", hintClasses[hintTone])}>{hint}</p>}
        </div>
        {Icon && (
          <div className={clsx("flex h-11 w-11 items-center justify-center rounded-full", toneClasses[tone])}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}
