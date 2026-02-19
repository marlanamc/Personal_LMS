'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';

export default function PWAUpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [dismissCount, setDismissCount] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const handleUpdateAvailable = (event: Event) => {
        const customEvent = event as CustomEvent;
        setWaitingWorker(customEvent.detail.waitingWorker);
        setShowUpdate(true);
      };

      window.addEventListener('swUpdateAvailable', handleUpdateAvailable);

      return () => {
        window.removeEventListener('swUpdateAvailable', handleUpdateAvailable);
      };
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      setIsUpdating(true);
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

      // Fallback reload after 3 seconds if controllerchange doesn't fire
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  const handleDismiss = () => {
    const newCount = dismissCount + 1;
    setDismissCount(newCount);
    setShowUpdate(false);

    // Progressively shorter delays - students WILL update eventually
    // 1st dismiss: 2 minutes, 2nd: 1 minute, 3rd+: 30 seconds
    const delay = newCount === 1 ? 2 * 60 * 1000 : newCount === 2 ? 60 * 1000 : 30 * 1000;
    
    setTimeout(() => {
      setShowUpdate(true);
    }, delay);
  };

  if (!showUpdate) return null;

  // After 2 dismisses, show a more urgent full-screen modal
  if (dismissCount >= 2) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-text mb-2">
            New Content Available! 🎉
          </h2>
          <p className="text-text-muted mb-6">
            Your teacher added new activities. Update now to see them!
          </p>
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-xl transition-[background-color,transform] active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
          >
            {isUpdating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Updating…
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Update Now
              </>
            )}
          </button>
          <button
            onClick={handleDismiss}
            className="mt-3 text-sm text-text-muted hover:text-text"
          >
            Remind me later
          </button>
        </div>
      </div>
    );
  }

  // Standard bottom banner for first dismisses
  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-[9999]">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-primary/20 p-4 animate-in slide-in-from-bottom duration-300">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-text text-base">
              New activities available!
            </p>
            <p className="text-sm text-text-muted mt-0.5">
              Tap to get the latest content
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-xl transition-[background-color,transform] active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
          >
            {isUpdating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Updating…
              </>
            ) : (
              'Update Now'
            )}
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-3 rounded-xl text-text-muted hover:bg-bg-light transition-colors font-medium"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
