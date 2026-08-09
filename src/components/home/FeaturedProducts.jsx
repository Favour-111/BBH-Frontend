import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cachedGet } from "../../lib/api.js";
import Container from "../ui/Container.jsx";
import SectionHeading from "../ui/SectionHeading.jsx";
import ProductCard from "../shop/ProductCard.jsx";
import { ProductCardSkeleton } from "../ui/Skeleton.jsx";
import clsx from "clsx";

const tabs = [
  { key: "featured", label: "Featured", param: "featured" },
  { key: "bestSeller", label: "Best Sellers", param: "bestSeller" },
  { key: "newArrival", label: "New Arrivals", param: "newArrival" },
];

export default function FeaturedProducts() {
  const [active, setActive] = useState("featured");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const tab = tabs.find((t) => t.key === active);
    cachedGet(`/products?${tab.param}=true&limit=8`)
      .then(({ data }) => setProducts(data.products))
      .finally(() => setLoading(false));
  }, [active]);

  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="The Collection"
          title="Jewelry Worth Telling Stories About"
          subtitle="Discover pieces crafted to make you feel golden, inside and out."
          action={
            <Link to="/shop" className="text-xs font-medium uppercase tracking-widest text-gold hover:underline">
              View All Products
            </Link>
          }
        />

        <div className="mb-10 flex gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={clsx(
                "rounded-full px-5 py-2 text-xs font-medium uppercase tracking-wide transition",
                active === tab.key ? "bg-ink text-ivory" : "bg-cream-deep text-ink-soft hover:bg-cream-deep/70"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>

        {!loading && products.length === 0 && (
          <p className="py-10 text-center text-sm text-ink-soft">No products in this collection yet.</p>
        )}
      </Container>
    </section>
  );
}
