import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useSiteData } from "../../context/SiteDataContext.jsx";
import Container from "../ui/Container.jsx";
import heroImage from "../../../assets/image/image.png";

export default function Hero() {
  const site = useSiteData();
  const homepage = site?.settings?.homepage;

  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="absolute inset-0">
        {homepage?.heroImage && (
          <img
            src={heroImage}
            alt="Beauty by Horbah's"
            className="h-full w-full object-cover object-[75%_center] opacity-70 lg:object-center"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
      </div>

      <Container className="relative flex min-h-[80vh] items-center py-24">
        <div className="max-w-xl animate-fade-up">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-gold-light">Welcome to Beauty by Horbah's</p>
          <h1 className="font-display text-5xl leading-[1.1] text-ivory sm:text-6xl lg:text-7xl">
            {homepage?.heroTitle || "Jewelry. Beauty. Creativity."}
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ivory/80">
            {homepage?.heroSubtitle ||
              "Jewelry that tells a story. Makeup that empowers. Content that inspires. Let's create magic together."}
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-gold px-8 py-4 text-xs font-medium uppercase tracking-widest text-ivory transition hover:bg-gold-light"
            >
              Shop Jewelry <ArrowRight size={14} />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 border border-ivory/40 px-8 py-4 text-xs font-medium uppercase tracking-widest text-ivory transition hover:border-ivory hover:bg-ivory/10"
            >
              Work With Me
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
