const apiBaseURL = import.meta.env.VITE_API_URL || "/api";
const backendOrigin = apiBaseURL.replace(/\/api\/?$/, "");

// Uploaded images/videos are stored as backend-relative paths (e.g. "/uploads/xyz.jpg").
// In dev, Vite's proxy makes those resolve automatically against the local backend, which
// is why they show up on localhost. On a deployed static build there's no such proxy, so a
// bare "/uploads/..." resolves against the frontend's own origin and 404s. This makes every
// relative path absolute against the actual backend, and leaves already-absolute URLs
// (external CDNs, TikTok thumbnails, etc.) untouched.
export function mediaUrl(path) {
  if (!path) return path;
  if (/^https?:\/\//i.test(path) || path.startsWith("data:") || path.startsWith("blob:")) return path;
  return `${backendOrigin}${path.startsWith("/") ? "" : "/"}${path}`;
}
