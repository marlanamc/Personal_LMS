/**
 * Trigger haptic feedback on supported devices
 */
export function triggerHaptic(style: 'light' | 'medium' | 'heavy' = 'light') {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    const duration = style === 'light' ? 10 : style === 'medium' ? 20 : 30;
    navigator.vibrate(duration);
  }
}
