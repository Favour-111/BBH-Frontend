import { Link } from "react-router-dom";
import { Sparkles, Camera, Handshake, ArrowRight } from "lucide-react";
import Container from "../ui/Container.jsx";
import SectionHeading from "../ui/SectionHeading.jsx";

const services = [
  {
    icon: Sparkles,
    title: "Makeup Services",
    description: "Professional makeup for every occasion   bridal, editorial and photoshoot-ready glam.",
    to: "/services",
  },
  {
    icon: Camera,
    title: "Content Creation",
    description: "UGC, product videos and storytelling content that connects with your audience.",
    to: "/services",
  },
  {
    icon: Handshake,
    title: "Brand Collaborations",
    description: "Ambassador partnerships and sponsored campaigns that drive real results.",
    to: "/services",
  },
];

export default function ServicesPreview() {
  return (
    <section className="bg-blush py-20">
      <Container>
        <SectionHeading
          eyebrow="Beyond Jewelry"
          title="Beauty. Content. Connection."
          subtitle="I help brands and individuals tell their story through beauty, content and creativity."
          align="center"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {services.map((s) => (
            <Link
              key={s.title}
              to={s.to}
              className="group rounded-lg bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
                <s.icon size={22} />
              </div>
              <h3 className="font-display text-xl text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.description}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gold opacity-0 transition group-hover:opacity-100">
                Learn more <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
