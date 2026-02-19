/**
 * Request validation utilities for API routes
 * Provides type-safe validation with clear error messages
 *
 * Usage:
 * import { validateUserId, validateProgress } from '@/lib/validators';
 * const validatedId = validateUserId(input);
 * const validatedProgress = validateProgress(input);
 */

import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from './auth-config';

export class ValidationError extends Error {
    constructor(
        message: string,
        public field?: string,
        public code?: string
    ) {
        super(message);
        this.name = 'ValidationError';
    }
}

/**
 * Validate user ID (CUID format)
 */
export function validateUserId(value: unknown, fieldName = 'userId'): string {
    if (typeof value !== 'string') {
        throw new ValidationError(`${fieldName} must be a string`, fieldName, 'INVALID_TYPE');
    }

    if (value.trim().length === 0) {
        throw new ValidationError(`${fieldName} is required`, fieldName, 'REQUIRED');
    }

    // CUID format: starts with 'c', followed by alphanumeric characters
    if (!/^c[a-z0-9]{24}$/i.test(value)) {
        throw new ValidationError(`${fieldName} has invalid format`, fieldName, 'INVALID_FORMAT');
    }

    return value;
}

/**
 * Validate class code (6 uppercase alphanumeric characters)
 */
export function validateClassCode(value: unknown, fieldName = 'code'): string {
    if (typeof value !== 'string') {
        throw new ValidationError(`${fieldName} must be a string`, fieldName, 'INVALID_TYPE');
    }

    const trimmed = value.trim().toUpperCase();

    if (trimmed.length !== 6) {
        throw new ValidationError(
            `${fieldName} must be exactly 6 characters`,
            fieldName,
            'INVALID_LENGTH'
        );
    }

    if (!/^[A-Z0-9]{6}$/.test(trimmed)) {
        throw new ValidationError(
            `${fieldName} must contain only letters and numbers`,
            fieldName,
            'INVALID_FORMAT'
        );
    }

    return trimmed;
}

/**
 * Validate progress/percentage (0-100)
 */
export function validateProgress(value: unknown, fieldName = 'progress'): number {
    if (value === null || value === undefined) {
        throw new ValidationError(`${fieldName} is required`, fieldName, 'REQUIRED');
    }

    const num = Number(value);

    if (isNaN(num)) {
        throw new ValidationError(`${fieldName} must be a number`, fieldName, 'INVALID_TYPE');
    }

    if (!Number.isFinite(num)) {
        throw new ValidationError(`${fieldName} must be finite`, fieldName, 'INVALID_VALUE');
    }

    if (num < 0 || num > 100) {
        throw new ValidationError(
            `${fieldName} must be between 0 and 100`,
            fieldName,
            'OUT_OF_RANGE'
        );
    }

    return Math.round(num);
}

/**
 * Validate optional progress/percentage (0-100)
 */
export function validateOptionalProgress(
    value: unknown,
    fieldName = 'progress'
): number | undefined {
    if (value === null || value === undefined) {
        return undefined;
    }

    return validateProgress(value, fieldName);
}

/**
 * Validate password strength
 */
export function validatePassword(value: unknown, fieldName = 'password'): string {
    if (typeof value !== 'string') {
        throw new ValidationError(`${fieldName} must be a string`, fieldName, 'INVALID_TYPE');
    }

    if (value.length < MIN_PASSWORD_LENGTH) {
        throw new ValidationError(
            `${fieldName} must be at least ${MIN_PASSWORD_LENGTH} characters`,
            fieldName,
            'TOO_SHORT'
        );
    }

    if (value.length > MAX_PASSWORD_LENGTH) {
        throw new ValidationError(
            `${fieldName} must not exceed ${MAX_PASSWORD_LENGTH} characters`,
            fieldName,
            'TOO_LONG'
        );
    }

    return value;
}

/**
 * Validate string with length constraints
 */
export function validateString(
    value: unknown,
    options: {
        fieldName?: string;
        minLength?: number;
        maxLength?: number;
        pattern?: RegExp;
        required?: boolean;
    } = {}
): string {
    const {
        fieldName = 'field',
        minLength = 0,
        maxLength = 1000,
        pattern,
        required = true,
    } = options;

    if (value === null || value === undefined) {
        if (required) {
            throw new ValidationError(`${fieldName} is required`, fieldName, 'REQUIRED');
        }
        return '';
    }

    if (typeof value !== 'string') {
        throw new ValidationError(`${fieldName} must be a string`, fieldName, 'INVALID_TYPE');
    }

    const trimmed = value.trim();

    if (required && trimmed.length === 0) {
        throw new ValidationError(`${fieldName} cannot be empty`, fieldName, 'REQUIRED');
    }

    if (trimmed.length < minLength) {
        throw new ValidationError(
            `${fieldName} must be at least ${minLength} characters`,
            fieldName,
            'TOO_SHORT'
        );
    }

    if (trimmed.length > maxLength) {
        throw new ValidationError(
            `${fieldName} must not exceed ${maxLength} characters`,
            fieldName,
            'TOO_LONG'
        );
    }

    if (pattern && !pattern.test(trimmed)) {
        throw new ValidationError(
            `${fieldName} has invalid format`,
            fieldName,
            'INVALID_FORMAT'
        );
    }

    return trimmed;
}

/**
 * Validate integer within range
 */
export function validateInteger(
    value: unknown,
    options: {
        fieldName?: string;
        min?: number;
        max?: number;
        required?: boolean;
    } = {}
): number {
    const { fieldName = 'field', min = -Infinity, max = Infinity, required = true } = options;

    if (value === null || value === undefined) {
        if (required) {
            throw new ValidationError(`${fieldName} is required`, fieldName, 'REQUIRED');
        }
        return 0;
    }

    const num = Number(value);

    if (isNaN(num)) {
        throw new ValidationError(`${fieldName} must be a number`, fieldName, 'INVALID_TYPE');
    }

    if (!Number.isInteger(num)) {
        throw new ValidationError(`${fieldName} must be an integer`, fieldName, 'INVALID_TYPE');
    }

    if (num < min || num > max) {
        throw new ValidationError(
            `${fieldName} must be between ${min} and ${max}`,
            fieldName,
            'OUT_OF_RANGE'
        );
    }

    return num;
}

/**
 * Validate email address
 */
export function validateEmail(value: unknown, fieldName = 'email'): string {
    if (typeof value !== 'string') {
        throw new ValidationError(`${fieldName} must be a string`, fieldName, 'INVALID_TYPE');
    }

    const trimmed = value.trim().toLowerCase();

    // Basic email validation (RFC 5322 simplified)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmed)) {
        throw new ValidationError(`${fieldName} is invalid`, fieldName, 'INVALID_FORMAT');
    }

    return trimmed;
}

/**
 * Validate enum value
 */
export function validateEnum<T extends string>(
    value: unknown,
    allowedValues: readonly T[],
    fieldName = 'field'
): T {
    if (typeof value !== 'string') {
        throw new ValidationError(`${fieldName} must be a string`, fieldName, 'INVALID_TYPE');
    }

    if (!allowedValues.includes(value as T)) {
        throw new ValidationError(
            `${fieldName} must be one of: ${allowedValues.join(', ')}`,
            fieldName,
            'INVALID_VALUE'
        );
    }

    return value as T;
}

/**
 * Validate array of items
 */
export function validateArray<T>(
    value: unknown,
    itemValidator: (item: unknown, index: number) => T,
    options: {
        fieldName?: string;
        minLength?: number;
        maxLength?: number;
        required?: boolean;
    } = {}
): T[] {
    const { fieldName = 'field', minLength = 0, maxLength = 100, required = true } = options;

    if (value === null || value === undefined) {
        if (required) {
            throw new ValidationError(`${fieldName} is required`, fieldName, 'REQUIRED');
        }
        return [];
    }

    if (!Array.isArray(value)) {
        throw new ValidationError(`${fieldName} must be an array`, fieldName, 'INVALID_TYPE');
    }

    if (value.length < minLength) {
        throw new ValidationError(
            `${fieldName} must have at least ${minLength} items`,
            fieldName,
            'TOO_SHORT'
        );
    }

    if (value.length > maxLength) {
        throw new ValidationError(
            `${fieldName} must have at most ${maxLength} items`,
            fieldName,
            'TOO_LONG'
        );
    }

    try {
        return value.map((item, index) => itemValidator(item, index));
    } catch (error) {
        if (error instanceof ValidationError) {
            throw new ValidationError(
                `${fieldName}[${error.field}]: ${error.message}`,
                fieldName,
                'INVALID_ITEM'
            );
        }
        throw error;
    }
}

/**
 * Validate boolean value
 */
export function validateBoolean(value: unknown, fieldName = 'field'): boolean {
    if (typeof value === 'boolean') {
        return value;
    }

    if (value === 'true' || value === '1' || value === 1) {
        return true;
    }

    if (value === 'false' || value === '0' || value === 0) {
        return false;
    }

    throw new ValidationError(`${fieldName} must be a boolean`, fieldName, 'INVALID_TYPE');
}

/**
 * Validate activity type
 */
export const ACTIVITY_TYPES = [
    'quiz',
    'worksheet',
    'slides',
    'game',
    'guide',
    'resource',
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export function validateActivityType(value: unknown): ActivityType {
    return validateEnum(value, ACTIVITY_TYPES, 'activityType');
}

/**
 * Validate user role
 */
export const USER_ROLES = ['student', 'teacher'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export function validateUserRole(value: unknown): UserRole {
    return validateEnum(value, USER_ROLES, 'role');
}

/**
 * Helper to safely parse JSON from request body
 */
export async function parseRequestBody<T = unknown>(request: Request): Promise<T> {
    try {
        const body = await request.json();
        return body as T;
    } catch (error) {
        throw new ValidationError('Invalid JSON in request body', 'body', 'INVALID_JSON');
    }
}
