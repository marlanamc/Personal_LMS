/**
 * Clears all service worker caches to ensure fresh content on user change.
 * This is important for shared computers where multiple users log in/out.
 */
export async function clearServiceWorkerCache(): Promise<void> {
  // Clear caches from the main thread
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
  }

  // Also notify service worker to clear its caches
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_USER_CACHE' });
  }
}
