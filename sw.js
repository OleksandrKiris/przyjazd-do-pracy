const CACHE_NAME = "arrival-guide-v27-logo-header";
const ASSETS = [
  "./",
  "./index.html",
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
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).catch(() => caches.match("./index.html")));
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
