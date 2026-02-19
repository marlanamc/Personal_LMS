/**
 * API response helpers for consistent API responses
 * Provides standardized success and error responses
 *
 * Usage:
 * import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';
 * return apiSuccess({ data: user }, 201);
 * return apiError('Not found', 404);
 */

import { NextResponse } from 'next/server';
import { ValidationError } from './validators';
import { logger } from './logger';

/**
 * Standard API error response format
 */
export interface ApiErrorResponse {
    error: string;
    code?: string;
    field?: string;
    details?: unknown;
}

/**
 * Standard API success response format
 */
export interface ApiSuccessResponse<T = unknown> {
    ok: true;
    data?: T;
    message?: string;
}

/**
 * Create a successful API response
 */
export function apiSuccess<T = unknown>(
    data?: T,
    status = 200,
    message?: string
): NextResponse<ApiSuccessResponse<T>> {
    const response: ApiSuccessResponse<T> = { ok: true };

    if (data !== undefined) {
        response.data = data;
    }

    if (message) {
        response.message = message;
    }

    return NextResponse.json(response, { status });
}

/**
 * Create an error API response
 */
export function apiError(
    message: string,
    status = 400,
    code?: string,
    field?: string,
    details?: unknown
): NextResponse<ApiErrorResponse> {
    const response: ApiErrorResponse = { error: message };

    if (code) {
        response.code = code;
    }

    if (field) {
        response.field = field;
    }

    if (details && process.env.NODE_ENV === 'development') {
        response.details = details;
    }

    return NextResponse.json(response, { status });
}

/**
 * Handle validation errors
 */
export function handleValidationError(error: ValidationError): NextResponse<ApiErrorResponse> {
    logger.warn('Validation error', {
        message: error.message,
        field: error.field,
        code: error.code,
    });

    return apiError(error.message, 400, error.code, error.field);
}

/**
 * Handle API errors with automatic error type detection
 */
export function handleApiError(
    error: unknown,
    context?: {
        defaultMessage?: string;
        userId?: string;
        path?: string;
    }
): NextResponse<ApiErrorResponse> {
    const defaultMessage = context?.defaultMessage || 'An error occurred';

    // Handle ValidationError
    if (error instanceof ValidationError) {
        return handleValidationError(error);
    }

    // Handle known error types
    if (error instanceof Error) {
        // Log the full error with stack trace
        logger.error('API error', error, {
            userId: context?.userId,
            path: context?.path,
        });

        // In development, return detailed error
        if (process.env.NODE_ENV === 'development') {
            return apiError(error.message, 500, 'INTERNAL_ERROR', undefined, {
                stack: error.stack,
            });
        }

        // In production, return generic message
        return apiError(defaultMessage, 500, 'INTERNAL_ERROR');
    }

    // Handle unknown error types
    logger.error('Unknown API error', undefined, {
        error: String(error),
        userId: context?.userId,
        path: context?.path,
    });

    return apiError(defaultMessage, 500, 'UNKNOWN_ERROR');
}

/**
 * Common API error responses
 */
export const ApiErrors = {
    /**
     * 401 Unauthorized - User not authenticated
     */
    unauthorized(message = 'Unauthorized'): NextResponse<ApiErrorResponse> {
        return apiError(message, 401, 'UNAUTHORIZED');
    },

    /**
     * 403 Forbidden - User authenticated but lacks permission
     */
    forbidden(message = 'Forbidden'): NextResponse<ApiErrorResponse> {
        return apiError(message, 403, 'FORBIDDEN');
    },

    /**
     * 404 Not Found - Resource not found
     */
    notFound(resource = 'Resource', id?: string): NextResponse<ApiErrorResponse> {
        const message = id ? `${resource} not found: ${id}` : `${resource} not found`;
        return apiError(message, 404, 'NOT_FOUND');
    },

    /**
     * 409 Conflict - Resource already exists
     */
    conflict(message = 'Resource already exists'): NextResponse<ApiErrorResponse> {
        return apiError(message, 409, 'CONFLICT');
    },

    /**
     * 422 Unprocessable Entity - Business logic error
     */
    unprocessable(message: string): NextResponse<ApiErrorResponse> {
        return apiError(message, 422, 'UNPROCESSABLE');
    },

    /**
     * 429 Too Many Requests - Rate limit exceeded
     */
    rateLimited(message = 'Too many requests'): NextResponse<ApiErrorResponse> {
        return apiError(message, 429, 'RATE_LIMITED');
    },

    /**
     * 500 Internal Server Error - Generic server error
     */
    internal(message = 'Internal server error'): NextResponse<ApiErrorResponse> {
        return apiError(message, 500, 'INTERNAL_ERROR');
    },

    /**
     * 503 Service Unavailable - Service temporarily unavailable
     */
    unavailable(message = 'Service unavailable'): NextResponse<ApiErrorResponse> {
        return apiError(message, 503, 'SERVICE_UNAVAILABLE');
    },
};

/**
 * Wrap an API route handler with automatic error handling
 */
export function withErrorHandling<T = unknown>(
    handler: (request: Request, context?: unknown) => Promise<NextResponse<T>>,
    options?: {
        defaultErrorMessage?: string;
    }
): (request: Request, context?: unknown) => Promise<NextResponse<T | ApiErrorResponse>> {
    return async (request: Request, context?: unknown) => {
        try {
            return await handler(request, context);
        } catch (error) {
            return handleApiError(error, {
                defaultMessage: options?.defaultErrorMessage,
                path: new URL(request.url).pathname,
            });
        }
    };
}

/**
 * Check if response is an error response
 */
export function isApiError(response: unknown): response is ApiErrorResponse {
    return (
        typeof response === 'object' &&
        response !== null &&
        'error' in response &&
        typeof (response as ApiErrorResponse).error === 'string'
    );
}

/**
 * Check if response is a success response
 */
export function isApiSuccess<T = unknown>(response: unknown): response is ApiSuccessResponse<T> {
    return (
        typeof response === 'object' &&
        response !== null &&
        'ok' in response &&
        (response as ApiSuccessResponse).ok === true
    );
}
