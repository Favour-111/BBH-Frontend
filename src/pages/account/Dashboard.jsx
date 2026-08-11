import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, PackageCheck, Heart, Crown } from "lucide-react";
import api from "../../lib/api.js";
import { formatNaira, formatDate } from "../../lib/format.js";
import { mediaUrl } from "../../lib/media.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Badge from "../../components/ui/Badge.jsx";

const statusTone = { delivered: "green", shipped: "blue", processing: "amber", pending: "gray", cancelled: "red" };

export default function Dashboard() {
  const { user, wishlistIds } = useAuth();
  const [orders, setOrders] = useState([]);
  const [trackingNumber, setTrackingNumber] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/orders/mine").then(({ data }) => setOrders(data.orders));
  }, []);

  const delivered = orders.filter((o) => o.orderStatus === "delivered").length;
  const points = user?.luxePoints || 0;

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackingNumber.trim()) navigate(`/track-order?order=${trackingNumber.trim()}`);
  };

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">
        {greeting}, {user?.name?.split(" ")[0]} <span className="text-gold">✨</span>
      </h1>
      <p className="mt-1 text-sm text-ink-soft">Here's what's happening with your account today.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={ShoppingBag} label="Total Orders" value={orders.length} />
        <StatCard icon={PackageCheck} label="Orders Delivered" value={delivered} />
        <StatCard icon={Heart} label="Wishlist Items" value={wishlistIds?.length || 0} />
        <StatCard icon={Crown} label="Luxe Points" value={points} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-xl text-ink">Recent Orders</h3>
            <Link to="/account/orders" className="text-xs font-medium text-gold hover:underline">
              View all orders &rarr;
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-soft">No orders yet   time to treat yourself!</p>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 4).map((o) => (
                <Link key={o._id} to={`/account/orders/${o._id}`} className="flex items-center gap-4 border-b border-cream-deep pb-4 last:border-0">
                  <img src={mediaUrl(o.products[0]?.image)} className="h-14 w-14 rounded-md object-cover" alt="" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink">{o.products[0]?.name}</p>
                    <p className="text-xs text-ink-soft">
                      {formatNaira(o.total)} &bull; {formatDate(o.createdAt)}
                    </p>
                  </div>
                  <Badge tone={statusTone[o.orderStatus]}>{o.orderStatus}</Badge>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-1 font-display text-lg text-ink">Order Tracking</h3>
            <p className="mb-4 text-xs text-ink-soft">Track your recent order</p>
            <form onSubmit={handleTrack} className="flex gap-2">
              <input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter your order number"
                className="input text-xs"
              />
              <button className="whitespace-nowrap rounded-sm bg-ink px-4 py-2 text-xs font-medium text-ivory">Track</button>
            </form>
          </div>

          <div className="rounded-lg bg-cream-deep/60 p-6">
            <h3 className="mb-1 font-display text-lg text-ink">Beauty by Horbah's Rewards</h3>
            <p className="mb-3 text-xs text-gold">You're earning amazing rewards!</p>
            <p className="text-sm font-medium text-ink">{points} / 1000 points</p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white">
              <div className="h-full bg-gold" style={{ width: `${Math.min(100, (points / 1000) * 100)}%` }} />
            </div>
            <p className="mt-2 text-[11px] text-ink-soft">{Math.max(0, 1000 - points)} points to reach Gold Tier</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-gold/10 text-gold">
        <Icon size={16} />
      </div>
      <p className="font-display text-2xl text-ink">{value}</p>
      <p className="text-xs text-ink-soft">{label}</p>
    </div>
  );
}
