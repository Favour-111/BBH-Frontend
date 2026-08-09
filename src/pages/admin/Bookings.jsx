import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CalendarCheck, Mail, Phone, Loader2 } from "lucide-react";
import { adminApi, getErrorMessage } from "../../lib/api.js";
import { formatDate } from "../../lib/format.js";
import PageHeader from "../../components/admin/PageHeader.jsx";
import Badge from "../../components/ui/Badge.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Modal from "../../components/ui/Modal.jsx";
import clsx from "clsx";

const statusTone = { pending: "amber", confirmed: "blue", completed: "green", cancelled: "red" };
const tabs = ["all", "pending", "confirmed", "completed", "cancelled"];

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [savingNotes, setSavingNotes] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.get("/bookings", { params: { status } }).then(({ data }) => setBookings(data.bookings)).finally(() => setLoading(false));
  };
  useEffect(load, [status]);

  const updateStatus = async (id, newStatus) => {
    setUpdatingStatus(newStatus);
    try {
      await adminApi.put(`/bookings/${id}`, { status: newStatus });
      toast.success(`Booking marked as ${newStatus}.`);
      load();
      setSelected(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUpdatingStatus(null);
    }
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    try {
      await adminApi.put(`/bookings/${selected._id}`, { adminNotes: notes });
      toast.success("Notes saved.");
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <div>
      <PageHeader title="Bookings" description="Manage makeup service booking requests." />

      <div className="mb-6 flex gap-2">
        {tabs.map((t) => (
          <button key={t} onClick={() => setStatus(t)} className={clsx("rounded-full px-4 py-1.5 text-xs font-medium capitalize", status === t ? "bg-ink text-ivory" : "bg-cream-deep text-ink-soft")}>
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="skeleton h-64 rounded-lg" />
      ) : bookings.length === 0 ? (
        <div className="rounded-lg bg-white p-10 shadow-sm">
          <EmptyState icon={CalendarCheck} title="No bookings" message="Booking requests from the Contact page will appear here." />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookings.map((b) => (
            <button key={b._id} onClick={() => { setSelected(b); setNotes(b.adminNotes || ""); }} className="rounded-lg bg-white p-5 text-left shadow-sm hover:shadow-md">
              <div className="flex items-start justify-between">
                <p className="font-medium text-ink">{b.name}</p>
                <Badge tone={statusTone[b.status]}>{b.status}</Badge>
              </div>
              <p className="mt-1 text-xs capitalize text-gold">{b.service.replace(/-/g, " ")}</p>
              <p className="mt-2 text-xs text-ink-soft line-clamp-2">{b.message}</p>
              <div className="mt-3 flex items-center justify-between border-t border-cream-deep pt-3 text-xs text-ink-soft">
                <span>{b.preferredDate ? formatDate(b.preferredDate) : "No date set"}</span>
                <span>{b.budget}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Booking Details">
        {selected && (
          <div className="space-y-4">
            <div>
              <p className="text-lg font-medium text-ink">{selected.name}</p>
              <p className="flex items-center gap-2 text-sm text-ink-soft"><Mail size={13} /> {selected.email}</p>
              {selected.phone && <p className="flex items-center gap-2 text-sm text-ink-soft"><Phone size={13} /> {selected.phone}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-ink-soft">Service</p>
                <p className="capitalize text-ink">{selected.service.replace(/-/g, " ")}</p>
              </div>
              <div>
                <p className="text-xs text-ink-soft">Preferred Date</p>
                <p className="text-ink">{selected.preferredDate ? formatDate(selected.preferredDate) : "Not specified"}</p>
              </div>
              <div>
                <p className="text-xs text-ink-soft">Budget</p>
                <p className="text-ink">{selected.budget || "Not specified"}</p>
              </div>
              <div>
                <p className="text-xs text-ink-soft">Status</p>
                <Badge tone={statusTone[selected.status]}>{selected.status}</Badge>
              </div>
            </div>
            <div>
              <p className="mb-1 text-xs text-ink-soft">Message</p>
              <p className="text-sm text-ink">{selected.message}</p>
            </div>
            <div>
              <p className="mb-1 flex items-center gap-2 text-xs text-ink-soft">
                Admin Notes {savingNotes && <Loader2 size={11} className="animate-spin" />}
              </p>
              <textarea className="textarea" value={notes} onChange={(e) => setNotes(e.target.value)} onBlur={saveNotes} placeholder="Add internal notes..." />
            </div>
            <div className="flex flex-wrap gap-2 border-t border-cream-deep pt-4">
              {["pending", "confirmed", "completed", "cancelled"].map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(selected._id, s)}
                  disabled={!!updatingStatus}
                  className={clsx(
                    "flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-medium capitalize disabled:opacity-50",
                    selected.status === s ? "bg-ink text-ivory" : "border border-cream-deep text-ink-soft hover:bg-cream-deep"
                  )}
                >
                  {updatingStatus === s && <Loader2 size={11} className="animate-spin" />} {s}
                </button>
              ))}
              <a href={`mailto:${selected.email}`} className="ml-auto rounded-sm border border-gold px-3 py-1.5 text-xs font-medium text-gold hover:bg-gold/10">
                Contact Client
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
