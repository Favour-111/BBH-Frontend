import { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  ShoppingBag,
  Package,
  FolderTree,
  Users,
  Star,
  Ticket,
  Image as ImageIcon,
  Clapperboard,
  Share2,
  CalendarCheck,
  Handshake,
  MessageSquare,
  BarChart3,
  Bell,
  Settings,
  Truck,
  ShieldCheck,
  History,
  Menu,
  X,
  Search,
  ChevronDown,
  LogOut,
  Store,
} from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext.jsx";
import { adminApi } from "../lib/api.js";
import clsx from "clsx";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutGrid, end: true, section: null },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag, section: "orders" },
  { to: "/admin/products", label: "Products", icon: Package, section: "products" },
  { to: "/admin/categories", label: "Categories", icon: FolderTree, section: "categories" },
  { to: "/admin/customers", label: "Customers", icon: Users, section: "customers" },
  { to: "/admin/reviews", label: "Reviews", icon: Star, section: "reviews" },
  { to: "/admin/coupons", label: "Coupons & Discounts", icon: Ticket, section: "coupons" },
  { to: "/admin/portfolio", label: "Portfolio", icon: ImageIcon, section: "portfolio" },
  { to: "/admin/content", label: "Content", icon: Clapperboard, section: "content" },
  { to: "/admin/socials", label: "Socials", icon: Share2, section: "socials" },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarCheck, section: "bookings" },
  { to: "/admin/collaborations", label: "Collaborations", icon: Handshake, section: "collaborations" },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare, section: "messages" },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3, section: null },
  { to: "/admin/notifications", label: "Notifications", icon: Bell, section: null },
  { to: "/admin/settings", label: "Website Settings", icon: Settings, section: "settings" },
  { to: "/admin/shipping", label: "Shipping", icon: Truck, section: "shipping" },
  { to: "/admin/users", label: "Users & Roles", icon: ShieldCheck, section: null, superOnly: true },
  { to: "/admin/activity-logs", label: "Activity Logs", icon: History, section: null, superOnly: true },
];

export default function AdminLayout() {
  const { admin, logout, can } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function onClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function loadNotifications() {
    try {
      const { data } = await adminApi.get("/notifications");
      setNotifications(data.notifications.slice(0, 8));
      setUnreadCount(data.unreadCount);
    } catch {
      // silent
    }
  }

  async function markAllRead() {
    await adminApi.put("/notifications/read-all");
    loadNotifications();
  }

  const visibleNav = nav.filter((item) => {
    if (item.superOnly) return admin?.role === "super_admin";
    if (!item.section) return true;
    return can(item.section);
  });

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-[#f6f4f0]">
      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-white text-ink transition-transform lg:static lg:translate-x-0 lg:bg-[#191512] lg:text-white",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-black/5 px-6 py-6 lg:border-white/10">
            <span className="font-display text-xl tracking-wide">Beauty by Horbah's</span>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-6 pt-4">
            {visibleNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium transition",
                    isActive
                      ? "bg-gold text-ink"
                      : "text-ink-soft hover:bg-black/5 hover:text-ink lg:text-white/70 lg:hover:bg-white/10 lg:hover:text-white"
                  )
                }
              >
                <item.icon size={17} />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="border-t border-black/10 p-4 lg:border-white/10">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-md bg-black/5 px-4 py-3 text-sm text-ink-soft hover:bg-black/10 lg:bg-white/5 lg:text-white/80 lg:hover:bg-white/10"
            >
              <Store size={16} />
              <div>
                <p className="font-medium text-ink lg:text-white">Melblings</p>
                <p className="text-xs text-ink-soft lg:text-white/50">View Store</p>
              </div>
            </a>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-black/5 bg-white px-4 py-4 sm:px-8">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            <div className="hidden items-center gap-2 rounded-full bg-[#f6f4f0] px-4 py-2 sm:flex">
              <Search size={15} className="text-ink-soft" />
              <input placeholder="Search anything..." className="w-56 bg-transparent text-sm outline-none" />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative" ref={notifRef}>
              <button onClick={() => setNotifOpen((v) => !v)} className="relative rounded-full p-2 hover:bg-[#f6f4f0]">
                <Bell size={19} />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-lg border border-black/5 bg-white shadow-xl">
                  <div className="flex items-center justify-between border-b border-black/5 px-4 py-3">
                    <span className="text-sm font-semibold">Notifications</span>
                    <button onClick={markAllRead} className="text-xs text-gold hover:underline">
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 && <p className="p-4 text-sm text-ink-soft">No notifications yet.</p>}
                    {notifications.map((n) => (
                      <div key={n._id} className={clsx("border-b border-black/5 px-4 py-3", !n.read && "bg-gold/5")}>
                        <p className="text-sm font-medium text-ink">{n.title}</p>
                        <p className="text-xs text-ink-soft">{n.message}</p>
                      </div>
                    ))}
                  </div>
                  <NavLink
                    to="/admin/notifications"
                    onClick={() => setNotifOpen(false)}
                    className="block px-4 py-3 text-center text-xs font-medium text-gold hover:underline"
                  >
                    View all
                  </NavLink>
                </div>
              )}
            </div>

            <div className="relative" ref={profileRef}>
              <button onClick={() => setProfileOpen((v) => !v)} className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-sm font-semibold text-white">
                  {admin?.name?.[0] || "A"}
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-medium leading-tight">{admin?.name}</p>
                  <p className="text-xs capitalize leading-tight text-ink-soft">{admin?.role?.replace(/_/g, " ")}</p>
                </div>
                <ChevronDown size={14} className="text-ink-soft" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-48 rounded-lg border border-black/5 bg-white py-1 shadow-xl">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
