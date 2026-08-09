import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Inbox, Trash2, Archive, Reply, Loader2 } from "lucide-react";
import { adminApi, getErrorMessage } from "../../lib/api.js";
import { formatDateTime } from "../../lib/format.js";
import PageHeader from "../../components/admin/PageHeader.jsx";
import Badge from "../../components/ui/Badge.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Button from "../../components/ui/Button.jsx";
import clsx from "clsx";

const tabs = ["all", "unread", "read", "replied", "archived"];
const typeTone = { general: "gray", "makeup-booking": "amber", "content-creation": "blue", "brand-collaboration": "gold", "customer-support": "red" };

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [removing, setRemoving] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.get("/messages", { params: { status } }).then(({ data }) => setMessages(data.messages)).finally(() => setLoading(false));
  };
  useEffect(load, [status]);

  const openMessage = async (m) => {
    setSelected(m);
    setReply(m.reply || "");
    if (m.status === "unread") {
      await adminApi.put(`/messages/${m._id}`, { status: "read" });
      load();
    }
  };

  const sendReply = async () => {
    setSending(true);
    try {
      await adminApi.put(`/messages/${selected._id}`, { reply });
      toast.success("Reply saved and marked as replied.");
      load();
      setSelected(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  const archive = async (id) => {
    setArchiving(true);
    try {
      await adminApi.put(`/messages/${id}`, { status: "archived" });
      toast.success("Message archived.");
      load();
      setSelected(null);
    } finally {
      setArchiving(false);
    }
  };

  const remove = async (id) => {
    setRemoving(true);
    try {
      await adminApi.delete(`/messages/${id}`);
      toast.success("Message deleted.");
      load();
      setSelected(null);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Messages" description="All enquiries from makeup bookings, content requests, collaborations and support." />

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t} onClick={() => setStatus(t)} className={clsx("rounded-full px-4 py-1.5 text-xs font-medium capitalize", status === t ? "bg-ink text-ivory" : "bg-cream-deep text-ink-soft")}>
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          {loading ? (
            <div className="p-8 text-center text-sm text-ink-soft">Loading...</div>
          ) : messages.length === 0 ? (
            <div className="p-8">
              <EmptyState icon={Inbox} title="No messages" message="Messages from your Contact page will appear here." />
            </div>
          ) : (
            messages.map((m) => (
              <button
                key={m._id}
                onClick={() => openMessage(m)}
                className={clsx(
                  "block w-full border-b border-cream-deep p-4 text-left last:border-0 hover:bg-cream/40",
                  selected?._id === m._id && "bg-cream/60",
                  m.status === "unread" && "bg-gold/5"
                )}
              >
                <div className="flex items-center justify-between">
                  <p className={clsx("text-sm text-ink", m.status === "unread" && "font-semibold")}>{m.name}</p>
                  <Badge tone={typeTone[m.type]}>{m.type.replace(/-/g, " ")}</Badge>
                </div>
                <p className="mt-1 text-xs text-ink-soft line-clamp-1">{m.subject || m.message}</p>
                <p className="mt-1 text-[11px] text-ink-soft/70">{formatDateTime(m.createdAt)}</p>
              </button>
            ))
          )}
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          {!selected ? (
            <p className="py-10 text-center text-sm text-ink-soft">Select a message to view details.</p>
          ) : (
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-lg font-medium text-ink">{selected.name}</p>
                  <p className="text-sm text-ink-soft">{selected.email} {selected.phone && `• ${selected.phone}`}</p>
                </div>
                <Badge tone={typeTone[selected.type]}>{selected.type.replace(/-/g, " ")}</Badge>
              </div>
              {selected.subject && <p className="mt-4 text-sm font-medium text-ink">{selected.subject}</p>}
              <p className="mt-2 whitespace-pre-line text-sm text-ink-soft">{selected.message}</p>

              {selected.reply && (
                <div className="mt-4 rounded-md bg-emerald-50 p-4 text-sm text-emerald-800">
                  <p className="mb-1 text-xs font-semibold uppercase">Your Reply</p>
                  {selected.reply}
                </div>
              )}

              <div className="mt-6 border-t border-cream-deep pt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink">Reply</p>
                <textarea className="textarea" rows={4} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Type your reply..." />
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" loading={sending} onClick={sendReply}>
                    <Reply size={13} /> Save Reply
                  </Button>
                  <button
                    onClick={() => archive(selected._id)}
                    disabled={archiving || removing}
                    className="flex items-center gap-1.5 rounded-sm border border-cream-deep px-4 py-2 text-xs text-ink-soft hover:bg-cream-deep disabled:opacity-50"
                  >
                    {archiving ? <Loader2 size={13} className="animate-spin" /> : <Archive size={13} />} Archive
                  </button>
                  <button
                    onClick={() => remove(selected._id)}
                    disabled={archiving || removing}
                    className="flex items-center gap-1.5 rounded-sm border border-cream-deep px-4 py-2 text-xs text-red-500 hover:bg-red-50 disabled:opacity-50"
                  >
                    {removing ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />} Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
