import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { useSiteData } from "../../context/SiteDataContext.jsx";
import Container from "../ui/Container.jsx";
import api from "../../lib/api.js";
import toast from "react-hot-toast";
import { InstagramIcon, TiktokIcon, YoutubeIcon } from "../ui/SocialIcons.jsx";
import logo from "../../../assets/image/logo.png";

const platformIcon = { instagram: InstagramIcon, tiktok: TiktokIcon, youtube: YoutubeIcon };

const shopLinks = [
  { to: "/shop", label: "All Jewelry" },
  { to: "/shop?category=necklaces", label: "Necklaces" },
  { to: "/shop?category=earrings", label: "Earrings" },
  { to: "/shop?category=bracelets", label: "Bracelets" },
  { to: "/shop?category=rings", label: "Rings" },
  { to: "/shop?category=new-arrivals", label: "New Arrivals" },
  { to: "/shop?category=best-sellers", label: "Best Sellers" },
];

const careLinks = [
  { to: "/contact", label: "FAQ" },
  { to: "/contact", label: "Shipping & Delivery" },
  { to: "/contact", label: "Returns & Exchanges" },
  { to: "/track-order", label: "Order Tracking" },
  { to: "/account/addresses", label: "Payment Methods" },
];

const quickLinks = [
  { to: "/about", label: "About Me" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/content", label: "Content" },
  { to: "/contact", label: "Contact" },
];

export default function Footer() {
  const site = useSiteData();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post("/messages", { name: "Newsletter Subscriber", email, type: "general", message: "Newsletter signup" });
      toast.success("You're subscribed! Welcome to Beauty by Horbah's.");
      setEmail("");
    } catch {
      toast.error("Could not subscribe right now. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const settings = site?.settings;

  return (
    <footer className="border-t border-cream-deep bg-ivory pt-16">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 rounded-lg bg-cream-deep/60 p-8 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-display text-2xl text-ink">Stay in the loop</h3>
            <p className="mt-1 text-sm text-ink-soft">Get exclusive updates, new arrivals, and special offers.</p>
          </div>
          <form onSubmit={subscribe} className="flex w-full max-w-md gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full rounded-sm border border-cream-deep bg-white px-4 py-3 text-sm outline-none focus:border-gold"
            />
            <button
              disabled={loading}
              className="whitespace-nowrap rounded-sm bg-ink px-6 py-3 text-xs font-medium uppercase tracking-wider text-ivory hover:bg-gold disabled:opacity-60"
            >
              Subscribe
            </button>
          </form>
        </div>

        <div className="grid grid-cols-2 gap-10 py-14 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link to="/" className="inline-block">
              <img src={logo} alt="Beauty by Horbah's" className="h-8 w-auto object-contain sm:h-9 lg:h-12" />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              Jewelry that tells a story. Beauty that empowers. Content that inspires. Let's create magic together.
            </p>
            <div className="mt-5 flex gap-3">
              {(site?.socials || []).slice(0, 4).map((s) => {
                const Icon = platformIcon[s.platform] || InstagramIcon;
                return (
                  <a
                    key={s._id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-cream-deep text-ink-soft transition hover:border-gold hover:text-gold"
                  >
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>
          </div>

          <FooterCol title="Shop" links={shopLinks} />
          <FooterCol title="Customer Care" links={careLinks} />
          <FooterCol title="Quick Links" links={quickLinks} />

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-ink">Contact Us</h4>
            <ul className="space-y-3 text-sm text-ink-soft">
              <li className="flex items-start gap-2">
                <Phone size={14} className="mt-0.5 shrink-0" /> <span className="min-w-0 break-words">{settings?.contact?.phone}</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={14} className="mt-0.5 shrink-0" /> <span className="min-w-0 break-all">{settings?.contact?.email}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0" /> <span className="min-w-0 break-words">{settings?.contact?.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-cream-deep py-6 text-xs text-ink-soft sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {settings?.brand?.name || "Beauty by Horbah's"}. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy-policy" className="hover:text-gold">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gold">Terms &amp; Conditions</Link>
            <Link to="/refund-policy" className="hover:text-gold">Refund Policy</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-ink">{title}</h4>
      <ul className="space-y-3 text-sm text-ink-soft">
        {links.map((link) => (
          <li key={link.label}>
            <Link to={link.to} className="hover:text-gold">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
