/**
 * Authentication configuration constants
 * Centralized settings for password hashing and security
 */

/**
 * Bcrypt salt rounds for password hashing
 *
 * Industry standard for 2025:
 * - 10 rounds: ~10ms per hash (legacy, still acceptable)
 * - 12 rounds: ~40ms per hash (recommended for 2025)
 * - 14 rounds: ~150ms per hash (high security, may impact UX)
 *
 * We use 12 rounds as a balance between security and performance.
 * This provides strong protection against brute force attacks while
 * maintaining reasonable response times for password operations.
 */
export const BCRYPT_ROUNDS = 12;

/**
 * Minimum password length
 * NIST recommends at least 8 characters
 */
export const MIN_PASSWORD_LENGTH = 8;

/**
 * Maximum password length to prevent DoS attacks
 * Bcrypt has a 72-byte limit, but we set a reasonable max
 */
export const MAX_PASSWORD_LENGTH = 128;
