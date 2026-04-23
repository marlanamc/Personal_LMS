import type { ThoughtBullet } from './thought-organization';

/**
 * Request notification permission from the user
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    return await Notification.requestPermission();
  }

  return Notification.permission;
}

/**
 * Send a browser notification when a trigger fires
 */
export function notifyTriggerFired(bullet: ThoughtBullet): void {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported');
    return;
  }

  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted');
    return;
  }

  try {
    const notification = new Notification('🎯 Next trigger ready!', {
      body: bullet.text,
      icon: '/icons/icon-192.png',
      badge: '/icons/badge-72.png',
      tag: `trigger-${bullet.id}`,
      requireInteraction: false,
      silent: false,
    });

    // Auto-close after 5 seconds
    setTimeout(() => notification.close(), 5000);

    // Optional: Handle notification click
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
}

/**
 * Show an in-app toast notification
 */
export function showToast(message: string, type: 'success' | 'info' = 'info'): void {
  // Dispatch custom event for toast system
  const event = new CustomEvent('flow-toast', {
    detail: { message, type },
  });
  window.dispatchEvent(event);
}

/**
 * Notify when a trigger is completed and the next one is ready
 */
export function notifyNextTrigger(completedBullet: ThoughtBullet, nextBullet?: ThoughtBullet): void {
  // Show celebration for completed
  showToast(`✓ ${completedBullet.text}`, 'success');

  // If there's a next trigger, notify
  if (nextBullet) {
    // Small delay so the completion toast is seen first
    setTimeout(() => {
      notifyTriggerFired(nextBullet);
      showToast(`🎯 Up next: ${nextBullet.text}`, 'info');
    }, 1500);
  }
}
