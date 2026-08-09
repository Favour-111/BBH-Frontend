import { useState } from "react";
import { Play, ChevronDown, ChevronUp } from "lucide-react";
import clsx from "clsx";

export default function MediaGallery({ images = [], videos = [] }) {
  const media = [...images.map((img) => ({ type: "image", ...img })), ...videos.map((v) => ({ type: "video", ...v }))];
  const [activeIdx, setActiveIdx] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const active = media[activeIdx] || media[0];
  const visibleThumbs = showAll ? media : media.slice(0, 5);

  const selectMedia = (idx) => setActiveIdx(idx);

  if (!active) {
    return <div className="aspect-square w-full rounded-md bg-cream-deep" />;
  }

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      <div className="flex gap-3 sm:w-20 sm:flex-col">
        {visibleThumbs.map((m, idx) => (
          <button
            key={idx}
            onClick={() => selectMedia(idx)}
            className={clsx(
              "relative aspect-square w-16 shrink-0 overflow-hidden rounded-md border-2 sm:w-full",
              activeIdx === idx ? "border-gold" : "border-transparent"
            )}
          >
            <img src={m.type === "video" ? m.thumbnail || m.url : m.url} alt="" className="h-full w-full object-cover" />
            {m.type === "video" && (
              <span className="absolute inset-0 flex items-center justify-center bg-ink/30">
                <Play size={14} className="fill-white text-white" />
              </span>
            )}
          </button>
        ))}
        {media.length > 5 && (
          <button
            onClick={() => setShowAll((v) => !v)}
            className="flex aspect-square w-16 shrink-0 items-center justify-center rounded-md bg-cream-deep text-ink-soft sm:w-full"
          >
            {showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>

      <div className="relative flex-1 overflow-hidden rounded-md bg-cream-deep">
        {active.type === "image" ? (
          <img src={active.url} alt={active.alt} className="aspect-square w-full object-cover sm:aspect-[4/5]" />
        ) : (
          <a
            href={active.url}
            target="_blank"
            rel="noreferrer"
            className="group relative block aspect-square sm:aspect-[4/5]"
          >
            {active.thumbnail ? (
              <img src={active.thumbnail} alt={active.title || ""} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-cream-deep" />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-ink/20 transition group-hover:bg-ink/40">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-ink">
                <Play size={22} className="ml-0.5" />
              </span>
            </div>
          </a>
        )}
      </div>
    </div>
  );
}
