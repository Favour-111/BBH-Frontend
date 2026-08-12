import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Check, X, Trash2, Star, Loader2 } from "lucide-react";
import { adminApi, getErrorMessage } from "../../lib/api.js";
import { formatDate } from "../../lib/format.js";
import PageHeader from "../../components/admin/PageHeader.jsx";
import Badge from "../../components/ui/Badge.jsx";
import { ConfirmDialog } from "../../components/ui/Modal.jsx";
import StarRating from "../../components/ui/StarRating.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import clsx from "clsx";
import { mediaUrl } from "../../lib/media.js";

const tabs = ["all", "pending", "approved", "rejected"];

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [actioningId, setActioningId] = useState(null);

  const load = () => {
    setLoading(true);
    adminApi.get("/reviews", { params: { status } }).then(({ data }) => setReviews(data.reviews)).finally(() => setLoading(false));
  };
  useEffect(load, [status]);

  const updateStatus = async (id, newStatus) => {
    setActioningId(id);
    try {
      await adminApi.put(`/reviews/${id}`, { status: newStatus });
      toast.success(`Review ${newStatus}.`);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActioningId(null);
    }
  };

  const toggleFeatured = async (review) => {
    setActioningId(review._id);
    try {
      await adminApi.put(`/reviews/${review._id}`, { featured: !review.featured });
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActioningId(null);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminApi.delete(`/reviews/${deleteId}`);
      toast.success("Review deleted.");
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
      <PageHeader title="Reviews" description="Moderate and manage customer product reviews." />

      <div className="mb-6 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setStatus(t)}
            className={clsx("rounded-full px-4 py-1.5 text-xs font-medium capitalize", status === t ? "bg-ink text-ivory" : "bg-cream-deep text-ink-soft")}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="skeleton h-64 rounded-lg" />
      ) : reviews.length === 0 ? (
        <div className="rounded-lg bg-white p-10 shadow-sm">
          <EmptyState icon={Star} title="No reviews found" message="Reviews will appear here once customers submit them." />
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="rounded-lg bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={mediaUrl(r.product?.images?.[0]?.url)} className="h-12 w-12 rounded-md object-cover" alt="" />
                  <div>
                    <p className="text-sm font-medium text-ink">{r.product?.name}</p>
                    <p className="text-xs text-ink-soft">by {r.user?.name} &bull; {formatDate(r.createdAt)}</p>
                    <StarRating rating={r.rating} size={12} />
                  </div>
                </div>
                <Badge tone={r.status === "approved" ? "green" : r.status === "rejected" ? "red" : "amber"}>{r.status}</Badge>
              </div>
              {r.title && <p className="mt-3 text-sm font-medium text-ink">{r.title}</p>}
              <p className="mt-1 text-sm text-ink-soft">{r.comment}</p>
              <div className="mt-4 flex items-center gap-3 border-t border-cream-deep pt-3">
                {r.status !== "approved" && (
                  <button
                    onClick={() => updateStatus(r._id, "approved")}
                    disabled={actioningId === r._id}
                    className="flex items-center gap-1 text-xs text-emerald-600 hover:underline disabled:opacity-50"
                  >
                    {actioningId === r._id ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Approve
                  </button>
                )}
                {r.status !== "rejected" && (
                  <button
                    onClick={() => updateStatus(r._id, "rejected")}
                    disabled={actioningId === r._id}
                    className="flex items-center gap-1 text-xs text-red-500 hover:underline disabled:opacity-50"
                  >
                    {actioningId === r._id ? <Loader2 size={13} className="animate-spin" /> : <X size={13} />} Reject
                  </button>
                )}
                <button
                  onClick={() => toggleFeatured(r)}
                  disabled={actioningId === r._id}
                  className={clsx("flex items-center gap-1 text-xs hover:underline disabled:opacity-50", r.featured ? "text-gold" : "text-ink-soft")}
                >
                  {actioningId === r._id ? <Loader2 size={13} className="animate-spin" /> : <Star size={13} className={r.featured ? "fill-gold" : ""} />}{" "}
                  {r.featured ? "Featured" : "Feature on homepage"}
                </button>
                <button onClick={() => setDeleteId(r._id)} className="ml-auto flex items-center gap-1 text-xs text-ink-soft hover:text-red-600">
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Delete review?" message="This review will be permanently removed." />
    </div>
  );
}
