import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PackageCheck } from "lucide-react";
import api from "../../lib/api.js";
import { formatNaira, formatDateTime } from "../../lib/format.js";
import { mediaUrl } from "../../lib/media.js";
import Badge from "../../components/ui/Badge.jsx";
import PageLoader from "../../components/ui/PageLoader.jsx";

const steps = ["pending", "processing", "shipped", "delivered"];
const statusTone = { delivered: "green", shipped: "blue", processing: "amber", pending: "gray", cancelled: "red" };

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.order))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader />;
  if (!order) return <p className="text-sm text-ink-soft">Order not found.</p>;

  const currentIdx = steps.indexOf(order.orderStatus);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/account/orders" className="text-xs text-ink-soft hover:text-gold">
            &larr; Back to Orders
          </Link>
          <h1 className="font-display text-2xl text-ink">Order #{order.orderNumber}</h1>
          <p className="text-xs text-ink-soft">Placed on {formatDateTime(order.createdAt)}</p>
        </div>
        <Badge tone={statusTone[order.orderStatus]}>{order.orderStatus}</Badge>
      </div>

      {order.orderStatus !== "cancelled" && (
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s} className="flex flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  <div className={`h-px flex-1 ${i === 0 ? "invisible" : i <= currentIdx ? "bg-gold" : "bg-cream-deep"}`} />
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs ${i <= currentIdx ? "bg-gold text-white" : "border border-cream-deep text-ink-soft"}`}>
                    {i <= currentIdx ? <PackageCheck size={14} /> : i + 1}
                  </div>
                  <div className={`h-px flex-1 ${i === steps.length - 1 ? "invisible" : i < currentIdx ? "bg-gold" : "bg-cream-deep"}`} />
                </div>
                <span className="mt-2 text-[11px] capitalize text-ink-soft">{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-ink">Items ({order.products.length})</h3>
          <div className="space-y-4">
            {order.products.map((item, i) => (
              <div key={i} className="flex items-center gap-4 border-b border-cream-deep pb-4 last:border-0">
                <img src={mediaUrl(item.image)} className="h-16 w-16 rounded-md object-cover" alt={item.name} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink">{item.name}</p>
                  <p className="text-xs text-ink-soft">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium">{formatNaira(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink">Delivery Address</h3>
            <p className="text-sm text-ink-soft">
              {order.shippingAddress.fullName}
              <br />
              {order.shippingAddress.addressLine1}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state}
              <br />
              {order.shippingAddress.phone}
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink">Payment Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-soft">Subtotal</span> <span>{formatNaira(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Shipping</span> <span>{formatNaira(order.shipping)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span> <span>-{formatNaira(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-cream-deep pt-2 font-semibold">
                <span>Total</span> <span>{formatNaira(order.total)}</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-ink-soft">Payment status: <span className="font-medium capitalize text-ink">{order.paymentStatus}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
