// Service Worker for Personal LMS PWA
// Cache version is derived from the build id passed in sw.js?build=<id>.
const SW_URL = new URL(self.location.href);
const BUILD_HASH = SW_URL.searchParams.get('build') || 'dev';
const CACHE_VERSION = `build-${BUILD_HASH}`;
const CACHE_NAME = `personal-lms-${CACHE_VERSION}`;

// Only cache essential shell files - content should be network-first
const SHELL_CACHE = [
  '/manifest.json',
  '/offline',
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
  // Activate immediately to reduce stale-app sessions in PWA mode.
  self.skipWaiting();
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

self.addEventListener('push', (event) => {
  const fallback = {
    title: 'Personal LMS',
    body: 'You have a new reminder.',
    url: '/dashboard',
    icon: '/icon-192-v2.png',
    badge: '/icon-192-v2.png',
    tag: 'personal-lms-reminder',
  };

  let payload = fallback;
  if (event.data) {
    try {
      payload = { ...fallback, ...(event.data.json() || {}) };
    } catch {
      const body = event.data.text();
      payload = { ...fallback, body: body || fallback.body };
    }
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: payload.icon,
      badge: payload.badge,
      tag: payload.tag,
      data: {
        url: payload.url || '/dashboard',
      },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification?.data?.url || '/dashboard';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ('focus' in client) {
          const clientUrl = new URL(client.url);
          if (clientUrl.pathname === new URL(targetUrl, self.location.origin).pathname) {
            return client.focus();
          }
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
      return undefined;
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
  const isSameOrigin = url.origin === self.location.origin;

  // Only handle same-origin requests.
  if (!isSameOrigin) {
    return;
  }

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

  // For HTML pages/navigation - NETWORK-FIRST with cache fallback
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
          if (cachedResponse) {
            return cachedResponse;
          }

          // If this is a document navigation and cache is empty, serve the offline page.
          if (event.request.mode === 'navigate') {
            return caches.match('/offline').then((offlineResponse) => {
              if (offlineResponse) {
                return offlineResponse;
              }
              return new Response('Offline. Please reconnect and try again.', {
                status: 503,
                headers: { 'Content-Type': 'text/plain; charset=utf-8' },
              });
            });
          }

          return new Response('Offline', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          });
        });
      })
  );
});
