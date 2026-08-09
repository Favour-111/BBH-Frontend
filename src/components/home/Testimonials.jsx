import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { cachedGet } from "../../lib/api.js";
import Container from "../ui/Container.jsx";
import SectionHeading from "../ui/SectionHeading.jsx";
import StarRating from "../ui/StarRating.jsx";

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    cachedGet("/reviews/featured").then(({ data }) => setReviews(data.reviews)).catch(() => {});
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section className="py-20">
      <Container>
        <SectionHeading eyebrow="Loved By Many" title="What Our Customers Say" align="center" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 6).map((r) => (
            <div key={r._id} className="rounded-lg bg-white p-7 shadow-sm">
              <Quote className="mb-3 text-gold-soft" size={26} />
              <StarRating rating={r.rating} size={13} />
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">"{r.comment}"</p>
              <div className="mt-5 flex items-center gap-3 border-t border-cream-deep pt-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-soft/50 text-sm font-medium text-gold">
                  {r.user?.name?.[0] || "L"}
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">{r.user?.name}</p>
                  <p className="text-xs text-ink-soft">{r.product?.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
