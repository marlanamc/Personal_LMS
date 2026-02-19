import crypto from 'crypto';
import { prisma } from './prisma';

/**
 * Generate a cryptographically secure, random class code
 *
 * Format: 6 characters, uppercase alphanumeric
 * Character set excludes ambiguous characters (0, O, 1, I, L)
 * Uses crypto.randomBytes for cryptographic security
 *
 * Example: "A3K7M9"
 */
export function generateRandomCode(): string {
    // Character set: uppercase letters and numbers, excluding ambiguous chars
    // Excludes: 0 (zero), O (letter O), 1 (one), I (letter I), L (letter L)
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    const codeLength = 6;

    let code = '';
    const bytes = crypto.randomBytes(codeLength);

    for (let i = 0; i < codeLength; i++) {
        // Use modulo to map random byte to character set
        code += chars[bytes[i] % chars.length];
    }

    return code;
}

/**
 * Generate a unique class code
 * Checks database for collisions and regenerates if necessary
 *
 * @param maxAttempts Maximum number of generation attempts before giving up
 * @returns A unique class code
 * @throws Error if unable to generate unique code after maxAttempts
 */
export async function generateUniqueClassCode(maxAttempts: number = 10): Promise<string> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const code = generateRandomCode();

        // Check if code already exists
        const existing = await prisma.class.findUnique({
            where: { code },
            select: { id: true },
        });

        if (!existing) {
            return code;
        }

        // Log collision for monitoring (very rare with 32^6 = 1 billion+ possibilities)
        console.warn(`[ClassCode] Collision detected for code ${code}, regenerating... (attempt ${attempt + 1}/${maxAttempts})`);
    }

    // This should be extremely rare (probability: ~0.0001% even with 1000 classes)
    throw new Error(`Failed to generate unique class code after ${maxAttempts} attempts`);
}

/**
 * Validate a class code format
 * Ensures code matches expected format before querying database
 */
export function isValidClassCodeFormat(code: string): boolean {
    if (!code || typeof code !== 'string') {
        return false;
    }

    // Must be exactly 6 characters, uppercase alphanumeric, no ambiguous chars
    const validPattern = /^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$/;
    return validPattern.test(code);
}
