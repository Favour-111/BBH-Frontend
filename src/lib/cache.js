const PREFIX = "mb_cache:";
const DEFAULT_TTL = 5 * 60 * 1000;

function keyFor(url, params) {
  const query = params ? JSON.stringify(params, Object.keys(params).sort()) : "";
  return `${PREFIX}${url}${query}`;
}

export function readCache(url, params) {
  try {
    const raw = sessionStorage.getItem(keyFor(url, params));
    if (!raw) return undefined;
    const { data, expiry } = JSON.parse(raw);
    if (Date.now() > expiry) {
      sessionStorage.removeItem(keyFor(url, params));
      return undefined;
    }
    return data;
  } catch {
    return undefined;
  }
}

export function writeCache(url, params, data, ttl = DEFAULT_TTL) {
  try {
    sessionStorage.setItem(keyFor(url, params), JSON.stringify({ data, expiry: Date.now() + ttl }));
  } catch {
    // storage full or unavailable (e.g. private browsing) — skip caching silently
  }
}

export function invalidateCache(resource) {
  try {
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i);
      if (key?.startsWith(PREFIX) && key.slice(PREFIX.length).startsWith(`/${resource}`)) {
        sessionStorage.removeItem(key);
      }
    }
  } catch {
    // ignore
  }
}
