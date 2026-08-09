import { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Search, Edit2, Trash2, Copy, Eye, Package, CheckCircle, FileEdit, AlertTriangle, Loader2 } from "lucide-react";
import { adminApi, getErrorMessage } from "../../lib/api.js";
import { formatNaira } from "../../lib/format.js";
import { useSiteData } from "../../context/SiteDataContext.jsx";
import PageHeader from "../../components/admin/PageHeader.jsx";
import StatCard from "../../components/admin/StatCard.jsx";
import Pagination from "../../components/admin/Pagination.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import { ConfirmDialog } from "../../components/ui/Modal.jsx";

export default function AdminProducts() {
  const [searchParams] = useSearchParams();
  const site = useSiteData();
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [stockStatus, setStockStatus] = useState(searchParams.get("stockStatus") || "");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [duplicatingId, setDuplicatingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    adminApi
      .get("/products", { params: { admin: true, search, category, status, stockStatus, page, limit: 10 } })
      .then(({ data }) => {
        setProducts(data.products);
        setPagination(data.pagination);
      })
      .finally(() => setLoading(false));
  }, [search, category, status, stockStatus, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    adminApi.get("/products/stats").then(({ data }) => setStats(data.stats));
  }, [products]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminApi.delete(`/products/${deleteId}`);
      toast.success("Product deleted successfully.");
      setDeleteId(null);
      fetchProducts();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const handleDuplicate = async (id) => {
    setDuplicatingId(id);
    try {
      await adminApi.post(`/products/${id}/duplicate`);
      toast.success("Product duplicated.");
      fetchProducts();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDuplicatingId(null);
    }
  };

  const togglePublish = async (product) => {
    setTogglingId(product._id);
    try {
      await adminApi.put(`/products/${product._id}`, { status: product.status === "published" ? "draft" : "published" });
      toast.success(`Product ${product.status === "published" ? "unpublished" : "published"}.`);
      fetchProducts();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Products"
        description="Add, edit and manage all your jewelry products."
        action={
          <Link to="/admin/products/new">
            <Button>
              <Plus size={15} /> Add New Product
            </Button>
          </Link>
        }
      />

      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard icon={Package} label="Total Products" value={stats.total} />
          <StatCard icon={CheckCircle} label="Published" value={stats.published} tone="green" />
          <StatCard icon={FileEdit} label="Draft" value={stats.draft} tone="amber" />
          <StatCard icon={AlertTriangle} label="Low / Out of Stock" value={stats.lowStock + stats.outOfStock} tone="red" />
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-cream-deep bg-white px-4 py-2.5">
          <Search size={15} className="text-ink-soft" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search products by name, SKU..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
        <select className="select w-auto" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {(site?.categories || []).map((c) => (
            <option key={c._id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select className="select w-auto" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <select className="select w-auto" value={stockStatus} onChange={(e) => setStockStatus(e.target.value)}>
          <option value="">All Stock</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-cream-deep text-left text-xs uppercase tracking-wide text-ink-soft">
              <th className="p-4">Product</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-sm text-ink-soft">
                  Loading products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-sm text-ink-soft">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p._id} className="border-b border-cream-deep last:border-0 hover:bg-cream/40">
                  <td className="flex items-center gap-3 p-4">
                    <img src={p.images?.[0]?.url} className="h-11 w-11 rounded-md object-cover" alt="" />
                    <div>
                      <p className="text-sm font-medium text-ink line-clamp-1">{p.name}</p>
                      {p.bestSeller && <span className="text-[10px] text-gold">Best Seller</span>}
                    </div>
                  </td>
                  <td className="p-4 text-xs text-ink-soft">{p.sku}</td>
                  <td className="p-4 text-sm text-ink-soft">{p.category?.name}</td>
                  <td className="p-4 text-sm font-medium">{formatNaira(p.salePrice || p.price)}</td>
                  <td className="p-4 text-sm">
                    <span className={p.stock <= 0 ? "text-red-500" : p.stock <= 5 ? "text-amber-600" : "text-emerald-600"}>{p.stock}</span>
                  </td>
                  <td className="p-4">
                    <button onClick={() => togglePublish(p)} disabled={togglingId === p._id} className="disabled:opacity-50">
                      <Badge tone={p.status === "published" ? "green" : "gray"}>{togglingId === p._id ? "Updating..." : p.status}</Badge>
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3 text-ink-soft">
                      <Link to={`/product/${p.slug}`} target="_blank" title="View" className="hover:text-gold">
                        <Eye size={15} />
                      </Link>
                      <Link to={`/admin/products/${p._id}/edit`} title="Edit" className="hover:text-gold">
                        <Edit2 size={15} />
                      </Link>
                      <button onClick={() => handleDuplicate(p._id)} disabled={duplicatingId === p._id} title="Duplicate" className="hover:text-gold disabled:opacity-50">
                        {duplicatingId === p._id ? <Loader2 size={15} className="animate-spin" /> : <Copy size={15} />}
                      </button>
                      <button onClick={() => setDeleteId(p._id)} title="Delete" className="hover:text-red-600">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this product?"
        message="This will permanently remove the product from your store. This cannot be undone."
      />
    </div>
  );
}
