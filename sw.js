const CACHE_NAME = "arrival-guide-v60-quick-actions-languages";
const APP_SHELL = "./index.html";
const ASSETS = [
  "./",
  APP_SHELL,
  "./styles.css",
  "./candidate-improvements.css",
  "./app.js",
  "./candidate-improvements.js",
  "./language-options.js",
  "./translations.js",
  "./data/config.js",
  "./data/overrides.js",
  "./manifest.webmanifest",
  "./assets/icon.svg",
  "./assets/primserv-logo.svg",
  "./assets/primserv-icon-192.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(ASSETS.map(async (asset) => {
      try {
        await cache.add(new Request(asset, { cache: "reload" }));
      } catch (error) {
        // Keep installation resilient if a non-critical asset fails.
      }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys
        .filter((key) => key.startsWith("arrival-guide-") && key !== CACHE_NAME)
        .map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

const SHELL_URL = new URL(APP_SHELL, self.location.href).href;
const ROOT_URL = new URL("./", self.location.href).href;
const PUBLIC_URLS = new Set(ASSETS.map(asset => new URL(asset, self.location.href).href));

function publicRequest(request) {
  if (request.method !== "GET" || request.headers.has("Authorization") || request.headers.has("Range")) return null;
  const url = new URL(request.url);
  url.search = "";
  url.hash = "";
  if (!PUBLIC_URLS.has(url.href)) return null;
  // The URL still stays in the page for its existing UI, but never in CacheStorage
  // keys or cached Response.url. Only the approved static file is fetched here.
  if (url.href === ROOT_URL) url.href = SHELL_URL;
  return new Request(url.href, { credentials: "omit", cache: "no-cache", redirect: "error" });
}

async function cacheFirst(request, event) {
  let cache;
  try { cache = await caches.open(CACHE_NAME); } catch { /* Read-only/network use remains possible. */ }
  const cached = cache ? await cache.match(request).catch(() => null) : null;
  const refresh = async () => {
    const response = await fetch(request);
    if (response && response.ok && cache) {
      try { await cache.put(request, response.clone()); } catch { /* Quota cannot discard a usable response. */ }
    }
    return response;
  };
  if (cached) {
    event.waitUntil(refresh().catch(() => {}));
    return cached;
  }

  let timer;
  try {
    const pending = refresh();
    event.waitUntil(pending.catch(() => {}));
    const response = await Promise.race([pending, new Promise(resolve => { timer = setTimeout(() => resolve(null), 1400); })]);
    if (response) return response;
  } catch (error) {
    // Only this version's approved static cache is eligible for offline fallback.
  } finally {
    clearTimeout(timer);
  }
  return Response.error();
}

self.addEventListener("fetch", (event) => {
  const request = publicRequest(event.request);
  if (request) event.respondWith(cacheFirst(request, event));
});
