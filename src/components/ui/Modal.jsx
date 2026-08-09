import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({ open, onClose, title, children, maxWidth = "max-w-lg" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-2xl animate-fade-up`}>
        {title && (
          <div className="flex items-center justify-between border-b border-cream-deep px-6 py-4">
            <h3 className="font-display text-xl text-ink">{title}</h3>
            <button onClick={onClose} className="rounded-full p-1 text-ink-soft hover:bg-cream-deep">
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
}

export function ConfirmDialog({ open, onClose, onConfirm, title = "Are you sure?", message, danger = true, loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
      <p className="text-sm text-ink-soft">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onClose} className="rounded-sm border border-cream-deep px-4 py-2 text-sm font-medium hover:bg-cream-deep">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`rounded-sm px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${
            danger ? "bg-red-600 hover:bg-red-700" : "bg-ink hover:bg-ink-soft"
          }`}
        >
          {loading ? "Please wait..." : "Confirm"}
        </button>
      </div>
    </Modal>
  );
}
