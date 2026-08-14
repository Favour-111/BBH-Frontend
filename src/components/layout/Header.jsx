import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "../../store/cartStore.js";
import { useAuth } from "../../context/AuthContext.jsx";
import AnnouncementBar from "./AnnouncementBar.jsx";
import Container from "../ui/Container.jsx";
import clsx from "clsx";
import logo from "../../../assets/image/logo.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/content", label: "Content" },
  { to: "/contact", label: "Contact" },
];

function Logo({ isShop, className }) {
  if (isShop) {
    return <span className={clsx("font-brush text-gold", className)}>Melblings</span>;
  }
  return <img src={logo} alt="Beauty by Horbah's" className={clsx("object-contain", className)} />;
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());
  const { user, wishlistIds } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isShop = location.pathname.startsWith("/shop");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
    setSearchOpen(false);
    setSearchTerm("");
  };

  return (
    <header className={clsx("sticky top-0 z-50 bg-ivory/95 backdrop-blur transition-shadow", scrolled && "shadow-sm")}>
      <AnnouncementBar />
      <Container>
        <div className="flex items-center justify-between py-5">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>

          <Link to="/" className="shrink-0">
            <Logo isShop={isShop} className={isShop ? "text-3xl leading-none sm:text-4xl lg:text-5xl" : "h-8 w-auto sm:h-9 lg:h-12"} />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  clsx(
                    "text-xs font-medium uppercase tracking-widest text-ink-soft transition hover:text-gold",
                    isActive && "text-gold"
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4 sm:gap-5">
            <button onClick={() => setSearchOpen((v) => !v)} aria-label="Search">
              <Search size={19} />
            </button>
            <Link to={user ? "/account" : "/login"} aria-label="Account">
              <User size={19} />
            </Link>
            <Link to="/account/wishlist" className="relative" aria-label="Wishlist">
              <Heart size={19} />
              {wishlistIds?.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] text-white">
                  {wishlistIds.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative" aria-label="Cart">
              <ShoppingBag size={19} />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[10px] text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {searchOpen && (
          <form onSubmit={submitSearch} className="border-t border-cream-deep py-4">
            <div className="flex items-center gap-3">
              <Search size={18} className="text-ink-soft" />
              <input
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for jewelry, necklaces, rings..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-ink-soft/60"
              />
              <button type="button" onClick={() => setSearchOpen(false)}>
                <X size={16} />
              </button>
            </div>
          </form>
        )}
      </Container>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-[100] lg:hidden">
            <div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-72 animate-fade-up bg-ivory p-6 shadow-xl">
              <div className="mb-8 flex items-center justify-between">
                <Logo isShop={isShop} className={isShop ? "text-3xl leading-none" : "h-9 w-auto"} />
                <button onClick={() => setOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <nav className="flex flex-col gap-5">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === "/"}
                    onClick={() => setOpen(false)}
                    className="text-sm font-medium uppercase tracking-widest text-ink-soft hover:text-gold"
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}
