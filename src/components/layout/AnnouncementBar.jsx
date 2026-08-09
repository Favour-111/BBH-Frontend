import { useSiteData } from "../../context/SiteDataContext.jsx";
import { InstagramIcon, TiktokIcon, YoutubeIcon } from "../ui/SocialIcons.jsx";

const platformIcon = { instagram: InstagramIcon, tiktok: TiktokIcon, youtube: YoutubeIcon };

export default function AnnouncementBar() {
  const site = useSiteData();
  const socials = site?.socials || [];

  return (
    <div className="hidden bg-ink text-ivory md:block">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-8 py-2 text-xs">
        <div className="flex items-center gap-5">
          <span className="text-gold-light">Follow my journey</span>
          {socials.slice(0, 4).map((s) => {
            const Icon = platformIcon[s.platform] || InstagramIcon;
            const platformLabel = s.platform === "instagram" ? "IG" : s.platform === "tiktok" ? "TikTok" : "YouTube";
            const label = `${s.type === "jewelry" ? "Jewelry" : "Creator"} ${platformLabel}`;
            return (
              <a
                key={s._id}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-ivory/80 transition hover:text-gold-light"
              >
                <Icon size={13} />
                {label}
              </a>
            );
          })}
        </div>
        <p className="text-ivory/80">
          {site?.settings?.homepage?.announcementBar || "Free shipping on orders over ₦100,000"}
        </p>
      </div>
    </div>
  );
}
