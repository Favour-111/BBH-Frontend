import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Eye } from "lucide-react";
import api from "../../lib/api.js";
import { formatNaira, formatDate } from "../../lib/format.js";
import { mediaUrl } from "../../lib/media.js";
import Badge from "../../components/ui/Badge.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Button from "../../components/ui/Button.jsx";

const statusTone = { delivered: "green", shipped: "blue", processing: "amber", pending: "gray", cancelled: "red" };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders/mine")
      .then(({ data }) => setOrders(data.orders))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="skeleton h-64 rounded-lg" />;

  if (orders.length === 0) {
    return (
      <div className="rounded-lg bg-white p-10 shadow-sm">
        <EmptyState
          icon={ShoppingBag}
          title="No orders yet"
          message="Your order history will show up here once you place your first order."
          action={
            <Link to="/shop">
              <Button>Start Shopping</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl text-ink">My Orders</h1>
      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        {orders.map((o) => (
          <div key={o._id} className="flex flex-wrap items-center gap-4 border-b border-cream-deep p-5 last:border-0">
            <img src={mediaUrl(o.products[0]?.image)} className="h-16 w-16 rounded-md object-cover" alt="" />
            <div className="flex-1">
              <p className="text-sm font-medium text-ink">#{o.orderNumber}</p>
              <p className="text-xs text-ink-soft">
                {o.products.length} item{o.products.length > 1 ? "s" : ""} &bull; {formatDate(o.createdAt)}
              </p>
            </div>
            <p className="text-sm font-medium">{formatNaira(o.total)}</p>
            <Badge tone={statusTone[o.orderStatus]}>{o.orderStatus}</Badge>
            <Link to={`/account/orders/${o._id}`} className="flex items-center gap-1.5 text-xs font-medium text-gold hover:underline">
              <Eye size={13} /> View
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
