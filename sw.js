const CACHE_NAME = "arrival-guide-v41-quality-gate";
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
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
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

function cacheFirst(request) {
  return caches.match(request, { ignoreSearch: true }).then((cached) => {
    const networkFetch = fetch(request)
      .then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => cached);

    return cached || networkFetch;
  });
}

function networkFirst(request) {
  return fetch(request)
    .then((response) => {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(APP_SHELL, copy));
      }
      return response;
    })
    .catch(() =>
      caches.match(APP_SHELL, { ignoreSearch: true }).then((cached) => cached || caches.match("./"))
    );
}

self.addEventListener("fetch", (event) => {
  if (!shouldCache(event.request)) return;

  if (event.request.mode === "navigate") {
    event.respondWith(networkFirst(event.request));
    return;
  }

  event.respondWith(cacheFirst(event.request));
});
