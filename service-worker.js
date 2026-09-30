/* =====================================================
   ChronoSphere · Service Worker (PWA)
   ===================================================== */

const CACHE_NAME = 'chronosphere-v5';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './assets/logo.svg'
];

// تثبيت Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching assets');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// تفعيل + حذف الكاش القديم
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// اعتراض الطلبات - استراتيجية Cache First للـ assets
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // لا تخزّن الطلبات الخارجية (fonts, APIs)
  if (!request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      return cached || fetch(request).then((response) => {
        // خزّن النسخ الجديدة
        const cloned = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, cloned);
        });
        return response;
      }).catch(() => {
        // إذا فشل الاتصال، أرجع index.html للصفحات
        if (request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});