import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search, Eye } from "lucide-react";
import { adminApi } from "../../lib/api.js";
import { formatNaira, formatDate } from "../../lib/format.js";
import PageHeader from "../../components/admin/PageHeader.jsx";
import StatCard from "../../components/admin/StatCard.jsx";
import Pagination from "../../components/admin/Pagination.jsx";
import Badge from "../../components/ui/Badge.jsx";
import { ShoppingBag, Clock, RefreshCcw, Truck, CheckCircle } from "lucide-react";
import clsx from "clsx";

const statusTone = { delivered: "green", shipped: "blue", processing: "amber", pending: "gray", cancelled: "red" };
const tabs = [
  { key: "all", label: "All Orders" },
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [counts, setCounts] = useState({});
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    adminApi
      .get("/orders/admin/all", { params: { status, search, page, limit: 10 } })
      .then(({ data }) => {
        setOrders(data.orders);
        setCounts(data.counts);
        setPagination(data.pagination);
      })
      .finally(() => setLoading(false));
  }, [status, search, page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div>
      <PageHeader title="Orders" description="Manage and track all customer orders" />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={ShoppingBag} label="Total Orders" value={total} />
        <StatCard icon={Clock} label="Pending" value={counts.pending || 0} tone="amber" />
        <StatCard icon={RefreshCcw} label="Processing" value={counts.processing || 0} tone="blue" />
        <StatCard icon={CheckCircle} label="Delivered" value={counts.delivered || 0} tone="green" />
      </div>

      <div className="mb-4 flex flex-wrap gap-2 border-b border-cream-deep pb-4">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setStatus(t.key);
              setPage(1);
            }}
            className={clsx(
              "rounded-full px-4 py-1.5 text-xs font-medium",
              status === t.key ? "bg-ink text-ivory" : "bg-cream-deep text-ink-soft hover:bg-cream-deep/70"
            )}
          >
            {t.label} {t.key !== "all" && counts[t.key] ? `(${counts[t.key]})` : ""}
          </button>
        ))}
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-md border border-cream-deep bg-white px-4 py-2.5">
        <Search size={15} className="text-ink-soft" />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by order ID, customer name, email..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-cream-deep text-left text-xs uppercase tracking-wide text-ink-soft">
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Date</th>
              <th className="p-4">Total</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-sm text-ink-soft">
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-sm text-ink-soft">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o._id} className="border-b border-cream-deep last:border-0 hover:bg-cream/40">
                  <td className="p-4 text-sm font-medium text-ink">#{o.orderNumber}</td>
                  <td className="p-4 text-sm">
                    <p className="text-ink">{o.user?.name || o.shippingAddress?.fullName || "Guest"}</p>
                    <p className="text-xs text-ink-soft">{o.user?.email || o.shippingAddress?.email}</p>
                  </td>
                  <td className="p-4 text-sm text-ink-soft">{formatDate(o.createdAt)}</td>
                  <td className="p-4 text-sm font-medium">{formatNaira(o.total)}</td>
                  <td className="p-4">
                    <Badge tone={o.paymentStatus === "paid" ? "green" : o.paymentStatus === "failed" ? "red" : "gray"}>{o.paymentStatus}</Badge>
                  </td>
                  <td className="p-4">
                    <Badge tone={statusTone[o.orderStatus]}>{o.orderStatus}</Badge>
                  </td>
                  <td className="p-4">
                    <Link to={`/admin/orders/${o._id}`} className="text-ink-soft hover:text-gold">
                      <Eye size={16} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} />
    </div>
  );
}
