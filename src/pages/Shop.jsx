import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, ChevronLeft, ChevronRight, PackageSearch } from "lucide-react";
import { cachedGet } from "../lib/api.js";
import { useSiteData } from "../context/SiteDataContext.jsx";
import Container from "../components/ui/Container.jsx";
import ProductCard from "../components/shop/ProductCard.jsx";
import { ProductCardSkeleton } from "../components/ui/Skeleton.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import clsx from "clsx";
import shopBanner from "../../assets/image/imagechain.png";

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "best-selling", label: "Best Selling" },
  { value: "rating", label: "Top Rated" },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const site = useSiteData();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "newest";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const stockStatus = searchParams.get("stockStatus") || "";
  const page = Number(searchParams.get("page") || 1);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setSearchParams(next);
  };

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = { category, search, sort, minPrice, maxPrice, stockStatus, page, limit: 12 };
    Object.keys(params).forEach((k) => !params[k] && delete params[k]);
    cachedGet("/products", { params })
      .then(({ data }) => {
        setProducts(data.products);
        setPagination(data.pagination);
      })
      .finally(() => setLoading(false));
  }, [category, search, sort, minPrice, maxPrice, stockStatus, page]);

  useEffect(() => {
    fetchProducts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [fetchProducts]);

  const clearFilters = () => setSearchParams({});

  return (
    <div>
      <div className="relative h-56 overflow-hidden bg-ink sm:h-72">
        <img
          src={shopBanner}
          alt="Shop Jewelry"
          className="h-full w-full object-cover object-[85%_center] opacity-50 lg:object-center"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-14">
          <h1 className="font-display text-4xl text-ivory sm:text-5xl">Shop Jewelry</h1>
          <p className="mt-2 text-xs uppercase tracking-widest text-ivory/60">Home / Shop</p>
        </div>
      </div>

      <Container className="grid grid-cols-1 gap-10 py-12 lg:grid-cols-[260px_1fr]">
        <button
          onClick={() => setFiltersOpen(true)}
          className="flex items-center justify-center gap-2 rounded-sm border border-cream-deep py-3 text-xs font-medium uppercase tracking-wide lg:hidden"
        >
          <SlidersHorizontal size={14} /> Filters
        </button>

        <aside
          className={clsx(
            "space-y-8 lg:block",
            filtersOpen
              ? "fixed inset-0 z-[90] overflow-y-auto bg-ivory p-6"
              : "hidden"
          )}
        >
          {filtersOpen && (
            <div className="mb-4 flex items-center justify-between lg:hidden">
              <span className="font-display text-xl">Filters</span>
              <button onClick={() => setFiltersOpen(false)}>
                <X size={20} />
              </button>
            </div>
          )}

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink">Categories</h4>
            <ul className="space-y-1 text-sm">
              <li>
                <button
                  onClick={() => updateParam("category", "")}
                  className={clsx("w-full rounded-md px-3 py-2 text-left hover:bg-cream-deep", !category && "bg-cream-deep font-medium")}
                >
                  All Jewelry
                </button>
              </li>
              {(site?.categories || []).map((c) => (
                <li key={c._id}>
                  <button
                    onClick={() => updateParam("category", c.slug)}
                    className={clsx(
                      "flex w-full items-center justify-between rounded-md px-3 py-2 text-left hover:bg-cream-deep",
                      category === c.slug && "bg-cream-deep font-medium"
                    )}
                  >
                    {c.name} <span className="text-xs text-ink-soft">({c.productCount})</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => updateParam("category", "new-arrivals")}
                  className={clsx("w-full rounded-md px-3 py-2 text-left hover:bg-cream-deep", category === "new-arrivals" && "bg-cream-deep font-medium")}
                >
                  New Arrivals
                </button>
              </li>
              <li>
                <button
                  onClick={() => updateParam("category", "best-sellers")}
                  className={clsx("w-full rounded-md px-3 py-2 text-left hover:bg-cream-deep", category === "best-sellers" && "bg-cream-deep font-medium")}
                >
                  Best Sellers
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink">Filter by Price</h4>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                defaultValue={minPrice}
                onBlur={(e) => updateParam("minPrice", e.target.value)}
                className="input py-2 text-xs"
              />
              <span className="text-ink-soft">-</span>
              <input
                type="number"
                placeholder="Max"
                defaultValue={maxPrice}
                onBlur={(e) => updateParam("maxPrice", e.target.value)}
                className="input py-2 text-xs"
              />
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink">Availability</h4>
            <div className="space-y-2 text-sm">
              {[
                ["", "All"],
                ["in-stock", "In Stock"],
                ["out-of-stock", "Out of Stock"],
              ].map(([value, label]) => (
                <label key={value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="stock"
                    checked={stockStatus === value}
                    onChange={() => updateParam("stockStatus", value)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {(category || search || minPrice || maxPrice || stockStatus) && (
            <button onClick={clearFilters} className="text-xs font-medium text-gold hover:underline">
              Clear All Filters
            </button>
          )}

          {filtersOpen && (
            <button
              onClick={() => setFiltersOpen(false)}
              className="w-full bg-ink py-3 text-xs font-medium uppercase tracking-wide text-ivory lg:hidden"
            >
              Show {pagination.total} Results
            </button>
          )}
        </aside>

        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-soft">
              {loading ? "Loading..." : `Showing ${products.length ? (page - 1) * 12 + 1 : 0}-${(page - 1) * 12 + products.length} of ${pagination.total} results`}
            </p>
            <select value={sort} onChange={(e) => updateParam("sort", e.target.value)} className="select w-auto py-2 text-xs">
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Sort By: {opt.label}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title="No products found"
              message="Try adjusting your filters or search term."
              action={
                <button onClick={clearFilters} className="text-sm font-medium text-gold hover:underline">
                  Clear filters
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}

          {pagination.pages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => updateParam("page", String(page - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-sm border border-cream-deep disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: pagination.pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => updateParam("page", String(i + 1))}
                  className={clsx(
                    "flex h-9 w-9 items-center justify-center rounded-sm border text-sm",
                    page === i + 1 ? "border-ink bg-ink text-ivory" : "border-cream-deep hover:bg-cream-deep"
                  )}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={page >= pagination.pages}
                onClick={() => updateParam("page", String(page + 1))}
                className="flex h-9 w-9 items-center justify-center rounded-sm border border-cream-deep disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
