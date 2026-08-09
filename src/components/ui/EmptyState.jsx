export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      {Icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream-deep text-gold">
          <Icon size={28} />
        </div>
      )}
      <h3 className="font-display text-2xl text-ink">{title}</h3>
      {message && <p className="max-w-sm text-sm text-ink-soft">{message}</p>}
      {action}
    </div>
  );
}
