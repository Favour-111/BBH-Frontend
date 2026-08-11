import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ShieldCheck, Truck, RefreshCcw, HelpCircle } from "lucide-react";
import api, { getErrorMessage } from "../lib/api.js";
import { useCartStore } from "../store/cartStore.js";
import { useAuth } from "../context/AuthContext.jsx";
import { formatNaira } from "../lib/format.js";
import { mediaUrl } from "../lib/media.js";
import Container from "../components/ui/Container.jsx";
import Button from "../components/ui/Button.jsx";

const NIGERIAN_STATES = [
  "Lagos", "Abuja", "Rivers", "Oyo", "Kano", "Kaduna", "Enugu", "Delta", "Edo", "Imo",
  "Anambra", "Ogun", "Ondo", "Osun", "Ekiti", "Cross River", "Akwa Ibom", "Plateau", "Katsina", "Sokoto",
];

export default function Checkout() {
  const { items } = useCartStore();
  const subtotal = useCartStore((s) => s.subtotal());
  const { user } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    addressLine1: "",
    addressLine2: "",
    country: "Nigeria",
    state: "",
    city: "",
    postalCode: "",
    instructions: "",
  });
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) api.get("/addresses").then(({ data }) => setAddresses(data.addresses));
  }, [user]);

  useEffect(() => {
    if (!selectedAddressId) return;
    const addr = addresses.find((a) => a._id === selectedAddressId);
    if (addr) {
      setForm((f) => ({
        ...f,
        fullName: addr.fullName,
        phone: addr.phone,
        addressLine1: addr.addressLine1,
        addressLine2: addr.addressLine2,
        state: addr.state,
        city: addr.city,
        postalCode: addr.postalCode,
        instructions: addr.instructions,
      }));
    }
  }, [selectedAddressId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (items.length === 0) return <Navigate to="/cart" replace />;

  const discount = coupon
    ? coupon.type === "percentage"
      ? Math.min((subtotal * coupon.value) / 100, coupon.maxDiscount || Infinity)
      : coupon.type === "fixed"
      ? coupon.value
      : 0
    : 0;

  const applyCoupon = async () => {
    if (!couponCode) return;
    setCouponLoading(true);
    try {
      const { data } = await api.get("/coupons/validate", { params: { code: couponCode, subtotal } });
      setCoupon(data.coupon);
      toast.success("Coupon applied!");
    } catch (err) {
      toast.error(getErrorMessage(err));
      setCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post("/orders", {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, variant: i.variant, name: i.name })),
        shippingAddress: form,
        email: form.email,
        couponCode: coupon?.code,
      });

      if (data.payment?.authorization_url) {
        localStorage.setItem("luxeora-pending-order", data.order.orderNumber);
        window.location.href = data.payment.authorization_url;
      } else {
        // Free order (100% discount) - already effectively paid at 0
        navigate(`/order-success?ref=${data.order.paystackReference}`);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-10">
      <Steps current={2} />

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl text-ink">Checkout</h2>
              {!user && (
                <Link to="/login" className="text-xs text-gold hover:underline">
                  Already have an account? Log in
                </Link>
              )}
            </div>

            {addresses.length > 0 && (
              <div className="mb-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink">Saved Addresses</p>
                <div className="flex flex-wrap gap-2">
                  {addresses.map((a) => (
                    <button
                      type="button"
                      key={a._id}
                      onClick={() => setSelectedAddressId(a._id)}
                      className={`rounded-sm border px-4 py-2 text-left text-xs ${
                        selectedAddressId === a._id ? "border-ink bg-ink text-ivory" : "border-cream-deep text-ink-soft"
                      }`}
                    >
                      {a.label}   {a.addressLine1}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink">Contact Information</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input required placeholder="Full Name" className="input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              <input required type="email" placeholder="Email Address" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input required placeholder="Phone Number" className="input sm:col-span-2" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>

            <h3 className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wide text-ink">Delivery Address</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input required placeholder="Street Address" className="input sm:col-span-2" value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} />
              <input placeholder="Apartment, suite, unit (optional)" className="input sm:col-span-2" value={form.addressLine2} onChange={(e) => setForm({ ...form, addressLine2: e.target.value })} />
              <select required className="select" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}>
                <option value="">Select State</option>
                {NIGERIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <input required placeholder="City" className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              <input placeholder="Postal Code" className="input" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
              <input placeholder="Delivery Instructions (optional)" className="input" value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} />
            </div>
          </div>

          <Button type="submit" loading={submitting} className="w-full sm:w-auto">
            Continue to Payment
          </Button>
        </form>

        <div className="h-fit space-y-5 rounded-lg bg-white p-6 shadow-sm">
          <h3 className="font-display text-xl text-ink">Order Summary ({items.length} items)</h3>
          <div className="max-h-64 space-y-3 overflow-y-auto">
            {items.map((item) => (
              <div key={item.productId + (item.variant?.size || "")} className="flex items-center gap-3">
                <img src={mediaUrl(item.image)} className="h-12 w-12 rounded-md object-cover" alt={item.name} />
                <div className="flex-1">
                  <p className="text-xs font-medium text-ink line-clamp-1">{item.name}</p>
                  <p className="text-[11px] text-ink-soft">Qty: {item.quantity}</p>
                </div>
                <p className="text-xs font-medium">{formatNaira(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="input" />
            <Button type="button" variant="outline" size="sm" loading={couponLoading} onClick={applyCoupon}>
              Apply
            </Button>
          </div>

          <div className="space-y-2 border-t border-cream-deep pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-soft">Subtotal</span>
              <span>{formatNaira(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount ({coupon.code})</span>
                <span>-{formatNaira(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-ink-soft">Shipping</span>
              <span>Calculated next step</span>
            </div>
          </div>
          <div className="flex justify-between border-t border-cream-deep pt-3 text-base font-semibold">
            <span>Total</span>
            <span>{formatNaira(Math.max(0, subtotal - discount))}</span>
          </div>

          <div className="space-y-3 border-t border-cream-deep pt-4 text-xs text-ink-soft">
            <p className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-gold" /> Secure Checkout   Powered by Paystack
            </p>
            <p className="flex items-center gap-2">
              <Truck size={14} className="text-gold" /> Fast & Reliable Delivery
            </p>
            <p className="flex items-center gap-2">
              <RefreshCcw size={14} className="text-gold" /> 7-day Return Policy
            </p>
            <p className="flex items-center gap-2">
              <HelpCircle size={14} className="text-gold" /> Need help? Contact +234 812 345 6789
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}

function Steps({ current }) {
  const steps = ["Cart", "Checkout", "Payment", "Confirmation"];
  return (
    <div>
      <div className="flex items-center justify-between gap-2 sm:hidden">
        <span className="text-xs font-medium text-ink">
          Step {current} of {steps.length} <span className="font-normal text-ink-soft">&middot; {steps[current - 1]}</span>
        </span>
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-cream-deep sm:hidden">
        <div
          className="h-full rounded-full bg-gold transition-all"
          style={{ width: `${(current / steps.length) * 100}%` }}
        />
      </div>

      <div className="hidden items-center justify-center gap-3 sm:flex">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                i + 1 <= current ? "bg-gold text-white" : "border border-cream-deep text-ink-soft"
              }`}
            >
              {i + 1}
            </div>
            <span className={`text-xs ${i + 1 === current ? "font-medium text-ink" : "text-ink-soft"}`}>{s}</span>
            {i < steps.length - 1 && <div className="h-px w-10 bg-cream-deep" />}
          </div>
        ))}
      </div>
    </div>
  );
}
