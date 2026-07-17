const CACHE_NAME = "arrival-guide-v50-hydra-brand-compact";
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
  "./assets/citronex-hydra-logo.png"
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

function shouldCache(request) {
  if (request.method !== "GET") return false;
  const requestUrl = new URL(request.url);
  return requestUrl.origin === self.location.origin;
}

function networkTimeout(ms = 1400) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(null), ms);
  });
}

async function cacheFirst(request, fallback = null) {
  const cached = await caches.match(request, { ignoreSearch: true });
  if (cached) {
    fetch(request)
      .then((response) => {
        if (response && response.ok) {
          caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
        }
      })
      .catch(() => {});
    return cached;
  }

  try {
    const response = await Promise.race([fetch(request), networkTimeout()]);
    if (response && response.ok) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      return response;
    }
  } catch (error) {
    // Fall back below.
  }

  if (!fallback) return Response.error();
  return caches.match(fallback, { ignoreSearch: true }).then((fallbackResponse) => fallbackResponse || Response.error());
}

function networkFirst(request) {
  return cacheFirst(request, APP_SHELL);
}

self.addEventListener("fetch", (event) => {
  if (!shouldCache(event.request)) return;

  if (event.request.mode === "navigate") {
    event.respondWith(networkFirst(event.request));
    return;
  }

  event.respondWith(cacheFirst(event.request, null));
});
