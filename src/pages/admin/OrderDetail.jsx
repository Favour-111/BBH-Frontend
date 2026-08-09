import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Printer, Mail, RefreshCcw } from "lucide-react";
import { adminApi, getErrorMessage } from "../../lib/api.js";
import { formatNaira, formatDateTime } from "../../lib/format.js";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import { ConfirmDialog } from "../../components/ui/Modal.jsx";
import PageLoader from "../../components/ui/PageLoader.jsx";

const statusTone = { delivered: "green", shipped: "blue", processing: "amber", pending: "gray", cancelled: "red" };
const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [refunding, setRefunding] = useState(false);
  const [emailing, setEmailing] = useState(false);

  const load = () => {
    adminApi
      .get(`/orders/${id}`)
      .then(({ data }) => {
        setOrder(data.order);
        setStatus(data.order.orderStatus);
      })
      .finally(() => setLoading(false));
  };
  useEffect(load, [id]);

  const updateStatus = async () => {
    setSaving(true);
    try {
      await adminApi.put(`/orders/${id}/status`, { status });
      toast.success("Order status updated successfully.");
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const sendEmail = async () => {
    setEmailing(true);
    try {
      await adminApi.post(`/orders/${id}/resend-email`);
      toast.success("Confirmation email sent to customer.");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setEmailing(false);
    }
  };

  const refundOrder = async () => {
    setRefunding(true);
    try {
      await adminApi.post(`/orders/${id}/refund`);
      toast.success("Order refunded.");
      setRefundOpen(false);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setRefunding(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!order) return <p>Order not found.</p>;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/admin/orders" className="text-xs text-ink-soft hover:text-gold">
            &larr; Back to Orders
          </Link>
          <h1 className="text-2xl font-semibold text-ink">Order #{order.orderNumber}</h1>
          <p className="text-sm text-ink-soft">{formatDateTime(order.createdAt)}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer size={14} /> View Invoice
          </Button>
          <Button variant="outline" size="sm" loading={emailing} onClick={sendEmail}>
            <Mail size={14} /> Send Email
          </Button>
          <Button variant="danger" size="sm" onClick={() => setRefundOpen(true)} disabled={order.paymentStatus === "refunded"}>
            <RefreshCcw size={14} /> Refund Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-ink">Products ({order.products.length})</h3>
            <div className="space-y-4">
              {order.products.map((item, i) => (
                <div key={i} className="flex items-center gap-4 border-b border-cream-deep pb-4 last:border-0">
                  <img src={item.image} className="h-14 w-14 rounded-md object-cover" alt="" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink">{item.name}</p>
                    <p className="text-xs text-ink-soft">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">{formatNaira(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1 border-t border-cream-deep pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-soft">Subtotal</span> <span>{formatNaira(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Shipping</span> <span>{formatNaira(order.shipping)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount {order.couponCode && `(${order.couponCode})`}</span> <span>-{formatNaira(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-cream-deep pt-2 text-base font-semibold">
                <span>Total</span> <span>{formatNaira(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-ink">Order Timeline</h3>
            <div className="space-y-4">
              {order.timeline?.slice().reverse().map((t, i) => (
                <div key={i} className="flex gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold" />
                  <div>
                    <p className="text-sm capitalize text-ink">{t.status}</p>
                    <p className="text-xs text-ink-soft">{t.note}</p>
                    <p className="text-[11px] text-ink-soft/70">{formatDateTime(t.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink">Customer Information</h3>
            <p className="text-sm font-medium text-ink">{order.shippingAddress.fullName}</p>
            <p className="text-xs text-ink-soft">{order.shippingAddress.email}</p>
            <p className="text-xs text-ink-soft">{order.shippingAddress.phone}</p>
            {order.user && (
              <Link to={`/admin/customers/${order.user._id || order.user}`} className="mt-2 inline-block text-xs text-gold hover:underline">
                View customer profile &rarr;
              </Link>
            )}
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink">Delivery Address</h3>
            <p className="text-sm text-ink-soft">
              {order.shippingAddress.addressLine1}, {order.shippingAddress.addressLine2}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state}
              <br />
              {order.shippingAddress.country}
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink">Payment Information</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-soft">Status</span>
                <Badge tone={order.paymentStatus === "paid" ? "green" : "gray"}>{order.paymentStatus}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Method</span> <span className="capitalize">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Reference</span> <span className="text-xs">{order.paystackReference}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink">Order Status</h3>
            <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s[0].toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
            <Button className="mt-3 w-full" loading={saving} onClick={updateStatus}>
              Update Status
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={refundOpen}
        onClose={() => setRefundOpen(false)}
        onConfirm={refundOrder}
        loading={refunding}
        title="Refund this order?"
        message="This will mark the order as refunded and cancelled. This action should be confirmed with Paystack separately."
      />
    </div>
  );
}
