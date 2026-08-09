import { create } from "zustand";
import { persist } from "zustand/middleware";

function lineKey(item) {
  return `${item.productId}-${item.variant?.size || ""}-${item.variant?.color || ""}`;
}

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,

      addItem: (item) => {
        const items = [...get().items];
        const key = lineKey(item);
        const idx = items.findIndex((i) => lineKey(i) === key);
        if (idx >= 0) {
          items[idx] = { ...items[idx], quantity: items[idx].quantity + item.quantity };
        } else {
          items.push(item);
        }
        set({ items });
      },

      updateQuantity: (key, quantity) => {
        set({
          items: get()
            .items.map((i) => (lineKey(i) === key ? { ...i, quantity: Math.max(1, quantity) } : i))
            .filter((i) => i.quantity > 0),
        });
      },

      removeItem: (key) => {
        set({ items: get().items.filter((i) => lineKey(i) !== key) });
      },

      clearCart: () => set({ items: [], coupon: null }),

      applyCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),

      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "luxeora-cart" }
  )
);

export { lineKey };
