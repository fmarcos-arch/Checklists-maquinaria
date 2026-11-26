const CACHE_NAME = "elecnor-prl-offline-v2";
const RECURSOS_OFFLINE = [
  "./",
  "./index.html",
  "https://cdn.tailwindcss.com",
  "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(RECURSOS_OFFLINE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  if (event.request.url.includes("script.google.com")) return;

  event.respondWith(
    fetch(event.request)
      .then(res => {
        const clon = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clon));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
