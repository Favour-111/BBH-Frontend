import axios from "axios";
import { readCache, writeCache, invalidateCache } from "./cache.js";

const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("luxeora_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const adminApi = axios.create({
  baseURL,
  withCredentials: true,
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("luxeora_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Any successful create/update/delete invalidates cached reads for that
// resource, so admin changes show up immediately without needing a full
// page refresh, while unrelated GETs keep serving from cache.
function invalidateOnWrite(response) {
  const method = response.config.method?.toLowerCase();
  if (method && method !== "get") {
    const resource = (response.config.url || "").split("?")[0].split("/").filter(Boolean)[0];
    if (resource) invalidateCache(resource);
  }
  return response;
}
api.interceptors.response.use(invalidateOnWrite);
adminApi.interceptors.response.use(invalidateOnWrite);

// Cached GET for public, rarely-changing data (products, content, portfolio,
// settings...). Serves from sessionStorage when fresh so repeat visits within
// the same tab don't re-download the same data — saves mobile data and makes
// navigation feel instant. Gets invalidated automatically the moment a write
// happens (see invalidateOnWrite above), so edits/additions show up right away.
export async function cachedGet(url, config = {}, ttl) {
  const cached = readCache(url, config.params);
  if (cached !== undefined) return { data: cached };
  const res = await api.get(url, config);
  writeCache(url, config.params, res.data, ttl);
  return res;
}

export function getErrorMessage(err) {
  return err?.response?.data?.message || "Something went wrong. Please try again.";
}

export default api;
