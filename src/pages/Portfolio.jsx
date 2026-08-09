import { useEffect, useState } from "react";
import { Play, ImageOff } from "lucide-react";
import { cachedGet } from "../lib/api.js";
import Container from "../components/ui/Container.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { InstagramIcon, TiktokIcon } from "../components/ui/SocialIcons.jsx";
import clsx from "clsx";

const categories = [
  { value: "all", label: "All Work" },
  { value: "makeup", label: "Makeup" },
  { value: "jewelry", label: "Jewelry" },
  { value: "content", label: "Content Creation" },
  { value: "campaigns", label: "Brand Campaigns" },
];

const platformIcon = { instagram: InstagramIcon, tiktok: TiktokIcon };

export default function Portfolio() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    cachedGet("/portfolio", { params: category !== "all" ? { category } : {} })
      .then(({ data }) => setItems(data.items))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div>
      <div className="relative h-56 overflow-hidden bg-ink sm:h-72">
        <img src="/images/portfolio-banner.jpg" alt="" className="h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-14">
          <h1 className="font-display text-4xl text-ivory sm:text-5xl">Portfolio</h1>
          <p className="mt-2 max-w-md text-sm text-ivory/70">A visual journey through makeup, jewelry, content and brand campaigns.</p>
        </div>
      </div>

      <Container className="py-12">
        <div className="mb-10 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={clsx(
                "rounded-full px-5 py-2 text-xs font-medium uppercase tracking-wide transition",
                category === c.value ? "bg-ink text-ivory" : "bg-cream-deep text-ink-soft hover:bg-cream-deep/70"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="skeleton aspect-[3/4] w-full rounded-md" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState icon={ImageOff} title="No projects yet" message="Check back soon for new work in this category." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {items.map((item) => {
              const Icon = platformIcon[item.platform] || TiktokIcon;
              return (
                <a
                  key={item._id}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative aspect-[3/4] overflow-hidden rounded-md bg-cream-deep"
                >
                  {item.thumbnail && (
                    <img src={item.thumbnail} alt={item.title} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
                  )}
                  <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink">
                    <Play size={13} />
                  </span>
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/85 via-ink/10 to-transparent p-4">
                    <div className="mb-1 flex items-center gap-1.5 text-gold-light">
                      <Icon size={12} />
                      <span className="text-[10px] uppercase tracking-wide">{item.client}</span>
                    </div>
                    <p className="text-sm text-ivory line-clamp-1">{item.caption || item.title}</p>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}
