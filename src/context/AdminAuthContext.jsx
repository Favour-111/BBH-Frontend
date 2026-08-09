import { createContext, useContext, useEffect, useState } from "react";
import { adminApi } from "../lib/api.js";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMe() {
      const token = localStorage.getItem("luxeora_admin_token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await adminApi.get("/auth/admin/me");
        setAdmin(data.admin);
      } catch {
        localStorage.removeItem("luxeora_admin_token");
      } finally {
        setLoading(false);
      }
    }
    loadMe();
  }, []);

  const login = async (email, password) => {
    const { data } = await adminApi.post("/auth/admin/login", { email, password });
    localStorage.setItem("luxeora_admin_token", data.token);
    setAdmin(data.admin);
    return data.admin;
  };

  const logout = async () => {
    try {
      await adminApi.post("/auth/admin/logout");
    } catch {
      // ignore
    }
    localStorage.removeItem("luxeora_admin_token");
    setAdmin(null);
  };

  const can = (section) => {
    if (!admin) return false;
    if (admin.role === "super_admin") return true;
    const map = {
      store_manager: ["products", "categories", "orders", "customers", "coupons", "reviews", "shipping"],
      content_manager: ["portfolio", "content", "socials", "settings"],
      support_staff: ["orders", "customers", "messages", "bookings"],
    };
    return map[admin.role]?.includes(section);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout, can }}>{children}</AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
