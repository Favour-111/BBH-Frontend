import clsx from "clsx";

export default function SectionHeading({ eyebrow, title, subtitle, align = "left", dark = false, className, action }) {
  return (
    <div
      className={clsx(
        "mb-10 flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div>
        {eyebrow && (
          <p className={clsx("mb-2 text-xs font-medium uppercase tracking-[0.25em]", dark ? "text-gold-light" : "text-gold")}>
            {eyebrow}
          </p>
        )}
        <h2 className={clsx("font-display text-3xl leading-tight sm:text-4xl", dark ? "text-ivory" : "text-ink")}>
          {title}
        </h2>
        {subtitle && <p className={clsx("mt-3 max-w-xl text-sm", dark ? "text-ivory/70" : "text-ink-soft")}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
