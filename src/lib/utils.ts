/**
 * Utility functions
 */

/**
 * Concatenate class names, filtering out falsy values.
 * A simple alternative to clsx/classnames libraries.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
