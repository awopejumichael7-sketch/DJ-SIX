// ============================================================
// DJ SIX – Service Worker (PWA)
// ============================================================
const CACHE_NAME = 'djsix-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/global.css',
  '/css/music-player.css',
  '/js/firebase-config.js',
  '/js/components.js',
  '/js/music-player.js',
  '/manifest.json',
  '/pages/about.html',
  '/pages/mixtapes.html',
  '/pages/videos.html',
  '/pages/events.html',
  '/pages/gallery.html',
  '/pages/testimonials.html',
  '/pages/booking.html',
  '/pages/contact.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('firestore') || event.request.url.includes('googleapis')) return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => caches.match('/index.html'));
    })
  );
});

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() || { title: 'DJ SIX', body: 'New update available!' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: 'https://via.placeholder.com/192x192/00D4FF/0A0A0A?text=DJ6',
      badge: 'https://via.placeholder.com/96x96/00D4FF/0A0A0A?text=DJ6',
      vibrate: [200, 100, 200],
      data: { url: data.url || '/' }
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data?.url || '/'));
});
