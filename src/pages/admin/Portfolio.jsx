import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, Star, Image as ImageIcon } from "lucide-react";
import { adminApi, getErrorMessage } from "../../lib/api.js";
import { formatDate } from "../../lib/format.js";
import PageHeader from "../../components/admin/PageHeader.jsx";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Modal, { ConfirmDialog } from "../../components/ui/Modal.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { mediaUrl } from "../../lib/media.js";

const categories = ["makeup", "jewelry", "content", "campaigns"];

const emptyForm = {
  title: "",
  category: "makeup",
  platform: "tiktok",
  url: "",
  thumbnail: "",
  caption: "",
  client: "",
  date: "",
  featured: false,
  status: "published",
};

export default function AdminPortfolio() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [fetchingPreview, setFetchingPreview] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.get("/portfolio", { params: { admin: true } }).then(({ data }) => setItems(data.items)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };
  const openEdit = (item) => {
    setEditing(item);
    setForm({ ...item, date: item.date?.slice(0, 10) });
    setModalOpen(true);
  };

  const fetchPreview = async () => {
    if (!form.url) return toast.error("Paste the post URL first.");
    setFetchingPreview(true);
    try {
      const { data } = await adminApi.get("/content/resolve", { params: { url: form.url, platform: form.platform } });
      setForm((f) => ({ ...f, thumbnail: data.thumbnail || f.thumbnail, caption: f.caption || data.caption || "" }));
      toast.success(`Thumbnail fetched from ${form.platform === "instagram" ? "Instagram" : "TikTok"}.`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setFetchingPreview(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await adminApi.put(`/portfolio/${editing._id}`, form);
        toast.success("Portfolio item updated.");
      } else {
        await adminApi.post("/portfolio", form);
        toast.success("Portfolio item created.");
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
      await adminApi.delete(`/portfolio/${deleteId}`);
      toast.success("Portfolio item deleted.");
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
        title="Portfolio"
        description="Showcase your makeup, jewelry, content and campaign work from TikTok and Instagram."
        action={
          <Button onClick={openNew}>
            <Plus size={15} /> Add Project
          </Button>
        }
      />

      {loading ? (
        <div className="skeleton h-64 rounded-lg" />
      ) : items.length === 0 ? (
        <div className="rounded-lg bg-white p-10 shadow-sm">
          <EmptyState icon={ImageIcon} title="No portfolio items yet" message="Add your first project to build your portfolio." />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item._id} className="overflow-hidden rounded-lg bg-white shadow-sm">
              <a href={item.url} target="_blank" rel="noreferrer" className="block aspect-[4/3] bg-cream-deep">
                {item.thumbnail && <img src={mediaUrl(item.thumbnail)} alt={item.title} className="h-full w-full object-cover" />}
              </a>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-medium text-ink line-clamp-1">{item.title}</h3>
                  {item.featured && <Star size={13} className="shrink-0 fill-gold text-gold" />}
                </div>
                <p className="text-xs text-ink-soft">{item.client} &bull; {formatDate(item.date)}</p>
                <div className="mt-2 flex items-center justify-between">
                  <Badge tone="gray">{item.category}</Badge>
                  <Badge tone={item.status === "published" ? "green" : "gray"}>{item.status}</Badge>
                </div>
                <div className="mt-3 flex gap-3 border-t border-cream-deep pt-3">
                  <button onClick={() => openEdit(item)} className="text-ink-soft hover:text-gold">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => setDeleteId(item._id)} className="text-ink-soft hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Project" : "Add Project"} maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="Project title" className="input col-span-2" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <select className="select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select className="select" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}>
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
            </select>
            <input placeholder="Client / Brand" className="input" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} />
            <input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <select className="select col-span-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="flex gap-2">
            <input
              required
              placeholder="TikTok or Instagram post URL"
              className="input flex-1"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              onBlur={() => !form.thumbnail && form.url && fetchPreview()}
            />
            <Button type="button" variant="outline" loading={fetchingPreview} onClick={fetchPreview} className="whitespace-nowrap">
              Fetch Thumbnail
            </Button>
          </div>
          <p className="-mt-2 text-xs text-ink-soft">
            Paste the post link above and we'll pull its cover image and caption automatically. Tapping the project still opens the real post.
          </p>
          {form.thumbnail && (
            <div className="flex items-center gap-3 rounded-md border border-cream-deep p-2">
              <img src={mediaUrl(form.thumbnail)} alt="Thumbnail preview" className="h-14 w-14 rounded object-cover" />
              <span className="text-xs text-ink-soft">Thumbnail preview</span>
            </div>
          )}
          <input placeholder="Thumbnail image URL" className="input" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} />
          {!form.thumbnail && <p className="-mt-2 text-xs text-red-500">A thumbnail is required — fetch one above or paste an image URL.</p>}

          <textarea placeholder="Caption" className="textarea" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Feature this project
          </label>
          <Button type="submit" loading={saving} className="w-full">
            Save Project
          </Button>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Delete project?" message="This portfolio item will be permanently removed." />
    </div>
  );
}
