// Service Worker for Class Companion PWA
// Cache version is based on build time - auto-increments on each deployment
const CACHE_VERSION = '2024-12-17-v1'; // Update this with each deployment
const CACHE_NAME = `class-companion-${CACHE_VERSION}`;

// Only cache essential shell files - content should be network-first
const SHELL_CACHE = [
  '/manifest.json',
];

// Routes that should ALWAYS use network-first (fresh content)
const NETWORK_FIRST_ROUTES = [
  '/dashboard',
  '/activity',
  '/grammar-reader',
  '/api/',
];

// Install event - cache shell resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing new version:', CACHE_VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(SHELL_CACHE);
      })
      .catch((err) => {
        console.log('[SW] Cache failed:', err);
      })
  );
  // Don't skip waiting automatically - let user decide when to update
});

// Listen for messages from app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  // Clear all caches when user logs in/out (important for shared computers)
  if (event.data && event.data.type === 'CLEAR_USER_CACHE') {
    caches.keys().then((cacheNames) => {
      return Promise.all(cacheNames.map((name) => caches.delete(name)));
    });
  }
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Claim all clients immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - NETWORK-FIRST for content, cache-first only for static assets
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  // Never cache the service worker file itself
  if (url.pathname === '/sw.js') {
    event.respondWith(fetch(event.request));
    return;
  }

  // Check if this is a network-first route (content that should always be fresh)
  const isNetworkFirst = NETWORK_FIRST_ROUTES.some(route => url.pathname.startsWith(route));

  if (isNetworkFirst) {
    // NETWORK-FIRST: Try network, fall back to cache
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful responses for offline fallback
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Network failed, try cache
          return caches.match(event.request);
        })
    );
    return;
  }

  // For static assets (JS, CSS, images) - STALE-WHILE-REVALIDATE
  // Serve from cache immediately, but update cache in background
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff2?)$/)) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse);

          // Return cached response immediately, or wait for network
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // For HTML pages - NETWORK-FIRST with cache fallback
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || caches.match('/');
        });
      })
  );
});


