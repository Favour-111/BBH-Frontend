import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Loader2 } from "lucide-react";
import clsx from "clsx";
import { formatNaira } from "../../lib/format.js";
import { mediaUrl } from "../../lib/media.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCartStore } from "../../store/cartStore.js";
import toast from "react-hot-toast";
import StarRating from "../ui/StarRating.jsx";

export default function ProductCard({ product }) {
  const { user, wishlistIds, wishlistLoadingId, toggleWishlist } = useAuth();
  const addItem = useCartStore((s) => s.addItem);
  const isWishlisted = wishlistIds?.includes(product._id);
  const wishlistLoading = wishlistLoadingId === product._id;
  const price = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;
  const badge = product.newArrival ? "New" : product.bestSeller ? "Best Seller" : null;
  const outOfStock = product.stock <= 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (outOfStock) return;
    addItem({
      productId: product._id,
      name: product.name,
      image: product.images?.[0]?.url,
      price,
      quantity: 1,
      stock: product.stock,
      slug: product.slug,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-cream-deep">
        {product.images?.[0]?.url ? (
          <img
            src={mediaUrl(product.images[0].url)}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-soft/40">
            <ShoppingBag size={32} />
          </div>
        )}

        {badge && (
          <span className="absolute left-3 top-3 rounded-sm bg-ink px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-ivory">
            {badge}
          </span>
        )}
        {outOfStock && (
          <span className="absolute left-3 top-3 rounded-sm bg-red-600 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white">
            Out of Stock
          </span>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            if (!wishlistLoading) toggleWishlist(product._id);
          }}
          disabled={wishlistLoading}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition hover:bg-white disabled:opacity-70"
        >
          {wishlistLoading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Heart size={15} className={clsx(isWishlisted && "fill-red-500 text-red-500")} />
          )}
        </button>

        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="flex w-full items-center justify-center gap-2 bg-ink py-2.5 text-xs font-medium uppercase tracking-wider text-ivory hover:bg-gold disabled:opacity-60"
          >
            <ShoppingBag size={14} />
            {outOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <h3 className="font-display text-lg text-ink line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-ink">{formatNaira(price)}</span>
          {product.salePrice && product.salePrice < product.price && (
            <span className="text-xs text-ink-soft line-through">{formatNaira(product.price)}</span>
          )}
        </div>
        {product.ratingCount > 0 && <StarRating rating={product.ratingAvg} count={product.ratingCount} size={12} />}
      </div>
    </Link>
  );
}
