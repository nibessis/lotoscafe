// --- bump this on every deploy ---
const CACHE_VERSION = 'v4';
const STATIC_CACHE = `lotos-cafe-static-${CACHE_VERSION}`;

// Precache only the core shell. Big images are optional.
const PRECACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/scripts.js',
];

// Install: precache and take over asap
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// Activate: delete old caches and take control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys
        .filter((k) => k !== STATIC_CACHE)
        .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch strategies
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle same-origin
  if (url.origin !== self.location.origin) return;

  // 1) HTML pages: network-first (so content updates immediately)
  if (req.mode === 'navigate' || req.destination === 'document') {
    event.respondWith(networkFirst(req));
    return;
  }

  // 2) JSON/data: network-first so prices update
  if (req.destination === '' && url.pathname.endsWith('.json')) {
    event.respondWith(networkFirst(req));
    return;
  }

  // 3) Everything else (CSS/JS/images): stale-while-revalidate
  event.respondWith(staleWhileRevalidate(req));
});

async function networkFirst(req) {
  try {
    const fresh = await fetch(req, { cache: 'no-store' });
    const cache = await caches.open(STATIC_CACHE);
    cache.put(req, fresh.clone());
    return fresh;
  } catch (err) {
    const cached = await caches.match(req);
    if (cached) return cached;
    // Optional fallback:
    if (req.mode === 'navigate') return caches.match('/index.html');
    throw err;
  }
}

async function staleWhileRevalidate(req) {
  const cached = await caches.match(req);
  const fetchPromise = fetch(req).then((res) => {
    caches.open(STATIC_CACHE).then((c) => c.put(req, res.clone()));
    return res;
  }).catch(() => cached);
  return cached || fetchPromise;
}


