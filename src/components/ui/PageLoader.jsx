export default function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold-soft border-t-gold" />
        <p className="font-display text-sm italic text-ink-soft">Loading Beauty by Horbah's...</p>
      </div>
    </div>
  );
}
