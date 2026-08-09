import { useEffect, useState } from "react";
import { Play, ImageOff } from "lucide-react";
import { cachedGet } from "../lib/api.js";
import { useSiteData } from "../context/SiteDataContext.jsx";
import Container from "../components/ui/Container.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { InstagramIcon, TiktokIcon, YoutubeIcon } from "../components/ui/SocialIcons.jsx";
import ContentMedia from "../components/ui/ContentMedia.jsx";
import clsx from "clsx";
import contentBanner from "../../assets/image/imageb.png";

const platformIcon = { instagram: InstagramIcon, tiktok: TiktokIcon, youtube: YoutubeIcon };

function ContentCard({ item }) {
  return (
    <a href={item.url} target="_blank" rel="noreferrer" className="group relative aspect-[3/4] shrink-0 basis-[240px] overflow-hidden rounded-md bg-cream-deep sm:basis-auto">
      <ContentMedia item={item} className="h-full w-full object-cover transition group-hover:scale-105" />
      {item.video && (
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink">
          <Play size={13} />
        </span>
      )}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/85 via-ink/10 to-transparent p-4">
        <p className="truncate text-sm text-ivory">{item.caption || item.title}</p>
      </div>
    </a>
  );
}

function RowSkeleton() {
  return (
    <div className="mb-14">
      <div className="mb-5 h-7 w-48 skeleton rounded" />
      <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton aspect-[3/4] shrink-0 basis-[240px] rounded-md sm:basis-auto" />
        ))}
      </div>
    </div>
  );
}

function Row({ title, items, platform }) {
  if (items.length === 0) return null;
  return (
    <div className="mb-14">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-display text-2xl text-ink">
          {platform && platformIcon[platform] && (() => {
            const Icon = platformIcon[platform];
            return <Icon size={20} className="text-gold" />;
          })()}
          {title}
        </h3>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-4 lg:grid-cols-6">
        {items.map((item) => (
          <ContentCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function Content() {
  const site = useSiteData();
  const [all, setAll] = useState([]);
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    cachedGet("/content?limit=60")
      .then(({ data }) => setAll(data.items))
      .finally(() => setLoading(false));
  }, []);

  const instagram = all.filter((i) => i.platform === "instagram");
  const tiktok = all.filter((i) => i.platform === "tiktok");
  const jewelry = all.filter((i) => i.accountType === "jewelry");
  const creator = all.filter((i) => i.accountType === "creator" && i.category !== "beauty-makeup");
  const makeup = all.filter((i) => i.category === "beauty-makeup");

  const tabs = [
    { key: "all", label: "All" },
    { key: "jewelry", label: "Jewelry Content" },
    { key: "creator", label: "Creator Content" },
    { key: "makeup", label: "Makeup" },
  ];

  return (
    <div>
      <div className="relative overflow-hidden bg-ink py-16 sm:py-20">
        <img
          src={contentBanner}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[85%_center] opacity-40 lg:object-center"
        />
        <Container className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-gold-light">Content Hub</p>
            <h1 className="font-display text-4xl text-ivory sm:text-5xl">
              Your daily dose of <span className="italic text-gold-light">beauty, jewelry &amp; real life.</span>
            </h1>
            <p className="mt-4 max-w-lg text-sm text-ivory/70">
              From glam looks and styling tips to makeup tutorials and business talk   this is where I
              connect, inspire and share my journey with you.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            {(site?.socials || []).slice(0, 4).map((s) => {
              const Icon = platformIcon[s.platform] || InstagramIcon;
              return (
                <a
                  key={s._id}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-md bg-white/10 px-4 py-3 text-ivory hover:bg-white/20"
                >
                  <Icon size={18} />
                  <div className="text-left">
                    <p className="text-xs font-medium">{s.followers?.toLocaleString()}+</p>
                    <p className="text-[10px] uppercase tracking-wide text-ivory/60">{s.platform} Followers</p>
                  </div>
                </a>
              );
            })}
          </div>
        </Container>
      </div>

      <Container className="py-14">
        <div className="mb-10 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={clsx(
                "rounded-full px-5 py-2 text-xs font-medium uppercase tracking-wide transition",
                tab === t.key ? "bg-ink text-ivory" : "bg-cream-deep text-ink-soft hover:bg-cream-deep/70"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <>
            <RowSkeleton />
            <RowSkeleton />
          </>
        ) : all.length === 0 ? (
          <EmptyState icon={ImageOff} title="No content yet" message="Check back soon for new posts." />
        ) : (
          <>
            {tab === "all" && (
              <>
                <Row title="Latest on Instagram" items={instagram} platform="instagram" />
                <Row title="Latest on TikTok" items={tiktok} platform="tiktok" />
              </>
            )}
            {tab === "jewelry" && <Row title="Jewelry Content" items={jewelry} />}
            {tab === "creator" && <Row title="Creator Content" items={creator} />}
            {tab === "makeup" && <Row title="Makeup Content" items={makeup} />}
          </>
        )}

        <SectionHeading eyebrow="Let's Stay Connected" title="Follow the Full Journey" align="center" />
        <div className="flex flex-wrap justify-center gap-4">
          {(site?.socials || []).map((s) => {
            const Icon = platformIcon[s.platform] || InstagramIcon;
            return (
              <a
                key={s._id}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border border-cream-deep px-6 py-3 text-xs font-medium uppercase tracking-wide hover:border-gold hover:text-gold"
              >
                <Icon size={15} /> {s.platform === "instagram" ? "View on Instagram" : s.platform === "tiktok" ? "Watch on TikTok" : "Subscribe on YouTube"}
              </a>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
