'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface IOSNavigator extends Navigator {
  standalone?: boolean;
}

const PWA_PROMPT_DISMISSED_KEY = 'pwa-prompt-dismissed';
const PWA_INSTALLED_KEY = 'pwa-installed';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as IOSNavigator).standalone === true;
    const hasDismissedPrompt = localStorage.getItem(PWA_PROMPT_DISMISSED_KEY) === 'true';
    const hasInstalledApp = localStorage.getItem(PWA_INSTALLED_KEY) === 'true';

    if (isStandalone) {
      localStorage.setItem(PWA_INSTALLED_KEY, 'true');
    }

    // Suppress install prompt if the app is already installed.
    if (isStandalone || hasInstalledApp) {
      setIsInstalled(true);
      return;
    }

    if (hasDismissedPrompt) {
      setIsDismissed(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      if (localStorage.getItem(PWA_PROMPT_DISMISSED_KEY) === 'true') {
        return;
      }

      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      localStorage.setItem(PWA_INSTALLED_KEY, 'true');
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      localStorage.setItem(PWA_INSTALLED_KEY, 'true');
      setIsInstalled(true);
      setShowPrompt(false);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setIsDismissed(true);
    // Don't show again across sessions for this browser profile.
    localStorage.setItem(PWA_PROMPT_DISMISSED_KEY, 'true');
  };

  // Don't show if already installed or previously dismissed.
  if (isInstalled || isDismissed || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50 animate-fade-in-up">
      <div className="bg-white border-2 border-primary/20 rounded-2xl shadow-xl p-4 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="font-display font-bold text-lg text-text mb-1">
              Install Marlie LMS
            </h3>
            <p className="text-sm text-text-muted mb-4">
              Add to your home screen for quick access and offline use.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleInstallClick}
                className="px-4 py-2 min-h-[44px] bg-primary text-white font-semibold rounded-lg hover:brightness-110 transition text-sm"
              >
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 min-h-[44px] border border-border text-text-muted font-medium rounded-lg hover:bg-bg-light transition text-sm"
              >
                Maybe Later
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-text-muted hover:text-text transition p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
