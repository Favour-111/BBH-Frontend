import { Loader2 } from "lucide-react";
import clsx from "clsx";

const variants = {
  primary: "bg-ink text-ivory hover:bg-ink-soft",
  gold: "bg-gold text-ivory hover:bg-gold-light",
  outline: "border border-ink text-ink hover:bg-ink hover:text-ivory",
  ghost: "text-ink hover:bg-cream-deep",
  white: "bg-white text-ink hover:bg-cream-deep",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizes = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-sm",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  loading,
  disabled,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center gap-2 font-medium tracking-wide uppercase transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}
