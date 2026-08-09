import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Container from "../ui/Container.jsx";

export default function AboutPreview() {
  return (
    <section className="py-20">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-cream-deep">
          <img
            src="/images/about-preview.jpg"
            alt="Horbah, Founder of Beauty by Horbah's"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-gold">About Beauty by Horbah's</p>
          <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
            Jewelry that tells a story. Beauty that empowers.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-ink-soft">
            Beauty by Horbah's is more than jewelry   it's a reflection of grace, confidence and individuality. I started
            this brand to help women feel golden, inside and out, while sharing my journey as a makeup artist and
            content creator along the way.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-6 border-t border-cream-deep pt-6">
            <div>
              <p className="font-display text-2xl text-ink">15K+</p>
              <p className="text-xs text-ink-soft">Happy Customers</p>
            </div>
            <div>
              <p className="font-display text-2xl text-ink">50K+</p>
              <p className="text-xs text-ink-soft">Pieces Sold</p>
            </div>
            <div>
              <p className="font-display text-2xl text-ink">4.9/5</p>
              <p className="text-xs text-ink-soft">Average Rating</p>
            </div>
          </div>
          <Link
            to="/about"
            className="mt-8 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-gold hover:underline"
          >
            Our Story <ArrowRight size={14} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
