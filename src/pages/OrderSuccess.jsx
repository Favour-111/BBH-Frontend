import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Copy, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/api.js";
import { formatNaira, formatDateTime } from "../lib/format.js";
import { useCartStore } from "../store/cartStore.js";
import Container from "../components/ui/Container.jsx";
import Button from "../components/ui/Button.jsx";
import PageLoader from "../components/ui/PageLoader.jsx";

const timelineSteps = ["pending", "processing", "shipped", "delivered"];

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref") || searchParams.get("ref");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    if (!reference) {
      setLoading(false);
      setError(true);
      return;
    }
    api
      .get(`/orders/verify/${reference}`)
      .then(({ data }) => {
        setOrder(data.order);
        clearCart();
        localStorage.removeItem("luxeora-pending-order");
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [reference]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <PageLoader />;

  if (error || !order) {
    return (
      <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <XCircle className="text-red-500" size={56} />
        <h1 className="mt-4 font-display text-3xl text-ink">We couldn't confirm this payment</h1>
        <p className="mt-3 max-w-sm text-sm text-ink-soft">
          If you were charged, please contact support with your reference number and we'll sort it out right away.
        </p>
        <Link to="/" className="mt-8">
          <Button>Back to Home</Button>
        </Link>
      </Container>
    );
  }

  const currentStepIdx = timelineSteps.indexOf(order.orderStatus);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    toast.success("Order number copied");
  };

  return (
    <Container className="grid grid-cols-1 gap-10 py-14 lg:grid-cols-[1fr_380px]">
      <div>
        <div className="flex flex-col items-center rounded-lg bg-white p-10 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="mt-5 font-display text-3xl text-ink">Thank You!</h1>
          <p className="mt-1 text-emerald-600">Your order was placed successfully.</p>
          <p className="mt-3 max-w-sm text-sm text-ink-soft">
            We've received your order and it's being processed. A confirmation email has been sent to your inbox.
          </p>

          <button
            onClick={copyOrderNumber}
            className="mt-6 flex items-center gap-2 rounded-md bg-cream-deep/60 px-5 py-3 text-sm font-medium text-ink"
          >
            Order Number: <span className="font-semibold">{order.orderNumber}</span> <Copy size={13} />
          </button>

          <div className="mt-10 flex w-full items-center justify-between">
            {timelineSteps.map((step, i) => (
              <div key={step} className="flex flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  <div className={`h-px flex-1 ${i === 0 ? "invisible" : i <= currentStepIdx ? "bg-emerald-500" : "bg-cream-deep"}`} />
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] ${
                      i <= currentStepIdx ? "bg-emerald-500 text-white" : "border border-cream-deep text-ink-soft"
                    }`}
                  >
                    {i <= currentStepIdx ? <CheckCircle2 size={14} /> : i + 1}
                  </div>
                  <div className={`h-px flex-1 ${i === timelineSteps.length - 1 ? "invisible" : i < currentStepIdx ? "bg-emerald-500" : "bg-cream-deep"}`} />
                </div>
                <span className="mt-2 text-[10px] capitalize text-ink-soft">{step}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex gap-3">
            <Link to="/track-order">
              <Button variant="outline">Track Order</Button>
            </Link>
            <Link to="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <InfoCard title="What happens next?">
            <ul className="space-y-1.5 text-xs text-ink-soft">
              <li>✓ We've received your order</li>
              <li>✓ Your order is being processed</li>
              <li>✓ You'll get an email when it ships</li>
              <li>✓ Track your order anytime</li>
            </ul>
          </InfoCard>
          <InfoCard title="Shipping To">
            <p className="text-xs text-ink-soft">
              {order.shippingAddress.fullName}
              <br />
              {order.shippingAddress.addressLine1}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state}
              <br />
              {order.shippingAddress.phone}
            </p>
          </InfoCard>
          <InfoCard title="Confirmation Sent">
            <p className="text-xs text-ink-soft">
              A confirmation email has been sent to <strong>{order.shippingAddress.email}</strong>
            </p>
          </InfoCard>
        </div>
      </div>

      <div className="h-fit space-y-4 rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl text-ink">Order Summary</h3>
          <span className="text-xs text-ink-soft">{order.products.length} items</span>
        </div>
        <div className="space-y-3">
          {order.products.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <img src={item.image} className="h-12 w-12 rounded-md object-cover" alt={item.name} />
              <div className="flex-1">
                <p className="text-xs font-medium text-ink line-clamp-1">{item.name}</p>
                <p className="text-[11px] text-ink-soft">Qty: {item.quantity}</p>
              </div>
              <p className="text-xs font-medium">{formatNaira(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2 border-t border-cream-deep pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-ink-soft">Subtotal</span>
            <span>{formatNaira(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-soft">Shipping</span>
            <span>{order.shipping === 0 ? "Free" : formatNaira(order.shipping)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Discount</span>
              <span>-{formatNaira(order.discount)}</span>
            </div>
          )}
        </div>
        <div className="flex justify-between border-t border-cream-deep pt-3 text-base font-semibold">
          <span>Total</span>
          <span>{formatNaira(order.total)}</span>
        </div>
        <div className="rounded-md bg-emerald-50 p-3 text-xs text-emerald-700">
          Payment Successful   processed securely via Paystack on {formatDateTime(order.createdAt)}.
        </div>
      </div>
    </Container>
  );
}

function InfoCard({ title, children }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink">{title}</p>
      {children}
    </div>
  );
}
