import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/api.js";
import { formatNaira } from "../../lib/format.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCartStore } from "../../store/cartStore.js";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Button from "../../components/ui/Button.jsx";

export default function Wishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toggleWishlist, wishlistLoadingId } = useAuth();
  const addItem = useCartStore((s) => s.addItem);

  const load = () => {
    setLoading(true);
    api
      .get("/wishlist")
      .then(({ data }) => setProducts(data.wishlist.products))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (id) => {
    await toggleWishlist(id);
    setProducts((p) => p.filter((prod) => prod._id !== id));
  };

  const moveAllToCart = () => {
    products.forEach((p) => {
      if (p.stock > 0) {
        addItem({
          productId: p._id,
          name: p.name,
          image: p.images?.[0]?.url,
          price: p.salePrice || p.price,
          quantity: 1,
          slug: p.slug,
        });
      }
    });
    toast.success("Moved available items to your cart");
  };

  if (loading) return <div className="skeleton h-64 rounded-lg" />;

  if (products.length === 0) {
    return (
      <div className="rounded-lg bg-white p-10 shadow-sm">
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          message="Save your favorite pieces here so you never lose track of them."
          action={
            <Link to="/shop">
              <Button>Browse Jewelry</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">My Wishlist ({products.length})</h1>
        <Button size="sm" onClick={moveAllToCart}>
          Move All to Bag
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <div key={p._id} className="rounded-lg bg-white p-3 shadow-sm">
            <Link to={`/product/${p.slug}`} className="block aspect-square overflow-hidden rounded-md bg-cream-deep">
              <img src={p.images?.[0]?.url} alt={p.name} className="h-full w-full object-cover" />
            </Link>
            <div className="mt-3">
              <Link to={`/product/${p.slug}`} className="text-sm font-medium text-ink line-clamp-1 hover:text-gold">
                {p.name}
              </Link>
              <p className="text-sm text-ink-soft">{formatNaira(p.salePrice || p.price)}</p>
              <p className={`text-xs ${p.stock > 0 ? "text-emerald-600" : "text-red-500"}`}>
                {p.stock > 0 ? "In Stock" : "Out of Stock"}
              </p>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                disabled={p.stock <= 0}
                onClick={() =>
                  addItem({ productId: p._id, name: p.name, image: p.images?.[0]?.url, price: p.salePrice || p.price, quantity: 1, slug: p.slug })
                }
                className="flex flex-1 items-center justify-center gap-1.5 rounded-sm bg-ink py-2 text-[11px] font-medium uppercase text-ivory disabled:opacity-40"
              >
                <ShoppingBag size={12} /> Add
              </button>
              <button
                onClick={() => remove(p._id)}
                disabled={wishlistLoadingId === p._id}
                className="rounded-sm border border-cream-deep px-2.5 text-ink-soft hover:text-red-600 disabled:opacity-50"
              >
                {wishlistLoadingId === p._id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
