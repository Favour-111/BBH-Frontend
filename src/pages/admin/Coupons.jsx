import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, Ticket } from "lucide-react";
import { adminApi, getErrorMessage } from "../../lib/api.js";
import { formatDate, formatNaira } from "../../lib/format.js";
import PageHeader from "../../components/admin/PageHeader.jsx";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Modal, { ConfirmDialog } from "../../components/ui/Modal.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";

const emptyForm = {
  code: "",
  type: "percentage",
  value: "",
  minOrder: 0,
  maxDiscount: "",
  expiryDate: "",
  usageLimit: "",
  customerUsageLimit: 1,
  status: "active",
};

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.get("/coupons").then(({ data }) => setCoupons(data.coupons)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };
  const openEdit = (c) => {
    setEditing(c);
    setForm({ ...c, expiryDate: c.expiryDate?.slice(0, 10) });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, value: Number(form.value) || 0, minOrder: Number(form.minOrder) || 0, maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null, usageLimit: form.usageLimit ? Number(form.usageLimit) : null };
      if (editing) {
        await adminApi.put(`/coupons/${editing._id}`, payload);
        toast.success("Coupon updated.");
      } else {
        await adminApi.post("/coupons", payload);
        toast.success("Coupon created.");
      }
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
      await adminApi.delete(`/coupons/${deleteId}`);
      toast.success("Coupon deleted.");
      setDeleteId(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Coupons & Discounts"
        description="Create and manage discount codes for your store."
        action={
          <Button onClick={openNew}>
            <Plus size={15} /> Create Coupon
          </Button>
        }
      />

      {loading ? (
        <div className="skeleton h-64 rounded-lg" />
      ) : coupons.length === 0 ? (
        <div className="rounded-lg bg-white p-10 shadow-sm">
          <EmptyState icon={Ticket} title="No coupons yet" message="Create your first discount code to boost sales." />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-cream-deep text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="p-4">Code</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Min Order</th>
                <th className="p-4">Usage</th>
                <th className="p-4">Expires</th>
                <th className="p-4">Status</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id} className="border-b border-cream-deep last:border-0">
                  <td className="p-4 font-mono text-sm font-medium text-ink">{c.code}</td>
                  <td className="p-4 text-sm">
                    {c.type === "percentage" ? `${c.value}%` : c.type === "fixed" ? formatNaira(c.value) : "Free Shipping"}
                  </td>
                  <td className="p-4 text-sm text-ink-soft">{formatNaira(c.minOrder)}</td>
                  <td className="p-4 text-sm text-ink-soft">
                    {c.usedCount} / {c.usageLimit || "∞"}
                  </td>
                  <td className="p-4 text-sm text-ink-soft">{formatDate(c.expiryDate)}</td>
                  <td className="p-4">
                    <Badge tone={c.status === "active" ? "green" : "gray"}>{c.status}</Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <button onClick={() => openEdit(c)} className="text-ink-soft hover:text-gold">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => setDeleteId(c._id)} className="text-ink-soft hover:text-red-600">
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Coupon" : "Create Coupon"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="Coupon code (e.g. WELCOME10)" className="input uppercase" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
          <div className="grid grid-cols-2 gap-4">
            <select className="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="percentage">Percentage Off</option>
              <option value="fixed">Fixed Amount Off</option>
              <option value="free_shipping">Free Shipping</option>
            </select>
            {form.type !== "free_shipping" && (
              <input required type="number" placeholder={form.type === "percentage" ? "Discount %" : "Amount (₦)"} className="input" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input type="number" placeholder="Minimum order (₦)" className="input" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} />
            <input type="number" placeholder="Max discount cap (optional)" className="input" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input required type="date" className="input" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
            <input type="number" placeholder="Total usage limit" className="input" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} />
          </div>
          <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Button type="submit" loading={saving} className="w-full">
            Save Coupon
          </Button>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Delete coupon?" message="This coupon code will no longer work at checkout." />
    </div>
  );
}
