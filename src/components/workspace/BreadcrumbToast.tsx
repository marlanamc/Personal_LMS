'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, X, ExternalLink } from 'lucide-react';

export interface BreadcrumbToastAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbToastProps {
  message: string;
  actions?: BreadcrumbToastAction[];
  duration?: number;
  onDismiss?: () => void;
}

export function BreadcrumbToast({ message, actions = [], duration = 15000, onDismiss }: BreadcrumbToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, 200);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50 max-w-md transition-all duration-200 ${
        isExiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="rounded-xl border border-primary/20 bg-bg-surface/95 backdrop-blur-sm shadow-lg p-4">
        <div className="flex items-start gap-3">
          {/* Success Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5 text-secondary" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground mb-2">{message}</p>

            {/* Actions */}
            {actions.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {actions.map((action, index) => (
                  action.href ? (
                    <Link
                      key={index}
                      href={action.href}
                      onClick={handleDismiss}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      {action.label}
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  ) : (
                    <button
                      key={index}
                      onClick={() => {
                        action.onClick?.();
                        handleDismiss();
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      {action.label}
                    </button>
                  )
                ))}
              </div>
            )}
          </div>

          {/* Dismiss Button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-primary/10 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Toast Manager Hook
export function useBreadcrumbToast() {
  const [toast, setToast] = useState<BreadcrumbToastProps | null>(null);

  const showToast = (props: BreadcrumbToastProps) => {
    setToast(props);
  };

  const dismissToast = () => {
    setToast(null);
  };

  return {
    toast,
    showToast,
    dismissToast,
  };
}
