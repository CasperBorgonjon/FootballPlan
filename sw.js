// Minimal service worker for installability + offline app shell.
// - Navigations: network-first (always try for the freshest build), fall back
//   to cache when offline.
// - Static assets: cache-first (fast, offline-capable).
// - Cross-origin requests (Supabase API) are never intercepted — always live.
const CACHE = 'plan-v1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return; // Supabase etc.

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          caches.open(CACHE).then((c) => c.put(req, res.clone()));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('/FootballPlan/')))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then((cached) =>
      cached ||
      fetch(req).then((res) => {
        if (res.status === 200) caches.open(CACHE).then((c) => c.put(req, res.clone()));
        return res;
      })
    )
  );
});
