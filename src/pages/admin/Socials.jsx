import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, Share2 } from "lucide-react";
import { adminApi, getErrorMessage } from "../../lib/api.js";
import PageHeader from "../../components/admin/PageHeader.jsx";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Modal, { ConfirmDialog } from "../../components/ui/Modal.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { InstagramIcon, TiktokIcon, YoutubeIcon } from "../../components/ui/SocialIcons.jsx";

const platformIcon = { instagram: InstagramIcon, tiktok: TiktokIcon, youtube: YoutubeIcon };

const emptyForm = { type: "jewelry", platform: "instagram", displayName: "", username: "", url: "", description: "", followers: 0, status: "active" };

export default function AdminSocials() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.get("/socials", { params: { admin: true } }).then(({ data }) => setAccounts(data.accounts)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };
  const openEdit = (a) => {
    setEditing(a);
    setForm(a);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, followers: Number(form.followers) || 0 };
      if (editing) {
        await adminApi.put(`/socials/${editing._id}`, payload);
        toast.success("Social account updated.");
      } else {
        await adminApi.post("/socials", payload);
        toast.success("Social account added.");
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
      await adminApi.delete(`/socials/${deleteId}`);
      toast.success("Social account removed.");
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
        title="Social Accounts"
        description="Manage your Jewelry and Creator Instagram, TikTok & YouTube accounts. Updates reflect across the whole site."
        action={
          <Button onClick={openNew}>
            <Plus size={15} /> Add Account
          </Button>
        }
      />

      {loading ? (
        <div className="skeleton h-64 rounded-lg" />
      ) : accounts.length === 0 ? (
        <div className="rounded-lg bg-white p-10 shadow-sm">
          <EmptyState icon={Share2} title="No social accounts yet" message="Add your Instagram, TikTok and YouTube accounts." />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((a) => {
            const Icon = platformIcon[a.platform] || Share2;
            return (
              <div key={a._id} className="rounded-lg bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/10 text-gold">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">{a.displayName}</p>
                      <p className="text-xs text-ink-soft">{a.username}</p>
                    </div>
                  </div>
                  <Badge tone={a.status === "active" ? "green" : "gray"}>{a.status}</Badge>
                </div>
                <p className="mt-3 text-xs uppercase tracking-wide text-gold">{a.type} Account</p>
                <p className="mt-1 text-sm font-semibold text-ink">{a.followers?.toLocaleString()} followers</p>
                <div className="mt-4 flex gap-3 border-t border-cream-deep pt-3">
                  <button onClick={() => openEdit(a)} className="text-ink-soft hover:text-gold">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => setDeleteId(a._id)} className="text-ink-soft hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Social Account" : "Add Social Account"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <select className="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="jewelry">Jewelry Account</option>
              <option value="creator">Creator Account</option>
            </select>
            <select className="select" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube</option>
            </select>
          </div>
          <input required placeholder="Display Name" className="input" value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} />
          <input required placeholder="Username (e.g. @beautybyhorbahs)" className="input" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <input required placeholder="Profile URL" className="input" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          <input type="number" placeholder="Followers count" className="input" value={form.followers} onChange={(e) => setForm({ ...form, followers: e.target.value })} />
          <textarea placeholder="Description" className="textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Button type="submit" loading={saving} className="w-full">
            Save Account
          </Button>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Remove social account?" message="This account link will be removed from the website." />
    </div>
  );
}
