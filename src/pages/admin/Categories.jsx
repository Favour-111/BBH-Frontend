import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, FolderTree } from "lucide-react";
import { adminApi, getErrorMessage } from "../../lib/api.js";
import PageHeader from "../../components/admin/PageHeader.jsx";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Modal, { ConfirmDialog } from "../../components/ui/Modal.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { ImageManager } from "../../components/admin/MediaManager.jsx";

const emptyForm = { name: "", description: "", image: "", status: "active" };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.get("/categories", { params: { admin: true } }).then(({ data }) => setCategories(data.categories)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };
  const openEdit = (c) => {
    setEditing(c);
    setForm({ name: c.name, description: c.description, image: c.image, status: c.status });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await adminApi.put(`/categories/${editing._id}`, form);
        toast.success("Category updated successfully.");
      } else {
        await adminApi.post("/categories", form);
        toast.success("Category created successfully.");
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
      await adminApi.delete(`/categories/${deleteId}`);
      toast.success("Category deleted.");
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
        title="Categories"
        description="Organize your jewelry catalog into categories."
        action={
          <Button onClick={openNew}>
            <Plus size={15} /> Add Category
          </Button>
        }
      />

      {loading ? (
        <div className="skeleton h-64 rounded-lg" />
      ) : categories.length === 0 ? (
        <div className="rounded-lg bg-white p-10 shadow-sm">
          <EmptyState icon={FolderTree} title="No categories yet" message="Create your first category to organize products." />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div key={c._id} className="overflow-hidden rounded-lg bg-white shadow-sm">
              <div className="aspect-[16/9] bg-cream-deep">
                {c.image && <img src={c.image} alt={c.name} className="h-full w-full object-cover" />}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-ink">{c.name}</h3>
                  <Badge tone={c.status === "active" ? "green" : "gray"}>{c.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-ink-soft line-clamp-2">{c.description}</p>
                <div className="mt-3 flex items-center justify-between border-t border-cream-deep pt-3">
                  <span className="text-xs text-ink-soft">{c.productCount} products</span>
                  <div className="flex gap-3">
                    <button onClick={() => openEdit(c)} className="text-ink-soft hover:text-gold">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => setDeleteId(c._id)} className="text-ink-soft hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Category" : "Add Category"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="Category name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <textarea placeholder="Description" className="textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div>
            <p className="mb-2 text-xs font-medium text-ink-soft">Category Image</p>
            <ImageManager
              images={form.image ? [{ url: form.image }] : []}
              onChange={(imgs) => setForm({ ...form, image: imgs[0]?.url || "" })}
            />
          </div>
          <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Button type="submit" loading={saving} className="w-full">
            Save Category
          </Button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete category?"
        message="Categories with existing products cannot be deleted. Reassign those products first."
      />
    </div>
  );
}
