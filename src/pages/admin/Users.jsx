import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, ShieldCheck } from "lucide-react";
import { adminApi, getErrorMessage } from "../../lib/api.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { formatDate } from "../../lib/format.js";
import PageHeader from "../../components/admin/PageHeader.jsx";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Modal, { ConfirmDialog } from "../../components/ui/Modal.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";

const roles = [
  { value: "super_admin", label: "Super Admin", desc: "Full access to everything" },
  { value: "store_manager", label: "Store Manager", desc: "Products, orders, customers" },
  { value: "content_manager", label: "Content Manager", desc: "Portfolio, content, socials" },
  { value: "support_staff", label: "Support Staff", desc: "Orders, customers, messages" },
];

const roleTone = { super_admin: "gold", store_manager: "blue", content_manager: "purple", support_staff: "green" };

const emptyForm = { name: "", email: "", password: "", role: "support_staff" };

export default function AdminUsers() {
  const { admin } = useAdminAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const load = () => {
    setLoading(true);
    adminApi
      .get("/users")
      .then(({ data }) => setUsers(data.users))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };
  const openEdit = (u) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, password: "", role: u.role });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await adminApi.put(`/users/${editing._id}`, { name: form.name, role: form.role });
        toast.success("Admin user updated.");
      } else {
        await adminApi.post("/users", form);
        toast.success("Admin user created.");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (u) => {
    setTogglingId(u._id);
    try {
      await adminApi.put(`/users/${u._id}`, { status: u.status === "active" ? "suspended" : "active" });
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminApi.delete(`/users/${deleteId}`);
      toast.success("Admin user removed.");
      setDeleteId(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  if (admin?.role !== "super_admin") {
    return (
      <div className="rounded-lg bg-white p-10 shadow-sm">
        <EmptyState icon={ShieldCheck} title="Restricted" message="Only Super Admins can manage users and roles." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Users & Roles"
        description="Manage admin accounts and their access levels."
        action={
          <Button onClick={openNew}>
            <Plus size={15} /> Add Admin User
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {roles.map((r) => (
          <div key={r.value} className="rounded-lg bg-white p-4 shadow-sm">
            <Badge tone={roleTone[r.value]}>{r.label}</Badge>
            <p className="mt-2 text-xs text-ink-soft">{r.desc}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="skeleton h-64 rounded-lg" />
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-cream-deep text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined</th>
                <th className="p-4">Status</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-cream-deep last:border-0">
                  <td className="p-4 text-sm font-medium text-ink">{u.name}</td>
                  <td className="p-4 text-sm text-ink-soft">{u.email}</td>
                  <td className="p-4">
                    <Badge tone={roleTone[u.role]}>{u.role.replace(/_/g, " ")}</Badge>
                  </td>
                  <td className="p-4 text-sm text-ink-soft">{formatDate(u.createdAt)}</td>
                  <td className="p-4">
                    <button onClick={() => toggleStatus(u)} disabled={togglingId === u._id} className="disabled:opacity-50">
                      <Badge tone={u.status === "active" ? "green" : "red"}>{togglingId === u._id ? "Updating..." : u.status}</Badge>
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <button onClick={() => openEdit(u)} className="text-ink-soft hover:text-gold">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => setDeleteId(u._id)} className="text-ink-soft hover:text-red-600">
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Admin User" : "Add Admin User"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="Full name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input required disabled={!!editing} type="email" placeholder="Email" className="input disabled:bg-cream-deep/40" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          {!editing && (
            <input required type="password" placeholder="Password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          )}
          <select className="select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            {roles.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <Button type="submit" loading={saving} className="w-full">
            Save User
          </Button>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Remove admin user?" message="This person will lose access to the admin panel immediately." />
    </div>
  );
}
