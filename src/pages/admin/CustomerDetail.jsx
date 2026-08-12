import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { adminApi, getErrorMessage } from "../../lib/api.js";
import { formatNaira, formatDate } from "../../lib/format.js";
import { mediaUrl } from "../../lib/media.js";
import Badge from "../../components/ui/Badge.jsx";
import PageLoader from "../../components/ui/PageLoader.jsx";

const statusTone = { delivered: "green", shipped: "blue", processing: "amber", pending: "gray", cancelled: "red" };

export default function AdminCustomerDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    adminApi.get(`/customers/${id}`).then(({ data }) => setData(data)).finally(() => setLoading(false));
  };
  useEffect(load, [id]);

  const toggleStatus = async () => {
    try {
      const nextStatus = data.customer.status === "active" ? "suspended" : "active";
      await adminApi.put(`/customers/${id}/status`, { status: nextStatus });
      toast.success(`Customer ${nextStatus === "active" ? "activated" : "suspended"}.`);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (loading) return <PageLoader />;
  if (!data) return <p>Customer not found.</p>;

  const { customer, orders, addresses, wishlist, reviews } = data;
  const totalSpent = orders.filter((o) => o.paymentStatus === "paid").reduce((s, o) => s + o.total, 0);

  return (
    <div>
      <Link to="/admin/customers" className="text-xs text-ink-soft hover:text-gold">
        &larr; Back to Customers
      </Link>

      <div className="mt-3 mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-soft/50 text-xl font-medium text-gold">
            {customer.name?.[0]}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-ink">{customer.name}</h1>
            <p className="text-sm text-ink-soft">{customer.email} &bull; {customer.phone || "No phone"}</p>
            <p className="text-xs text-ink-soft">Joined {formatDate(customer.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge tone={customer.status === "active" ? "green" : "red"}>{customer.status}</Badge>
          <button onClick={toggleStatus} className="rounded-sm border border-cream-deep px-4 py-2 text-xs font-medium hover:bg-cream-deep">
            {customer.status === "active" ? "Suspend" : "Activate"}
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatBox label="Total Orders" value={orders.length} />
        <StatBox label="Total Spent" value={formatNaira(totalSpent)} />
        <StatBox label="Addresses" value={addresses.length} />
        <StatBox label="Reviews" value={reviews.length} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-ink">Order History</h3>
          <div className="space-y-3">
            {orders.length === 0 && <p className="text-sm text-ink-soft">No orders yet.</p>}
            {orders.map((o) => (
              <Link key={o._id} to={`/admin/orders/${o._id}`} className="flex items-center justify-between border-b border-cream-deep pb-3 last:border-0">
                <div>
                  <p className="text-sm font-medium text-ink">#{o.orderNumber}</p>
                  <p className="text-xs text-ink-soft">{formatDate(o.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{formatNaira(o.total)}</p>
                  <Badge tone={statusTone[o.orderStatus]}>{o.orderStatus}</Badge>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-ink">Addresses</h3>
            {addresses.length === 0 ? (
              <p className="text-sm text-ink-soft">No saved addresses.</p>
            ) : (
              <div className="space-y-3">
                {addresses.map((a) => (
                  <div key={a._id} className="text-sm text-ink-soft">
                    <p className="font-medium text-ink">{a.label}</p>
                    {a.addressLine1}, {a.city}, {a.state}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-ink">Wishlist ({wishlist?.products?.length || 0})</h3>
            <div className="flex flex-wrap gap-2">
              {(wishlist?.products || []).map((p) => (
                <img key={p._id} src={mediaUrl(p.images?.[0]?.url)} className="h-12 w-12 rounded-md object-cover" alt={p.name} title={p.name} />
              ))}
              {(!wishlist?.products || wishlist.products.length === 0) && <p className="text-sm text-ink-soft">Empty wishlist.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <p className="text-lg font-semibold text-ink">{value}</p>
      <p className="text-xs text-ink-soft">{label}</p>
    </div>
  );
}
