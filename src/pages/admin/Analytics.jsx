import { useEffect, useState } from "react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { adminApi } from "../../lib/api.js";
import { formatNaira } from "../../lib/format.js";
import PageHeader from "../../components/admin/PageHeader.jsx";
import StatCard from "../../components/admin/StatCard.jsx";
import { Wallet, ShoppingBag, TrendingUp, Users } from "lucide-react";

const COLORS = ["#b8860b", "#d4af6a", "#e8d9b5", "#191512", "#a89f92"];

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [days, setDays] = useState(30);

  useEffect(() => {
    adminApi.get("/analytics", { params: { days } }).then(({ data }) => setData(data));
  }, [days]);

  if (!data) return <div className="skeleton h-96 rounded-lg" />;

  const revenueData = data.revenueOverTime.map((d) => ({ date: d._id.slice(5), revenue: d.revenue }));
  const ordersData = data.ordersOverTime.map((d) => ({ date: d._id.slice(5), orders: d.orders }));
  const categoryData = data.categoryPerformance.map((c) => ({ name: c.name, value: c.revenue }));
  const customerData = data.customerGrowth.map((c) => ({ date: c._id.slice(5), customers: c.count }));

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Deep dive into revenue, orders and content performance."
        action={
          <select className="select w-auto" value={days} onChange={(e) => setDays(Number(e.target.value))}>
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Wallet} label="Total Revenue" value={formatNaira(data.summary.totalRevenue)} tone="green" />
        <StatCard icon={ShoppingBag} label="Total Orders" value={data.summary.totalOrders} />
        <StatCard icon={TrendingUp} label="Avg Order Value" value={formatNaira(data.summary.avgOrderValue)} tone="blue" />
        <StatCard icon={Users} label="Bookings / Collabs / Msgs" value={`${data.summary.bookingsCount} / ${data.summary.collabsCount} / ${data.summary.messagesCount}`} tone="purple" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Revenue Over Time">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="rev2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#b8860b" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#b8860b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3ead9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#a89f92" />
              <YAxis tick={{ fontSize: 11 }} stroke="#a89f92" tickFormatter={(v) => `₦${v / 1000}k`} />
              <Tooltip formatter={(v) => formatNaira(v)} />
              <Area type="monotone" dataKey="revenue" stroke="#b8860b" fill="url(#rev2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Orders Over Time">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={ordersData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3ead9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#a89f92" />
              <YAxis tick={{ fontSize: 11 }} stroke="#a89f92" allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="orders" fill="#191512" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Category Performance">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatNaira(v)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Customer Growth">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={customerData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3ead9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#a89f92" />
              <YAxis tick={{ fontSize: 11 }} stroke="#a89f92" allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="customers" fill="#d4af6a" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="mb-4 font-semibold text-ink">{title}</h3>
      {children}
    </div>
  );
}
