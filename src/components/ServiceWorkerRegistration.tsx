'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    // Register service worker on ALL devices (not just mobile)
    // This ensures consistent behavior and update notifications everywhere
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      let registration: ServiceWorkerRegistration | null = null;
      let updateInterval: NodeJS.Timeout | null = null;
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          checkForUpdates();
        }
      };

      const checkForUpdates = () => {
        if (registration) {
          registration.update().catch((error) => {
            console.error('[SW] Error checking for updates:', error);
          });
        }
      };

      navigator.serviceWorker
        .register(`/sw.js?build=${encodeURIComponent((window as { __NEXT_DATA__?: { buildId?: string } }).__NEXT_DATA__?.buildId || 'dev')}`, { updateViaCache: 'none' })
        .then((reg) => {
          registration = reg;

          // Check if there's already a waiting service worker
          if (reg.waiting && navigator.serviceWorker.controller) {
            window.dispatchEvent(
              new CustomEvent('swUpdateAvailable', {
                detail: { waitingWorker: reg.waiting }
              })
            );
          }

          // Listen for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;

            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (
                  newWorker.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  window.dispatchEvent(
                    new CustomEvent('swUpdateAvailable', {
                      detail: { waitingWorker: newWorker }
                    })
                  );
                }
              });
            }
          });

          // Check for updates immediately
          checkForUpdates();

          // Check for updates when window regains focus (user returns to app)
          window.addEventListener('focus', checkForUpdates);

          // Check for updates when coming back online
          window.addEventListener('online', checkForUpdates);

          // Check for updates every 5 MINUTES (not every hour)
          // This ensures students get new content quickly
          updateInterval = setInterval(() => {
            checkForUpdates();
          }, 5 * 60 * 1000);

          // Also check on visibility change (when tab becomes visible)
          document.addEventListener('visibilitychange', handleVisibilityChange);
        })
        .catch((error) => {
          console.error('[SW] Registration failed:', error);
        });

      return () => {
        if (updateInterval) {
          clearInterval(updateInterval);
        }
        window.removeEventListener('focus', checkForUpdates);
        window.removeEventListener('online', checkForUpdates);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, []);

  return null;
}
