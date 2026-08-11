import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Play, ShoppingBag } from "lucide-react";
import { cachedGet } from "../../lib/api.js";
import Container from "../ui/Container.jsx";
import SectionHeading from "../ui/SectionHeading.jsx";
import { formatNaira } from "../../lib/format.js";
import { mediaUrl } from "../../lib/media.js";

function VideoCard({ product, video }) {
  return (
    <div className="group relative aspect-[9/16] shrink-0 basis-[260px] overflow-hidden rounded-lg bg-ink">
      <a href={video.url} target="_blank" rel="noreferrer" aria-label="Watch on TikTok" className="absolute inset-0">
        {video.thumbnail ? (
          <img src={mediaUrl(video.thumbnail)} alt={video.title || product.name} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
        ) : (
          <div className="h-full w-full bg-cream-deep/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/20" />
        <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink">
          <Play size={16} className="ml-0.5" />
        </span>
      </a>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
        <p className="font-display text-lg text-ivory line-clamp-1">{product.name}</p>
        <p className="mb-3 text-sm text-gold-light">{formatNaira(product.salePrice || product.price)}</p>
        <Link
          to={`/product/${product.slug}`}
          className="pointer-events-auto relative inline-flex items-center gap-1.5 rounded-full bg-ivory px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-ink hover:bg-gold hover:text-ivory"
        >
          <ShoppingBag size={12} /> Shop This
        </Link>
      </div>
    </div>
  );
}

export default function VideoShowcase() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    cachedGet("/products?hasVideo=true&limit=8").then(({ data }) => {
      const list = [];
      data.products.forEach((p) => {
        p.videos?.slice(0, 1).forEach((v) => list.push({ product: p, video: v }));
      });
      setItems(list);
    });
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="bg-ink py-20">
      <Container>
        <SectionHeading
          eyebrow="In Motion"
          title="See the Jewelry in Motion"
          subtitle="Watch each piece come alive   styled, worn and shining."
          dark
        />
        <div className="flex gap-5 overflow-x-auto pb-4">
          {items.map((item, i) => (
            <VideoCard key={`${item.product._id}-${i}`} product={item.product} video={item.video} />
          ))}
        </div>
      </Container>
    </section>
  );
}
