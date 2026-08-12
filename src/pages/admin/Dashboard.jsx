import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Wallet, Users, Package, Clock, AlertTriangle, Plus, FolderPlus, Ticket, Image, Users2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { adminApi } from "../../lib/api.js";
import { formatNaira, formatDate } from "../../lib/format.js";
import { mediaUrl } from "../../lib/media.js";
import StatCard from "../../components/admin/StatCard.jsx";
import Badge from "../../components/ui/Badge.jsx";

const statusTone = { delivered: "green", shipped: "blue", processing: "amber", pending: "gray", cancelled: "red" };

const quickActions = [
  { to: "/admin/products/new", label: "Add Product", icon: Plus },
  { to: "/admin/categories", label: "Add Category", icon: FolderPlus },
  { to: "/admin/coupons", label: "Create Coupon", icon: Ticket },
  { to: "/admin/content", label: "Add Content", icon: Image },
  { to: "/admin/users", label: "Manage Users", icon: Users2 },
];

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    adminApi.get("/analytics/dashboard").then(({ data }) => setData(data));
  }, []);

  if (!data) return <div className="skeleton h-96 rounded-lg" />;

  const { stats, lowStockProducts, recentOrders, topProducts, salesOverTime } = data;
  const chartData = salesOverTime.map((d) => ({ date: d._id.slice(5), revenue: d.revenue }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard icon={ShoppingBag} label="Total Orders" value={stats.totalOrders} hint={`+${stats.ordersThisMonth} this month`} hintTone="green" />
        <StatCard icon={Wallet} label="Total Revenue" value={formatNaira(stats.revenue)} hint={`${formatNaira(stats.revenueThisMonth)} this month`} hintTone="green" tone="green" />
        <StatCard icon={Users} label="Total Customers" value={stats.totalCustomers} hint={`+${stats.customersThisMonth} this month`} hintTone="green" tone="blue" />
        <StatCard icon={Package} label="Total Products" value={stats.totalProducts} hint={`+${stats.productsThisMonth} new`} hintTone="green" tone="purple" />
        <StatCard icon={Clock} label="Pending Orders" value={stats.pendingOrders} hint="Needs attention" hintTone="amber" tone="amber" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-ink">Sales Overview (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#b8860b" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#b8860b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3ead9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#a89f92" />
              <YAxis tick={{ fontSize: 11 }} stroke="#a89f92" tickFormatter={(v) => `₦${v / 1000}k`} />
              <Tooltip formatter={(v) => formatNaira(v)} />
              <Area type="monotone" dataKey="revenue" stroke="#b8860b" fill="url(#rev)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-ink">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs text-gold hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.map((o) => (
              <Link key={o._id} to={`/admin/orders/${o._id}`} className="flex items-center justify-between border-b border-cream-deep pb-3 last:border-0">
                <div>
                  <p className="text-sm font-medium text-ink">#{o.orderNumber}</p>
                  <p className="text-xs text-ink-soft">{o.user?.name || "Guest"}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatNaira(o.total)}</p>
                  <Badge tone={statusTone[o.orderStatus]}>{o.orderStatus}</Badge>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-ink">Top Selling Products</h3>
            <Link to="/admin/products" className="text-xs text-gold hover:underline">
              View all products
            </Link>
          </div>
          <div className="space-y-3">
            {topProducts.map((p) => (
              <div key={p._id} className="flex items-center gap-3">
                <img src={mediaUrl(p.images?.[0]?.url)} className="h-10 w-10 rounded-md object-cover" alt="" />
                <div className="flex-1">
                  <p className="text-sm text-ink line-clamp-1">{p.name}</p>
                  <p className="text-xs text-ink-soft">{p.soldCount} sold</p>
                </div>
                <p className="text-sm font-medium">{formatNaira(p.salePrice || p.price)}</p>
              </div>
            ))}
            {topProducts.length === 0 && <p className="text-sm text-ink-soft">No sales data yet.</p>}
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-semibold text-ink">
              <AlertTriangle size={15} className="text-amber-500" /> Low Stock Alert
            </h3>
            <Link to="/admin/products?stockStatus=low-stock" className="text-xs text-gold hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {lowStockProducts.map((p) => (
              <div key={p._id} className="flex items-center gap-3">
                <img src={mediaUrl(p.images?.[0]?.url)} className="h-10 w-10 rounded-md object-cover" alt="" />
                <p className="flex-1 text-sm text-ink line-clamp-1">{p.name}</p>
                <span className="text-xs font-medium text-red-500">Stock: {p.stock}</span>
              </div>
            ))}
            {lowStockProducts.length === 0 && <p className="text-sm text-ink-soft">All products are well stocked.</p>}
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-semibold text-ink">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {quickActions.map((a) => (
            <Link key={a.to} to={a.to} className="flex flex-col items-center gap-2 rounded-lg border border-cream-deep p-4 text-center hover:border-gold hover:bg-gold/5">
              <a.icon size={20} className="text-gold" />
              <span className="text-xs font-medium text-ink">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
