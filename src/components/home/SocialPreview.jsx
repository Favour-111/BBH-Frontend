import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";
import { cachedGet } from "../../lib/api.js";
import Container from "../ui/Container.jsx";
import SectionHeading from "../ui/SectionHeading.jsx";
import { InstagramIcon, TiktokIcon } from "../ui/SocialIcons.jsx";
import ContentMedia from "../ui/ContentMedia.jsx";

export default function SocialPreview() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    cachedGet("/content?limit=6").then(({ data }) => setItems(data.items));
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Follow The Journey"
          title="Latest From Instagram & TikTok"
          subtitle="Real moments, styling tips and behind-the-scenes from Beauty by Horbah's."
          action={
            <Link to="/content" className="text-xs font-medium uppercase tracking-widest text-gold hover:underline">
              View Content Hub
            </Link>
          }
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {items.map((item) => (
            <a
              key={item._id}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-[3/4] overflow-hidden rounded-md bg-cream-deep"
            >
              <ContentMedia item={item} className="h-full w-full object-cover transition group-hover:scale-105" />
              <div className="absolute inset-0 flex flex-col justify-between bg-ink/0 p-3 opacity-0 transition group-hover:bg-ink/50 group-hover:opacity-100">
                <span className="self-end rounded-full bg-white/90 p-1.5 text-ink">
                  {item.platform === "instagram" ? <InstagramIcon size={13} /> : <TiktokIcon size={13} />}
                </span>
                <div className="flex gap-3 text-[11px] text-ivory">
                  <span className="flex items-center gap-1">
                    <Heart size={11} /> {item.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={11} /> {item.comments}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
