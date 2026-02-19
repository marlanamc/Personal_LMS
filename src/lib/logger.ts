/**
 * Structured logging system for production-grade logging
 * Replaces console.log with proper log levels, timestamps, and context
 *
 * Usage:
 * import { logger } from '@/lib/logger';
 * logger.info('User logged in', { userId: '123' });
 * logger.error('Database error', { error, query });
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
    [key: string]: unknown;
    userId?: string;
    requestId?: string;
    path?: string;
    method?: string;
    duration?: number;
}

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: LogContext;
    error?: Error;
}

/**
 * Format log entry for output
 */
function formatLogEntry(entry: LogEntry): string {
    const { timestamp, level, message, context, error } = entry;

    const levelEmoji = {
        debug: '🔍',
        info: 'ℹ️ ',
        warn: '⚠️ ',
        error: '❌',
    };

    const parts: string[] = [
        `${levelEmoji[level]} [${level.toUpperCase()}]`,
        `${timestamp}`,
        message,
    ];

    if (context && Object.keys(context).length > 0) {
        parts.push(`| Context: ${JSON.stringify(context)}`);
    }

    if (error) {
        parts.push(`| Error: ${error.message}`);
        if (error.stack && process.env.NODE_ENV === 'development') {
            parts.push(`\nStack: ${error.stack}`);
        }
    }

    return parts.join(' ');
}

/**
 * Check if log level should be output based on environment
 */
function shouldLog(level: LogLevel): boolean {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isProduction = process.env.NODE_ENV === 'production';

    // In production, only log info, warn, and error
    if (isProduction && level === 'debug') {
        return false;
    }

    // In development, log everything
    if (isDevelopment) {
        return true;
    }

    // Default: log everything except debug
    return level !== 'debug';
}

/**
 * Write log entry to output
 * In production, this should be replaced with external logging service
 */
function writeLog(entry: LogEntry): void {
    if (!shouldLog(entry.level)) {
        return;
    }

    const formatted = formatLogEntry(entry);

    // Output to appropriate console method
    switch (entry.level) {
        case 'debug':
            console.debug(formatted);
            break;
        case 'info':
            console.log(formatted);
            break;
        case 'warn':
            console.warn(formatted);
            break;
        case 'error':
            console.error(formatted);
            break;
    }

    // TODO: In production, also send to external logging service
    // Example: await sendToDatadog(entry);
    // Example: await sendToSentry(entry);
}

/**
 * Create a logger instance
 */
export class Logger {
    private defaultContext: LogContext;

    constructor(defaultContext: LogContext = {}) {
        this.defaultContext = defaultContext;
    }

    /**
     * Create a child logger with additional context
     */
    child(context: LogContext): Logger {
        return new Logger({ ...this.defaultContext, ...context });
    }

    /**
     * Log debug message (development only)
     */
    debug(message: string, context?: LogContext): void {
        writeLog({
            timestamp: new Date().toISOString(),
            level: 'debug',
            message,
            context: { ...this.defaultContext, ...context },
        });
    }

    /**
     * Log informational message
     */
    info(message: string, context?: LogContext): void {
        writeLog({
            timestamp: new Date().toISOString(),
            level: 'info',
            message,
            context: { ...this.defaultContext, ...context },
        });
    }

    /**
     * Log warning message
     */
    warn(message: string, context?: LogContext): void {
        writeLog({
            timestamp: new Date().toISOString(),
            level: 'warn',
            message,
            context: { ...this.defaultContext, ...context },
        });
    }

    /**
     * Log error message
     */
    error(message: string, error?: Error | unknown, context?: LogContext): void {
        const errorObj = error instanceof Error ? error : undefined;
        const errorContext = error && !(error instanceof Error) ? { error } : {};

        writeLog({
            timestamp: new Date().toISOString(),
            level: 'error',
            message,
            context: { ...this.defaultContext, ...errorContext, ...context },
            error: errorObj,
        });
    }

    /**
     * Time a function execution and log duration
     */
    async time<T>(
        label: string,
        fn: () => Promise<T>,
        context?: LogContext
    ): Promise<T> {
        const start = Date.now();
        try {
            const result = await fn();
            const duration = Date.now() - start;
            this.info(`${label} completed`, { ...context, duration });
            return result;
        } catch (error) {
            const duration = Date.now() - start;
            this.error(`${label} failed`, error, { ...context, duration });
            throw error;
        }
    }
}

/**
 * Default logger instance
 */
export const logger = new Logger();

/**
 * Create a request-scoped logger with request metadata
 */
export function createRequestLogger(request: Request): Logger {
    const url = new URL(request.url);
    return logger.child({
        method: request.method,
        path: url.pathname,
        requestId: crypto.randomUUID(),
    });
}

/**
 * Create a user-scoped logger with user context
 */
export function createUserLogger(userId: string, role?: string): Logger {
    return logger.child({
        userId,
        role,
    });
}
