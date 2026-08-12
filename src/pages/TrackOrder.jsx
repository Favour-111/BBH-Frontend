import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, PackageCheck, PackageX } from "lucide-react";
import api, { getErrorMessage } from "../lib/api.js";
import { formatNaira, formatDateTime } from "../lib/format.js";
import { mediaUrl } from "../lib/media.js";
import Container from "../components/ui/Container.jsx";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";

const steps = ["pending", "processing", "shipped", "delivered"];
const stepLabels = { pending: "Order Placed", processing: "Processing", shipped: "Shipped", delivered: "Delivered" };

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("order") || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const { data } = await api.get(`/orders/track/${orderNumber.trim()}`);
      setOrder(data.order);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const cancelled = order?.orderStatus === "cancelled";
  const currentIdx = steps.indexOf(order?.orderStatus);

  return (
    <Container className="py-14">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl text-ink">Track Your Order</h1>
        <p className="mt-2 text-sm text-ink-soft">Enter your order number to see real-time status updates.</p>

        <form onSubmit={handleSearch} className="mx-auto mt-8 flex max-w-md gap-2">
          <input
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="e.g. LXZ-2024-05876"
            className="input"
          />
          <Button type="submit" loading={loading}>
            <Search size={15} /> Track
          </Button>
        </form>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>

      {order && (
        <div className="mx-auto mt-12 max-w-3xl space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white p-6 shadow-sm">
            <div>
              <p className="font-display text-xl text-ink">Order #{order.orderNumber}</p>
              <p className="text-xs text-ink-soft">Placed on {formatDateTime(order.createdAt)}</p>
            </div>
            <Badge tone={cancelled ? "red" : order.orderStatus === "delivered" ? "green" : "amber"}>
              {order.orderStatus}
            </Badge>
          </div>

          {cancelled ? (
            <div className="flex items-center gap-3 rounded-lg bg-red-50 p-6 text-red-700">
              <PackageX size={22} /> This order was cancelled.
            </div>
          ) : (
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between">
                {steps.map((s, i) => (
                  <div key={s} className="flex flex-1 flex-col items-center">
                    <div className="flex w-full items-center">
                      <div className={`h-px flex-1 ${i === 0 ? "invisible" : i <= currentIdx ? "bg-gold" : "bg-cream-deep"}`} />
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs ${
                          i <= currentIdx ? "bg-gold text-white" : "border border-cream-deep text-ink-soft"
                        }`}
                      >
                        {i <= currentIdx ? <PackageCheck size={14} /> : i + 1}
                      </div>
                      <div className={`h-px flex-1 ${i === steps.length - 1 ? "invisible" : i < currentIdx ? "bg-gold" : "bg-cream-deep"}`} />
                    </div>
                    <span className="mt-2 text-center text-[11px] text-ink-soft">{stepLabels[s]}</span>
                  </div>
                ))}
              </div>
              {order.trackingNumber && (
                <p className="mt-6 text-center text-xs text-ink-soft">
                  Courier: <strong>{order.courier}</strong> &bull; Tracking No: <strong>{order.trackingNumber}</strong>
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink">Delivery Address</h4>
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
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink">Order Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-soft">Subtotal</span> <span>{formatNaira(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft">Shipping</span> <span>{formatNaira(order.shipping)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span> <span>{formatNaira(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wide text-ink">Items in this Order ({order.products.length})</h4>
            <div className="space-y-3">
              {order.products.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={mediaUrl(item.image)} className="h-12 w-12 rounded-md object-cover" alt={item.name} />
                  <div className="flex-1">
                    <p className="text-sm text-ink">{item.name}</p>
                    <p className="text-xs text-ink-soft">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">{formatNaira(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
