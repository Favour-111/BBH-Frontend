import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutGrid, Package, Heart, MapPin, User, LogOut, Headphones, Truck } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import Container from "../components/ui/Container.jsx";
import clsx from "clsx";

const nav = [
  { to: "/account", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/account/orders", label: "My Orders", icon: Package },
  { to: "/track-order", label: "Order Tracking", icon: Truck },
  { to: "/account/wishlist", label: "Wishlist", icon: Heart },
  { to: "/account/addresses", label: "Address Book", icon: MapPin },
  { to: "/account/profile", label: "Account Details", icon: User },
];

export default function AccountLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <Container className="py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-6">
          <div className="rounded-lg bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold text-xl font-semibold text-white">
              {user?.name?.[0] || "U"}
            </div>
            <h3 className="mt-3 font-display text-lg text-ink">{user?.name}</h3>
            <p className="text-xs text-ink-soft">Welcome back, Queen 👑</p>
            <span className="mt-2 inline-block rounded-full bg-gold-soft/50 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-gold">
              Luxe Member
            </span>
          </div>

          <nav className="space-y-1 rounded-lg bg-white p-3 shadow-sm">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium transition",
                    isActive ? "bg-ink text-ivory" : "text-ink-soft hover:bg-cream-deep"
                  )
                }
              >
                <item.icon size={16} />
                {item.label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-md px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut size={16} /> Logout
            </button>
          </nav>

          <div className="rounded-lg bg-cream-deep/60 p-5 text-center">
            <Headphones className="mx-auto mb-2 text-gold" size={22} />
            <p className="text-sm font-medium text-ink">Need help?</p>
            <p className="mb-3 text-xs text-ink-soft">We're here for you.</p>
            <NavLink to="/contact" className="text-xs font-medium text-gold hover:underline">
              Contact Support &rarr;
            </NavLink>
          </div>
        </aside>

        <div>
          <Outlet />
        </div>
      </div>
    </Container>
  );
}
