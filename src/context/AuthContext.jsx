import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api, { getErrorMessage } from "../lib/api.js";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [wishlistLoadingId, setWishlistLoadingId] = useState(null);

  const refreshWishlist = useCallback(async () => {
    try {
      const { data } = await api.get("/wishlist");
      setWishlistIds(data.wishlist.products.map((p) => (typeof p === "string" ? p : p._id)));
    } catch {
      setWishlistIds([]);
    }
  }, []);

  useEffect(() => {
    async function loadMe() {
      const token = localStorage.getItem("luxeora_token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
        refreshWishlist();
      } catch {
        localStorage.removeItem("luxeora_token");
      } finally {
        setLoading(false);
      }
    }
    loadMe();
  }, [refreshWishlist]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("luxeora_token", data.token);
    setUser(data.user);
    refreshWishlist();
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    localStorage.setItem("luxeora_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    }
    localStorage.removeItem("luxeora_token");
    setUser(null);
    setWishlistIds([]);
  };

  const toggleWishlist = async (productId) => {
    if (!user) {
      toast.error("Please log in to save items to your wishlist.");
      return;
    }
    setWishlistLoadingId(productId);
    try {
      const { data } = await api.post("/wishlist/toggle", { productId });
      setWishlistIds(data.wishlist.products.map((p) => (typeof p === "string" ? p : p._id)));
      toast.success(data.added ? "Added to wishlist" : "Removed from wishlist");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setWishlistLoadingId(null);
    }
  };

  const updateUser = (updates) => setUser((prev) => ({ ...prev, ...updates }));

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, wishlistIds, wishlistLoadingId, toggleWishlist, refreshWishlist, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
