/**
 * Audit logging for administrative actions
 * Tracks security-sensitive operations for compliance and security monitoring
 */

import { logger } from './logger';

export type AuditAction =
  | 'user.password_reset'
  | 'user.create'
  | 'user.delete'
  | 'class.create'
  | 'class.delete'
  | 'assignment.create'
  | 'assignment.delete'
  | 'points.manual_award'
  | 'weekly_reset.execute'
  | 'admin.unauthorized_attempt';

export interface AuditLogEntry {
  timestamp: Date;
  action: AuditAction;
  actorId: string;
  actorRole: string;
  targetId?: string; // ID of the resource being acted upon
  targetType?: string; // Type of resource (user, class, etc.)
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  success: boolean;
  errorMessage?: string;
}

/**
 * Log an administrative action
 * In production, this should write to a database table or external logging service
 */
export function auditLog(entry: Omit<AuditLogEntry, 'timestamp'>): void {
  const fullEntry: AuditLogEntry = {
    ...entry,
    timestamp: new Date(),
  };

  const statusText = entry.success ? 'SUCCESS' : 'FAILED';
  const message = `[AUDIT] ${statusText} - ${entry.action}`;

  const context = {
    action: entry.action,
    actorId: entry.actorId,
    actorRole: entry.actorRole,
    targetId: entry.targetId,
    targetType: entry.targetType,
    ipAddress: entry.ipAddress,
    userAgent: entry.userAgent,
    ...entry.metadata,
  };

  // Use structured logger
  if (entry.success) {
    logger.info(message, context);
  } else {
    logger.warn(message, {
      ...context,
      errorMessage: entry.errorMessage,
    });
  }

  // TODO: In production, also persist to database
  // await prisma.auditLog.create({ data: fullEntry });
}

/**
 * Middleware helper to extract IP and User Agent from request
 */
export function getRequestMetadata(request?: Request): {
  ipAddress?: string;
  userAgent?: string;
} {
  if (!request) {
    return {};
  }

  return {
    ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               request.headers.get('x-real-ip') ||
               'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
  };
}

/**
 * Helper to create audit log entries with common fields
 */
export function createAuditLogger(request?: Request) {
  const requestMetadata = getRequestMetadata(request);

  return {
    /**
     * Log a successful action
     */
    success(
      action: AuditAction,
      actorId: string,
      actorRole: string,
      options?: {
        targetId?: string;
        targetType?: string;
        metadata?: Record<string, unknown>;
      }
    ) {
      auditLog({
        action,
        actorId,
        actorRole,
        success: true,
        ...requestMetadata,
        ...options,
      });
    },

    /**
     * Log a failed action
     */
    failure(
      action: AuditAction,
      actorId: string,
      actorRole: string,
      errorMessage: string,
      options?: {
        targetId?: string;
        targetType?: string;
        metadata?: Record<string, unknown>;
      }
    ) {
      auditLog({
        action,
        actorId,
        actorRole,
        success: false,
        errorMessage,
        ...requestMetadata,
        ...options,
      });
    },
  };
}
