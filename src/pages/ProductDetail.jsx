import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, ShoppingBag, Truck, RefreshCcw, ShieldCheck, Headset, Minus, Plus, Loader2, Play, Star } from "lucide-react";
import toast from "react-hot-toast";
import api, { cachedGet, getErrorMessage } from "../lib/api.js";
import { formatNaira } from "../lib/format.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCartStore } from "../store/cartStore.js";
import Container from "../components/ui/Container.jsx";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";
import StarRating from "../components/ui/StarRating.jsx";
import MediaGallery from "../components/shop/MediaGallery.jsx";
import ProductCard from "../components/shop/ProductCard.jsx";
import PageLoader from "../components/ui/PageLoader.jsx";
import clsx from "clsx";

const tabs = ["Description", "Details", "Shipping", "Returns", "Reviews"];

export default function ProductDetail() {
  const { slug } = useParams();
  const { user, wishlistIds, wishlistLoadingId, toggleWishlist } = useAuth();
  const addItem = useCartStore((s) => s.addItem);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Description");
  const [length, setLength] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "", title: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    setLoading(true);
    cachedGet(`/products/${slug}`)
      .then(({ data }) => {
        setProduct(data.product);
        setRelated(data.related);
        setLength(data.product.lengths?.[0] || "");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!product) return;
    api.get(`/reviews/product/${product._id}`).then(({ data }) => setReviews(data.reviews));
    recordRecentlyViewed(product);
  }, [product]);

  if (loading) return <PageLoader />;
  if (!product) return <Container className="py-24 text-center">Product not found.</Container>;

  const price = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;
  const isWishlisted = wishlistIds?.includes(product._id);
  const wishlistLoading = wishlistLoadingId === product._id;
  const outOfStock = product.stock <= 0;
  const wornVideos = product.videos?.filter((v) => v.type === "worn" || v.type === "styling") || [];

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      name: product.name,
      image: product.images?.[0]?.url,
      price,
      quantity,
      variant: { size: length },
      stock: product.stock,
      slug: product.slug,
    });
    toast.success("Added to cart");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = "/checkout";
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please log in to leave a review.");
    setSubmittingReview(true);
    try {
      await api.post("/reviews", { productId: product._id, ...reviewForm });
      toast.success("Thanks! Your review is pending approval.");
      setReviewForm({ rating: 5, comment: "", title: "" });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <Container className="py-10">
      <p className="mb-6 text-xs uppercase tracking-widest text-ink-soft">
        <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <Link to={`/shop?category=${product.category?.slug}`}>{product.category?.name}</Link> /{" "}
        {product.name}
      </p>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <MediaGallery images={product.images} videos={product.videos} />

        <div>
          {product.bestSeller && <Badge tone="gold">Best Seller</Badge>}
          <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">{product.name}</h1>
          <div className="mt-2 flex items-center gap-3">
            <StarRating rating={product.ratingAvg} count={product.ratingCount} />
            <a href="#reviews" className="text-xs text-gold hover:underline">
              Write a review
            </a>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="font-display text-3xl text-ink">{formatNaira(price)}</span>
            {product.salePrice && product.salePrice < product.price && (
              <span className="text-lg text-ink-soft line-through">{formatNaira(product.price)}</span>
            )}
            <Badge tone={outOfStock ? "red" : "green"}>{outOfStock ? "Out of Stock" : "In Stock"}</Badge>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-ink-soft">{product.shortDescription}</p>

          <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-ink-soft sm:grid-cols-4">
            <Feature icon={ShieldCheck} label="Hypoallergenic" />
            <Feature icon={RefreshCcw} label="Tarnish Free" />
            <Feature icon={Truck} label="Fast Delivery" />
            <Feature icon={Headset} label="Premium Quality" />
          </div>

          {product.materials?.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink">Material</p>
              <div className="flex flex-wrap gap-2">
                {product.materials.map((m) => (
                  <Badge key={m} tone="gray">
                    {m}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {product.lengths?.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink">Length</p>
              <div className="flex gap-2">
                {product.lengths.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLength(l)}
                    className={clsx(
                      "rounded-sm border px-4 py-2 text-xs font-medium",
                      length === l ? "border-ink bg-ink text-ivory" : "border-cream-deep text-ink-soft hover:border-ink"
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-sm border border-cream-deep">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-3">
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="p-3">
                <Plus size={14} />
              </button>
            </div>
            <button
              onClick={() => toggleWishlist(product._id)}
              disabled={wishlistLoading}
              className="flex items-center gap-2 rounded-sm border border-cream-deep px-4 py-3 text-xs font-medium uppercase tracking-wide hover:border-ink disabled:opacity-60"
            >
              {wishlistLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Heart size={14} className={clsx(isWishlisted && "fill-red-500 text-red-500")} />
              )}{" "}
              {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
          </div>

          <div className="mt-5 flex gap-3">
            <Button onClick={handleAddToCart} disabled={outOfStock} variant="outline" className="flex-1">
              <ShoppingBag size={15} /> Add to Cart
            </Button>
            <Button onClick={handleBuyNow} disabled={outOfStock} variant="gold" className="flex-1">
              Buy Now
            </Button>
          </div>
          <p className="mt-3 text-center text-xs text-ink-soft">Secure checkout powered by Paystack</p>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-2 gap-4 rounded-lg bg-cream-deep/50 p-6 sm:grid-cols-4">
        <Feature icon={Truck} label="Free Shipping" sub="On orders over ₦100,000" />
        <Feature icon={RefreshCcw} label="Easy Returns" sub="7-day return policy" />
        <Feature icon={ShieldCheck} label="Secure Payment" sub="100% secure payment" />
        <Feature icon={Headset} label="Customer Support" sub="We're here to help" />
      </div>

      <div className="mt-16">
        <div className="flex gap-8 overflow-x-auto border-b border-cream-deep">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "shrink-0 border-b-2 pb-4 text-sm font-medium",
                activeTab === tab ? "border-gold text-ink" : "border-transparent text-ink-soft"
              )}
            >
              {tab} {tab === "Reviews" && `(${reviews.length})`}
            </button>
          ))}
        </div>

        <div className="py-8">
          {activeTab === "Description" && (
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr]">
              <p className="text-sm leading-relaxed text-ink-soft">{product.description}</p>
              {wornVideos.length > 0 && (
                <div>
                  <h4 className="mb-3 font-display text-lg text-ink">See It In Action</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {wornVideos.slice(0, 3).map((v) => (
                      <a
                        key={v._id}
                        href={v.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group relative block aspect-[3/4] overflow-hidden rounded-md bg-cream-deep"
                      >
                        {v.thumbnail && <img src={v.thumbnail} alt={v.title || ""} className="h-full w-full object-cover" />}
                        <div className="absolute inset-0 flex items-center justify-center bg-ink/20 transition group-hover:bg-ink/40">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink">
                            <Play size={14} className="ml-0.5" />
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === "Details" && (
            <dl className="grid grid-cols-1 gap-x-10 gap-y-3 text-sm sm:grid-cols-2">
              <Detail label="SKU" value={product.sku} />
              <Detail label="Category" value={product.category?.name} />
              <Detail label="Materials" value={product.materials?.join(", ")} />
              <Detail label="Dimensions" value={product.dimensions} />
              <Detail label="Weight" value={product.weight} />
              <Detail label="Colors" value={product.colors?.join(", ")} />
            </dl>
          )}
          {activeTab === "Shipping" && (
            <p className="max-w-xl text-sm leading-relaxed text-ink-soft">
              We deliver across all 36 states in Nigeria within 1-5 business days depending on location. Orders over
              ₦100,000 qualify for free shipping. You'll receive a tracking number as soon as your order ships.
            </p>
          )}
          {activeTab === "Returns" && (
            <p className="max-w-xl text-sm leading-relaxed text-ink-soft">
              Not the right fit? We accept returns within 7 days of delivery for unworn items in original packaging.
              Contact hello@beautybyhorbahs.com to start a return.
            </p>
          )}
          {activeTab === "Reviews" && (
            <div id="reviews" className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.3fr]">
              <form onSubmit={submitReview} className="space-y-4 rounded-lg bg-cream-deep/40 p-6">
                <h4 className="font-display text-lg text-ink">Write a Review</h4>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" onClick={() => setReviewForm((f) => ({ ...f, rating: n }))}>
                      <Star
                        size={20}
                        className={clsx(n <= reviewForm.rating ? "fill-gold text-gold" : "fill-gold-soft/40 text-gold-soft")}
                      />
                    </button>
                  ))}
                </div>
                <input
                  placeholder="Review title"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))}
                  className="input"
                />
                <textarea
                  required
                  placeholder="Share your experience with this product..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                  className="textarea"
                />
                <Button type="submit" loading={submittingReview} size="sm">
                  Submit Review
                </Button>
              </form>

              <div className="space-y-6">
                {reviews.length === 0 && <p className="text-sm text-ink-soft">No reviews yet. Be the first!</p>}
                {reviews.map((r) => (
                  <div key={r._id} className="border-b border-cream-deep pb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-soft/50 text-sm font-medium text-gold">
                          {r.user?.name?.[0] || "L"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink">{r.user?.name}</p>
                          <StarRating rating={r.rating} size={11} />
                        </div>
                      </div>
                    </div>
                    {r.title && <p className="mt-2 text-sm font-medium text-ink">{r.title}</p>}
                    <p className="mt-1 text-sm text-ink-soft">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h3 className="mb-8 font-display text-2xl text-ink">You May Also Like</h3>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {related.slice(0, 5).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}

function Feature({ icon: Icon, label, sub }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={16} className="shrink-0 text-gold" />
      <div>
        <p className="text-xs font-medium text-ink">{label}</p>
        {sub && <p className="text-[11px] text-ink-soft">{sub}</p>}
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between border-b border-cream-deep pb-2">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}

function recordRecentlyViewed(product) {
  try {
    const key = "luxeora-recently-viewed";
    const existing = JSON.parse(localStorage.getItem(key) || "[]").filter((p) => p._id !== product._id);
    const next = [
      { _id: product._id, name: product.name, slug: product.slug, images: product.images, price: product.price, salePrice: product.salePrice },
      ...existing,
    ].slice(0, 8);
    localStorage.setItem(key, JSON.stringify(next));
  } catch {
    // ignore
  }
}
