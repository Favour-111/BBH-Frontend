import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore, lineKey } from "../store/cartStore.js";
import { useSiteData } from "../context/SiteDataContext.jsx";
import { formatNaira } from "../lib/format.js";
import Container from "../components/ui/Container.jsx";
import Button from "../components/ui/Button.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";

export default function Cart() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const subtotal = useCartStore((s) => s.subtotal());
  const site = useSiteData();
  const navigate = useNavigate();
  const threshold = site?.settings?.freeShippingThreshold || 100000;
  const remaining = Math.max(0, threshold - subtotal);
  const progress = Math.min(100, (subtotal / threshold) * 100);

  if (items.length === 0) {
    return (
      <Container className="py-24">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          message="Looks like you haven't added any jewelry yet. Explore the collection and find something you love."
          action={
            <Link to="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          }
        />
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <h1 className="font-display text-3xl text-ink">Your Cart ({items.length})</h1>
      <p className="mb-8 text-xs uppercase tracking-widest text-ink-soft">
        <Link to="/">Home</Link> / Cart
      </p>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-cream-deep text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="p-5">Product</th>
                <th className="p-5">Price</th>
                <th className="p-5">Quantity</th>
                <th className="p-5">Subtotal</th>
                <th className="p-5" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const key = lineKey(item);
                return (
                  <tr key={key} className="border-b border-cream-deep last:border-0">
                    <td className="flex items-center gap-4 p-5">
                      <img src={item.image} alt={item.name} className="h-16 w-16 rounded-md object-cover" />
                      <div>
                        <Link to={`/product/${item.slug}`} className="text-sm font-medium text-ink hover:text-gold">
                          {item.name}
                        </Link>
                        {item.variant?.size && <p className="text-xs text-ink-soft">Length: {item.variant.size}</p>}
                      </div>
                    </td>
                    <td className="p-5 text-sm">{formatNaira(item.price)}</td>
                    <td className="p-5">
                      <div className="flex w-fit items-center rounded-sm border border-cream-deep">
                        <button onClick={() => updateQuantity(key, item.quantity - 1)} className="p-2">
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(key, item.quantity + 1)} className="p-2">
                          <Plus size={12} />
                        </button>
                      </div>
                    </td>
                    <td className="p-5 text-sm font-medium">{formatNaira(item.price * item.quantity)}</td>
                    <td className="p-5">
                      <button onClick={() => removeItem(key)} className="text-ink-soft hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex items-center justify-between p-5">
            <Link to="/shop" className="text-xs font-medium uppercase tracking-wide text-ink-soft hover:text-gold">
              &larr; Continue Shopping
            </Link>
          </div>
        </div>

        <div className="h-fit space-y-5 rounded-lg bg-white p-6 shadow-sm">
          <h3 className="font-display text-xl text-ink">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-soft">Subtotal ({items.length} items)</span>
              <span>{formatNaira(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Shipping</span>
              <span>{subtotal >= threshold ? "Free" : "Calculated at checkout"}</span>
            </div>
          </div>
          <div className="flex justify-between border-t border-cream-deep pt-3 text-base font-semibold">
            <span>Total</span>
            <span>{formatNaira(subtotal)}</span>
          </div>

          {remaining > 0 ? (
            <div className="rounded-md bg-cream-deep/60 p-3 text-xs">
              <p className="mb-2">You are {formatNaira(remaining)} away from free shipping!</p>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white">
                <div className="h-full bg-gold" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <p className="rounded-md bg-emerald-50 p-3 text-xs text-emerald-700">You've unlocked free shipping! 🎉</p>
          )}

          <Button onClick={() => navigate("/checkout")} className="w-full">
            Proceed to Checkout
          </Button>
          <p className="text-center text-xs text-ink-soft">Secure checkout powered by Paystack</p>
        </div>
      </div>
    </Container>
  );
}
