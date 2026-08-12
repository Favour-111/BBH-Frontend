import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, Star, Clapperboard } from "lucide-react";
import { adminApi, getErrorMessage } from "../../lib/api.js";
import { formatDate } from "../../lib/format.js";
import PageHeader from "../../components/admin/PageHeader.jsx";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Modal, { ConfirmDialog } from "../../components/ui/Modal.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import ContentMedia from "../../components/ui/ContentMedia.jsx";
import { mediaUrl } from "../../lib/media.js";

const platforms = ["instagram", "tiktok", "youtube"];
const accountTypes = ["jewelry", "creator"];
const categories = ["jewelry", "creator", "beauty-makeup", "lifestyle", "business", "tips"];

const emptyForm = {
  title: "",
  platform: "instagram",
  accountType: "creator",
  category: "creator",
  url: "",
  thumbnail: "",
  video: "",
  caption: "",
  featured: false,
  status: "published",
};

export default function AdminContent() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [fetchingPreview, setFetchingPreview] = useState(false);

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

  const load = () => {
    setLoading(true);
    adminApi.get("/content", { params: { admin: true } }).then(({ data }) => setItems(data.items)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };
  const openEdit = (item) => {
    setEditing(item);
    setForm(item);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await adminApi.put(`/content/${editing._id}`, form);
        toast.success("Content updated.");
      } else {
        await adminApi.post("/content", form);
        toast.success("Content published.");
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
      await adminApi.delete(`/content/${deleteId}`);
      toast.success("Content deleted.");
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
        title="Content"
        description="Manage Instagram, TikTok and YouTube content shown on your Content Hub."
        action={
          <Button onClick={openNew}>
            <Plus size={15} /> Add Content
          </Button>
        }
      />

      {loading ? (
        <div className="skeleton h-64 rounded-lg" />
      ) : items.length === 0 ? (
        <div className="rounded-lg bg-white p-10 shadow-sm">
          <EmptyState icon={Clapperboard} title="No content yet" message="Add Instagram, TikTok or YouTube content to populate your Content Hub." />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((item) => (
            <div key={item._id} className="overflow-hidden rounded-lg bg-white shadow-sm">
              <div className="aspect-[3/4] bg-cream-deep">
                <ContentMedia item={item} className="h-full w-full object-cover" />
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-ink line-clamp-1">{item.title}</p>
                <p className="text-[10px] capitalize text-ink-soft">{item.platform} &bull; {formatDate(item.publishedAt)}</p>
                <div className="mt-2 flex items-center justify-between">
                  <Badge tone={item.status === "published" ? "green" : "gray"}>{item.status}</Badge>
                  {item.featured && <Star size={12} className="fill-gold text-gold" />}
                </div>
                <div className="mt-2 flex gap-3 border-t border-cream-deep pt-2">
                  <button onClick={() => openEdit(item)} className="text-ink-soft hover:text-gold">
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => setDeleteId(item._id)} className="text-ink-soft hover:text-red-600">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Content" : "Add Content"} maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="Title" className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <div className="grid grid-cols-3 gap-4">
            <select className="select" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}>
              {platforms.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <select className="select" value={form.accountType} onChange={(e) => setForm({ ...form, accountType: e.target.value })}>
              {accountTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <select className="select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <input
              required
              placeholder="Post URL (Instagram / TikTok / YouTube link)"
              className="input flex-1"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              onBlur={() => (form.platform === "tiktok" || form.platform === "instagram") && !form.thumbnail && form.url && fetchPreview()}
            />
            {(form.platform === "tiktok" || form.platform === "instagram") && (
              <Button type="button" variant="outline" loading={fetchingPreview} onClick={fetchPreview} className="whitespace-nowrap">
                Fetch Thumbnail
              </Button>
            )}
          </div>
          {(form.platform === "tiktok" || form.platform === "instagram") && (
            <p className="-mt-2 text-xs text-ink-soft">
              Paste the {form.platform === "instagram" ? "Instagram" : "TikTok"} post link above and we'll pull its cover image automatically. Tapping the item still opens the real post on {form.platform === "instagram" ? "Instagram" : "TikTok"}.
            </p>
          )}
          {form.thumbnail && (
            <div className="flex items-center gap-3 rounded-md border border-cream-deep p-2">
              <img src={mediaUrl(form.thumbnail)} alt="Thumbnail preview" className="h-14 w-14 rounded object-cover" />
              <span className="text-xs text-ink-soft">Thumbnail preview</span>
            </div>
          )}
          <input placeholder="Thumbnail image URL" className="input" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} />
          <input placeholder="Video URL (optional — e.g. a direct .mp4 link)" className="input" value={form.video} onChange={(e) => setForm({ ...form, video: e.target.value })} />
          {!form.video && !form.thumbnail && (
            <p className="-mt-2 text-xs text-red-500">Add a thumbnail (or fetch one from TikTok above) — at least a thumbnail or video is required.</p>
          )}
          <textarea placeholder="Caption" className="textarea" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} />
          <div className="flex items-center gap-6">
            <select className="select w-auto" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured
            </label>
          </div>
          <Button type="submit" loading={saving} className="w-full">
            Save Content
          </Button>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Delete content?" message="This content item will be removed from the Content Hub." />
    </div>
  );
}
