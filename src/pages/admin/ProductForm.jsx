import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Save } from "lucide-react";
import { adminApi, getErrorMessage } from "../../lib/api.js";
import { useSiteData } from "../../context/SiteDataContext.jsx";
import { ImageManager, VideoManager } from "../../components/admin/MediaManager.jsx";
import Button from "../../components/ui/Button.jsx";
import PageLoader from "../../components/ui/PageLoader.jsx";

const emptyForm = {
  name: "",
  category: "",
  price: "",
  salePrice: "",
  stock: 0,
  description: "",
  shortDescription: "",
  materials: "",
  dimensions: "",
  weight: "",
  lengths: "",
  colors: "",
  images: [],
  videos: [],
  featured: false,
  bestSeller: false,
  newArrival: false,
  status: "published",
};

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const site = useSiteData();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    adminApi.get(`/products/id/${id}`).then(({ data }) => {
      const p = data.product;
      setForm({
        name: p.name,
        category: p.category?._id || p.category,
        price: p.price,
        salePrice: p.salePrice || "",
        stock: p.stock,
        description: p.description,
        shortDescription: p.shortDescription,
        materials: (p.materials || []).join(", "),
        dimensions: p.dimensions,
        weight: p.weight,
        lengths: (p.lengths || []).join(", "),
        colors: (p.colors || []).join(", "),
        images: p.images || [],
        videos: p.videos || [],
        featured: p.featured,
        bestSeller: p.bestSeller,
        newArrival: p.newArrival,
        status: p.status,
      });
      setLoading(false);
    });
  }, [id, isEdit]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) return toast.error("Please select a category.");
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      salePrice: form.salePrice ? Number(form.salePrice) : null,
      stock: Number(form.stock),
      materials: form.materials.split(",").map((s) => s.trim()).filter(Boolean),
      lengths: form.lengths.split(",").map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (isEdit) {
        await adminApi.put(`/products/${id}`, payload);
        toast.success("Product updated successfully.");
      } else {
        await adminApi.post("/products", payload);
        toast.success("Product created successfully.");
      }
      navigate("/admin/products");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="mb-6">
        <Link to="/admin/products" className="text-xs text-ink-soft hover:text-gold">
          &larr; Back to Products
        </Link>
        <h1 className="text-2xl font-semibold text-ink">{isEdit ? "Edit Product" : "Add New Product"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <Section title="Basic Information">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Product Name" full>
                <input required className="input" value={form.name} onChange={set("name")} />
              </Field>
              <Field label="Category">
                <select required className="select" value={form.category} onChange={set("category")}>
                  <option value="">Select category</option>
                  {(site?.categories || []).map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Stock Quantity">
                <input required type="number" min="0" className="input" value={form.stock} onChange={set("stock")} />
              </Field>
              <Field label="Price (₦)">
                <input required type="number" min="0" className="input" value={form.price} onChange={set("price")} />
              </Field>
              <Field label="Sale Price (₦, optional)">
                <input type="number" min="0" className="input" value={form.salePrice} onChange={set("salePrice")} />
              </Field>
              <Field label="Short Description" full>
                <input className="input" value={form.shortDescription} onChange={set("shortDescription")} />
              </Field>
              <Field label="Full Description" full>
                <textarea rows={5} className="textarea" value={form.description} onChange={set("description")} />
              </Field>
            </div>
          </Section>

          <Section title="Product Images">
            <ImageManager images={form.images} onChange={(images) => setForm((f) => ({ ...f, images }))} />
          </Section>

          <Section title="Product Videos">
            <VideoManager videos={form.videos} onChange={(videos) => setForm((f) => ({ ...f, videos }))} />
          </Section>

          <Section title="Additional Details">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Materials (comma separated)" full>
                <input placeholder="18K Gold Plated, Freshwater Pearl" className="input" value={form.materials} onChange={set("materials")} />
              </Field>
              <Field label="Dimensions">
                <input className="input" value={form.dimensions} onChange={set("dimensions")} />
              </Field>
              <Field label="Weight">
                <input className="input" value={form.weight} onChange={set("weight")} />
              </Field>
              <Field label="Available Lengths (comma separated)">
                <input placeholder="40cm, 45cm, 50cm" className="input" value={form.lengths} onChange={set("lengths")} />
              </Field>
              <Field label="Colors (comma separated)">
                <input placeholder="Gold, Silver" className="input" value={form.colors} onChange={set("colors")} />
              </Field>
            </div>
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Publish">
            <select className="select" value={form.status} onChange={set("status")}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <Button type="submit" loading={saving} className="mt-4 w-full">
              <Save size={14} /> {isEdit ? "Update Product" : "Create Product"}
            </Button>
          </Section>

          <Section title="Product Options">
            <div className="space-y-3">
              <Toggle label="Featured Product" checked={form.featured} onChange={set("featured")} />
              <Toggle label="Best Seller" checked={form.bestSeller} onChange={set("bestSeller")} />
              <Toggle label="New Arrival" checked={form.newArrival} onChange={set("newArrival")} />
            </div>
          </Section>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-ink">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children, full }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-xs font-medium text-ink-soft">{label}</span>
      {children}
    </label>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between">
      <span className="text-sm text-ink">{label}</span>
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 accent-gold" />
    </label>
  );
}
