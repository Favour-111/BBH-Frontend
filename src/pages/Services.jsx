import { Link } from "react-router-dom";
import { Sparkles, Camera, Handshake, Check, MessageCircle, ClipboardList, Lightbulb, TrendingUp } from "lucide-react";
import Container from "../components/ui/Container.jsx";
import Button from "../components/ui/Button.jsx";

const services = [
  {
    icon: Sparkles,
    title: "Makeup Services",
    desc: "Professional makeup for every occasion. From soft glam to full glam, I bring out your best self.",
    items: ["Bridal & Engagement Makeup", "Photoshoot & Event Makeup", "Makeup Lessons (One-on-One)", "Makeup for Content Creators"],
    cta: "Book a Makeup Session",
    type: "makeup-booking",
  },
  {
    icon: Camera,
    title: "Content Creation",
    desc: "I create engaging content that tells your brand story and connects with the right audience.",
    items: ["UGC Content", "Product Photography", "Video Content (Reels, TikTok, YouTube)", "Brand Storytelling"],
    cta: "View My Work",
    type: "content-creation",
  },
  {
    icon: Handshake,
    title: "Brand Collaborations",
    desc: "Let's work together! I partner with brands that align with my values and aesthetic.",
    items: ["Sponsored Posts & Reviews", "Brand Ambassadorship", "Event Coverage", "Long-term Partnerships"],
    cta: "Work With Me",
    type: "brand-collaboration",
  },
];

const steps = [
  { icon: MessageCircle, title: "Let's Connect", desc: "Send a message or fill out the collaboration form." },
  { icon: ClipboardList, title: "Discuss Your Needs", desc: "We discuss your goals, ideas and what you need." },
  { icon: Lightbulb, title: "Create & Execute", desc: "I create high-quality content that brings your vision to life." },
  { icon: TrendingUp, title: "Grow Together", desc: "We build impact, drive results and grow your brand." },
];

export default function Services() {
  return (
    <div>
      <Container className="grid grid-cols-1 items-center gap-10 py-14 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-gold">What I Do</p>
          <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
            More Than Jewelry. <span className="italic text-gold">Beauty. Content. Impact.</span>
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-soft">
            I help brands and individuals look good, tell their story and connect with their audience through
            beauty, content creation and creative collaborations.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/contact">
              <Button>Let's Work Together</Button>
            </Link>
            <Link to="/portfolio">
              <Button variant="outline">View Portfolio</Button>
            </Link>
          </div>
        </div>
        <div className="aspect-[4/3] overflow-hidden rounded-lg bg-cream-deep">
          <img
            src="../assets/image/8BAABB90-74BE-4355-9510-F0BD11FC75B7_1_201_a.jpeg"
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      </Container>

      <Container className="py-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {services.map((s) => (
            <div key={s.title} className="rounded-lg bg-white p-8 shadow-sm">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
                <s.icon size={22} />
              </div>
              <h3 className="font-display text-xl text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.desc}</p>
              <ul className="mt-5 space-y-2">
                {s.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-ink-soft">
                    <Check size={13} className="mt-0.5 shrink-0 text-gold" /> {item}
                  </li>
                ))}
              </ul>
              <Link
                to={`/contact?type=${s.type}`}
                className="mt-6 inline-block w-full rounded-sm border border-ink py-2.5 text-center text-xs font-medium uppercase tracking-wide hover:bg-ink hover:text-ivory"
              >
                {s.cta}
              </Link>
            </div>
          ))}
        </div>
      </Container>

      <section className="bg-blush py-16">
        <Container>
          <h2 className="mb-10 text-center font-display text-3xl text-ink">How We Work Together</h2>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-gold shadow-sm">
                  <s.icon size={20} />
                </div>
                <p className="text-xs font-semibold text-gold">{i + 1}</p>
                <p className="font-display text-lg text-ink">{s.title}</p>
                <p className="mt-1 text-xs text-ink-soft">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 grid grid-cols-2 gap-6 rounded-lg bg-white p-8 text-center sm:grid-cols-5">
            <Stat value="20K+" label="Community Across Platforms" />
            <Stat value="50K+" label="Jewelry Pieces Sold" />
            <Stat value="100+" label="Brands Collaborated" />
            <Stat value="5M+" label="Views on Content Created" />
            <Stat value="Working" label="With Clients Across Nigeria & Beyond" />
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="flex flex-col items-center justify-between gap-6 rounded-lg bg-ink p-10 text-center sm:flex-row sm:text-left">
            <div>
              <h3 className="font-display text-2xl text-ivory">Let's Create Something Beautiful Together</h3>
              <p className="mt-2 text-sm text-ivory/70">
                Whether you need a makeup artist, content creator, or a brand partner, I'm here to bring your vision to life.
              </p>
            </div>
            <Link to="/contact">
              <Button variant="gold">Send Collaboration Request</Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <p className="font-display text-2xl text-ink">{value}</p>
      <p className="text-xs text-ink-soft">{label}</p>
    </div>
  );
}
