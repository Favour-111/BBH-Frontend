import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Handshake, Mail, Loader2 } from "lucide-react";
import { adminApi, getErrorMessage } from "../../lib/api.js";
import { formatDate } from "../../lib/format.js";
import PageHeader from "../../components/admin/PageHeader.jsx";
import Badge from "../../components/ui/Badge.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Modal from "../../components/ui/Modal.jsx";
import clsx from "clsx";

const statusTone = { new: "blue", reviewing: "amber", accepted: "green", rejected: "red", completed: "gray" };
const tabs = ["all", "new", "reviewing", "accepted", "rejected", "completed"];

export default function AdminCollaborations() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [savingNotes, setSavingNotes] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.get("/collaborations", { params: { status } }).then(({ data }) => setItems(data.collaborations)).finally(() => setLoading(false));
  };
  useEffect(load, [status]);

  const updateStatus = async (id, newStatus) => {
    setUpdatingStatus(newStatus);
    try {
      await adminApi.put(`/collaborations/${id}`, { status: newStatus });
      toast.success(`Collaboration marked as ${newStatus}.`);
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
      await adminApi.put(`/collaborations/${selected._id}`, { adminNotes: notes });
      toast.success("Notes saved.");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <div>
      <PageHeader title="Collaborations" description="Manage brand partnership and collaboration requests." />

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t} onClick={() => setStatus(t)} className={clsx("rounded-full px-4 py-1.5 text-xs font-medium capitalize", status === t ? "bg-ink text-ivory" : "bg-cream-deep text-ink-soft")}>
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="skeleton h-64 rounded-lg" />
      ) : items.length === 0 ? (
        <div className="rounded-lg bg-white p-10 shadow-sm">
          <EmptyState icon={Handshake} title="No collaboration requests" message="Brand collaboration requests will appear here." />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-cream-deep text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="p-4">Brand</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Campaign</th>
                <th className="p-4">Budget</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c._id} onClick={() => { setSelected(c); setNotes(c.adminNotes || ""); }} className="cursor-pointer border-b border-cream-deep last:border-0 hover:bg-cream/40">
                  <td className="p-4 text-sm font-medium text-ink">{c.brand}</td>
                  <td className="p-4 text-sm text-ink-soft">{c.contactPerson}</td>
                  <td className="p-4 text-sm text-ink-soft">{c.campaign || " "}</td>
                  <td className="p-4 text-sm text-ink-soft">{c.budget || " "}</td>
                  <td className="p-4 text-sm text-ink-soft">{formatDate(c.createdAt)}</td>
                  <td className="p-4">
                    <Badge tone={statusTone[c.status]}>{c.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Collaboration Details">
        {selected && (
          <div className="space-y-4">
            <div>
              <p className="text-lg font-medium text-ink">{selected.brand}</p>
              <p className="text-sm text-ink-soft">{selected.contactPerson}</p>
              <p className="flex items-center gap-2 text-sm text-ink-soft"><Mail size={13} /> {selected.email}</p>
              {selected.socialHandle && <p className="text-sm text-ink-soft">Social: {selected.socialHandle}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-ink-soft">Campaign</p>
                <p className="text-ink">{selected.campaign || "Not specified"}</p>
              </div>
              <div>
                <p className="text-xs text-ink-soft">Budget</p>
                <p className="text-ink">{selected.budget || "Not specified"}</p>
              </div>
            </div>
            <div>
              <p className="mb-1 text-xs text-ink-soft">Description</p>
              <p className="text-sm text-ink">{selected.description}</p>
            </div>
            <div>
              <p className="mb-1 flex items-center gap-2 text-xs text-ink-soft">
                Admin Notes {savingNotes && <Loader2 size={11} className="animate-spin" />}
              </p>
              <textarea className="textarea" value={notes} onChange={(e) => setNotes(e.target.value)} onBlur={saveNotes} placeholder="Add internal notes..." />
            </div>
            <div className="flex flex-wrap gap-2 border-t border-cream-deep pt-4">
              {["new", "reviewing", "accepted", "rejected", "completed"].map((s) => (
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
                Reply by Email
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
