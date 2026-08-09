import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, MapPin, Star, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../../lib/api.js";
import Modal, { ConfirmDialog } from "../../components/ui/Modal.jsx";
import Button from "../../components/ui/Button.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";

const NIGERIAN_STATES = [
  "Lagos", "Abuja", "Rivers", "Oyo", "Kano", "Kaduna", "Enugu", "Delta", "Edo", "Imo",
  "Anambra", "Ogun", "Ondo", "Osun", "Ekiti", "Cross River", "Akwa Ibom", "Plateau", "Katsina", "Sokoto",
];

const emptyForm = {
  label: "Home",
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  country: "Nigeria",
  state: "",
  city: "",
  postalCode: "",
  instructions: "",
};

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [defaultingId, setDefaultingId] = useState(null);

  const load = () => {
    setLoading(true);
    api.get("/addresses").then(({ data }) => setAddresses(data.addresses)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (addr) => {
    setEditing(addr);
    setForm(addr);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/addresses/${editing._id}`, form);
        toast.success("Address updated");
      } else {
        await api.post("/addresses", form);
        toast.success("Address added");
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
      await api.delete(`/addresses/${deleteId}`);
      toast.success("Address deleted");
      setDeleteId(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const setDefault = async (id) => {
    setDefaultingId(id);
    try {
      await api.put(`/addresses/${id}/default`);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDefaultingId(null);
    }
  };

  if (loading) return <div className="skeleton h-64 rounded-lg" />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">Address Book</h1>
        <Button size="sm" onClick={openNew}>
          <Plus size={14} /> Add New Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-lg bg-white p-10 shadow-sm">
          <EmptyState icon={MapPin} title="No saved addresses" message="Add a delivery address for faster checkout." />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <div key={a._id} className="rounded-lg bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">{a.label}</p>
                  {a.isDefault && (
                    <span className="mt-1 inline-block rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-medium uppercase text-gold">Default</span>
                  )}
                </div>
                <MapPin size={16} className="text-gold" />
              </div>
              <p className="text-sm text-ink-soft">
                {a.fullName}
                <br />
                {a.addressLine1}, {a.addressLine2}
                <br />
                {a.city}, {a.state}
                <br />
                {a.phone}
              </p>
              <div className="mt-4 flex items-center gap-4 border-t border-cream-deep pt-3 text-xs">
                <button onClick={() => openEdit(a)} className="flex items-center gap-1 text-ink-soft hover:text-gold">
                  <Edit2 size={12} /> Edit
                </button>
                <button onClick={() => setDeleteId(a._id)} className="flex items-center gap-1 text-ink-soft hover:text-red-600">
                  <Trash2 size={12} /> Delete
                </button>
                {!a.isDefault && (
                  <button
                    onClick={() => setDefault(a._id)}
                    disabled={defaultingId === a._id}
                    className="ml-auto flex items-center gap-1 text-gold hover:underline disabled:opacity-50"
                  >
                    {defaultingId === a._id ? <Loader2 size={12} className="animate-spin" /> : <Star size={12} />} Set Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Address" : "Add New Address"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Label (e.g. Home, Work)" className="input col-span-2" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
            <input required placeholder="Full Name" className="input col-span-2" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            <input required placeholder="Phone Number" className="input col-span-2" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input required placeholder="Address Line 1" className="input col-span-2" value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} />
            <input placeholder="Address Line 2 (optional)" className="input col-span-2" value={form.addressLine2} onChange={(e) => setForm({ ...form, addressLine2: e.target.value })} />
            <select required className="select" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}>
              <option value="">State</option>
              {NIGERIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <input required placeholder="City" className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <input placeholder="Postal Code" className="input col-span-2" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
            <textarea placeholder="Delivery instructions (optional)" className="textarea col-span-2" value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} /> Set as default address
          </label>
          <Button type="submit" loading={saving} className="w-full">
            Save Address
          </Button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete address?"
        message="This address will be permanently removed from your account."
      />
    </div>
  );
}
