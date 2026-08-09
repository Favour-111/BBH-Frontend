import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Truck } from "lucide-react";
import { adminApi, getErrorMessage } from "../../lib/api.js";
import { formatNaira } from "../../lib/format.js";
import PageHeader from "../../components/admin/PageHeader.jsx";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Modal, { ConfirmDialog } from "../../components/ui/Modal.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";

const NIGERIAN_STATES = [
  "Lagos", "Abuja", "Rivers", "Oyo", "Kano", "Kaduna", "Enugu", "Delta", "Edo", "Imo",
  "Anambra", "Ogun", "Ondo", "Osun", "Ekiti", "Cross River", "Akwa Ibom", "Plateau", "Katsina", "Sokoto",
  "Bauchi", "Benue", "Borno", "Ebonyi", "Niger", "Kwara", "Kogi", "Gombe", "Adamawa", "Taraba",
  "Yobe", "Zamfara", "Kebbi", "Jigawa", "Nasarawa", "Bayelsa", "Ekiti",
];

export default function AdminShipping() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ state: "", fee: "", estimatedDays: "2-4 days", active: true });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.get("/settings/shipping").then(({ data }) => setZones(data.zones)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => {
    setForm({ state: "", fee: "", estimatedDays: "2-4 days", active: true });
    setModalOpen(true);
  };
  const openEdit = (z) => {
    setForm(z);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.post("/settings/shipping", { ...form, fee: Number(form.fee) });
      toast.success("Shipping zone saved.");
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminApi.delete(`/settings/shipping/${deleteId}`);
      toast.success("Shipping zone removed.");
      setDeleteId(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const configuredStates = zones.map((z) => z.state);

  return (
    <div>
      <PageHeader
        title="Shipping"
        description="Configure delivery fees and estimated delivery times by state."
        action={
          <Button onClick={openNew}>
            <Plus size={15} /> Add Shipping Zone
          </Button>
        }
      />

      {loading ? (
        <div className="skeleton h-64 rounded-lg" />
      ) : zones.length === 0 ? (
        <div className="rounded-lg bg-white p-10 shadow-sm">
          <EmptyState icon={Truck} title="No shipping zones configured" message="Add delivery fees for each state you ship to." />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-cream-deep text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="p-4">State</th>
                <th className="p-4">Delivery Fee</th>
                <th className="p-4">Estimated Time</th>
                <th className="p-4">Status</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {zones.map((z) => (
                <tr key={z._id} className="border-b border-cream-deep last:border-0">
                  <td className="p-4 text-sm font-medium text-ink">{z.state}</td>
                  <td className="p-4 text-sm">{formatNaira(z.fee)}</td>
                  <td className="p-4 text-sm text-ink-soft">{z.estimatedDays}</td>
                  <td className="p-4">
                    <Badge tone={z.active ? "green" : "gray"}>{z.active ? "Active" : "Inactive"}</Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <button onClick={() => openEdit(z)} className="text-xs text-gold hover:underline">
                        Edit
                      </button>
                      <button onClick={() => setDeleteId(z._id)} className="text-ink-soft hover:text-red-600">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-3 text-xs text-ink-soft">
        States without a configured zone default to ₦2,500 delivery. Orders above the free shipping threshold (set in Website Settings) always ship free.
      </p>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Shipping Zone">
        <form onSubmit={handleSubmit} className="space-y-4">
          <select required className="select" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}>
            <option value="">Select state</option>
            {NIGERIAN_STATES.map((s) => (
              <option key={s} value={s} disabled={configuredStates.includes(s) && s !== form.state}>
                {s}
              </option>
            ))}
          </select>
          <input required type="number" placeholder="Delivery fee (₦)" className="input" value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} />
          <input placeholder="Estimated delivery time (e.g. 2-4 days)" className="input" value={form.estimatedDays} onChange={(e) => setForm({ ...form, estimatedDays: e.target.value })} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active
          </label>
          <Button type="submit" loading={saving} className="w-full">
            Save Zone
          </Button>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Remove shipping zone?" message="This state will fall back to the default delivery fee." />
    </div>
  );
}
