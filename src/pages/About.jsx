import { Sparkles, PenLine, Gem, Globe, Heart, Play } from "lucide-react";
import { useSiteData } from "../context/SiteDataContext.jsx";
import Container from "../components/ui/Container.jsx";
import { InstagramIcon, TiktokIcon } from "../components/ui/SocialIcons.jsx";

const journey = [
  { year: "2021", title: "The Spark", desc: "The idea began with a passion for timeless jewelry and a desire to inspire confidence.", icon: Sparkles },
  { year: "2022", title: "The Beginning", desc: "We launched our first collection   carefully handcrafted with love and purpose.", icon: PenLine },
  { year: "2023", title: "Growing With You", desc: "Your support helped us grow, reach more women and expand our collections.", icon: Gem },
  { year: "2024", title: "Beyond Borders", desc: "We started shipping across Nigeria and building a community of confident, beautiful women.", icon: Globe },
  { year: "2025 & Beyond", title: "The Future", desc: "We continue to innovate, create and inspire   one piece, one story, one woman at a time.", icon: Heart },
];

const values = [
  { title: "Premium Quality", desc: "We use the finest materials to ensure long-lasting beauty." },
  { title: "Handcrafted With Love", desc: "Every piece is carefully designed and crafted with attention to detail." },
  { title: "Timeless Designs", desc: "Elegant, minimal and versatile pieces that never go out of style." },
  { title: "Fast & Reliable Delivery", desc: "Quick delivery across Nigeria so you can shine sooner." },
  { title: "Customer First", desc: "We're here to make your experience seamless and special." },
];

export default function About() {
  const site = useSiteData();

  return (
    <div>
      <Container className="grid grid-cols-1 items-center gap-10 py-14 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-gold">About Beauty by Horbah's</p>
          <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
            Jewelry that tells a story. Beauty that <span className="italic text-gold">empowers</span>.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-soft">
            Beauty by Horbah's is more than jewelry   it's a reflection of grace, confidence and individuality. Every
            piece is designed to make you feel golden, inside and out.
          </p>
          <p className="mt-8 font-display text-2xl italic text-gold">Horbah</p>
          <p className="text-xs uppercase tracking-widest text-ink-soft">Founder &amp; Creative Director</p>
        </div>
        <div className="aspect-[4/3] overflow-hidden rounded-lg bg-cream-deep">
          <img src="/images/about-story.jpg" alt="Horbah" loading="lazy" className="h-full w-full object-cover" />
        </div>
      </Container>

      <section className="bg-blush py-16">
        <Container>
          <h2 className="mb-10 text-center font-display text-3xl text-ink">Our Journey</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {journey.map((j) => (
              <div key={j.year} className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-gold-soft text-gold">
                  <j.icon size={22} />
                </div>
                <p className="text-sm font-semibold text-ink">{j.year}</p>
                <p className="font-display text-lg text-ink">{j.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-soft">{j.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Container className="py-16">
        <div className="grid grid-cols-2 gap-6 rounded-lg bg-cream-deep/50 p-8 sm:grid-cols-5">
          {values.map((v) => (
            <div key={v.title} className="text-center">
              <p className="font-display text-lg text-ink">{v.title}</p>
              <p className="mt-1 text-xs text-ink-soft">{v.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
          <Stat value="15K+" label="Happy Customers" />
          <Stat value="50K+" label="Pieces Sold" />
          <Stat value="4.9/5" label="Average Rating" />
          <Stat value="All Nigeria" label="We Deliver" />
        </div>
      </Container>

      <section className="py-16">
        <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div className="group relative aspect-video overflow-hidden rounded-lg bg-ink">
            <img src="/images/about-video-thumb.jpg" alt="" loading="lazy" className="h-full w-full object-cover opacity-70" />
            <button className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-ink transition group-hover:scale-105">
                <Play size={24} className="ml-1" />
              </span>
            </button>
            <span className="absolute bottom-4 left-4 rounded-sm bg-ink/70 px-3 py-1.5 text-xs text-ivory">Watch My Story</span>
          </div>
          <div>
            <h3 className="font-display text-2xl text-ink">The Story Behind the Brand</h3>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              Beauty by Horbah's was born from my love for beauty, creativity and purpose. I started this brand to
              empower women through timeless jewelry that reminds them of their worth   alongside my journey as a
              makeup artist and content creator, sharing every step along the way.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              Each piece you wear is a piece of my heart. Thank you for being part of this beautiful journey.
            </p>
            <p className="mt-6 font-display text-xl italic text-gold">With love, Horbah</p>
            <div className="mt-6 flex gap-3">
              {(site?.socials || []).slice(0, 4).map((s) => (
                <a
                  key={s._id}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-cream-deep text-ink-soft hover:border-gold hover:text-gold"
                >
                  {s.platform === "instagram" ? <InstagramIcon size={16} /> : <TiktokIcon size={16} />}
                </a>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <p className="font-display text-3xl text-ink">{value}</p>
      <p className="text-xs uppercase tracking-wide text-ink-soft">{label}</p>
    </div>
  );
}
