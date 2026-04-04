'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { Button } from './Button';
import StableDialog from './StableDialog';
import { nanoid } from 'nanoid';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'default';
  autoCloseAfter?: number; // milliseconds, 0 to disable
  isLoading?: boolean;
  showCountdown?: boolean;
}

/**
 * AuDHD-friendly confirmation dialog with optional auto-cancel after 10 seconds
 * Provides visual countdown timer to reduce anxiety about irreversible actions
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  autoCloseAfter = 10000,
  isLoading = false,
  showCountdown = true,
}: ConfirmDialogProps) {
  const [countdown, setCountdown] = useState<number>(autoCloseAfter / 1000);
  const [isConfirming, setIsConfirming] = useState(false);
  const dialogId = useMemo(() => `confirm-dialog-${nanoid(8)}`, []);

  // Auto-close countdown timer
  useEffect(() => {
    if (!isOpen || autoCloseAfter === 0) return;

    setCountdown(autoCloseAfter / 1000);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Auto-cancel when countdown reaches 0
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, autoCloseAfter, onClose]);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsConfirming(false);
    }
  };

  const variantConfig = {
    danger: {
      icon: 'text-red-500',
      bg: 'bg-red-50',
      button: 'warning' as const,
    },
    warning: {
      icon: 'text-amber-500',
      bg: 'bg-amber-50',
      button: 'accent' as const,
    },
    default: {
      icon: 'text-blue-500',
      bg: 'bg-blue-50',
      button: 'primary' as const,
    },
  };

  const config = variantConfig[variant];

  return (
    <StableDialog isOpen={isOpen} onClose={onClose} labelledBy={dialogId}>
      <div className="p-6 space-y-4" id={dialogId}>
        {/* Icon and Title */}
        <div className="flex items-start gap-4">
          <AlertCircle className={`h-6 w-6 mt-0.5 flex-shrink-0 ${config.icon}`} />
          <div>
            <h2 className="text-lg font-semibold text-text">{title}</h2>
            <p className="text-sm text-text-secondary mt-1">{message}</p>
          </div>
        </div>

        {/* Auto-close Countdown */}
        {showCountdown && autoCloseAfter > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-surface/50 border border-border-subtle/30">
            <div className="flex-1 text-xs text-text-muted">
              Auto-canceling in {countdown}s
            </div>
            <div className="h-1.5 flex-1 bg-border-subtle rounded-full overflow-hidden">
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: countdown / (autoCloseAfter / 1000) }}
                transition={{ duration: 1, ease: 'linear' }}
                className="h-full bg-primary origin-left"
                style={{ transformOrigin: 'left' }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-2">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isConfirming || isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={config.button}
            onClick={handleConfirm}
            disabled={isConfirming || isLoading}
          >
            {isConfirming || isLoading ? (
              <>
                <span className="animate-spin">⏳</span>
                {confirmLabel}
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </div>
      </div>
    </StableDialog>
  );
}

export default ConfirmDialog;
