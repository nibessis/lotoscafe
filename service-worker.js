const cacheName = 'lotos-cafe-cache-v1';
const assetsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/scripts.js',
  '/images/1.jpg',
  '/images/2.jpg',
  '/images/3.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assetsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
