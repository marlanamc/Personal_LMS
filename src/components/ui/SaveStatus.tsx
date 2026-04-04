'use client';

import { useEffect, useState } from 'react';
import { Check, AlertCircle, Loader2 } from 'lucide-react';

interface SaveStatusProps {
  isSaving: boolean;
  lastSaved?: Date | null;
  error?: string | null;
  show?: boolean; // Whether to show when idle (default: false)
}

/**
 * Subtle indicator showing save status
 * Shows "Saving...", "Saved just now", "Saved 2m ago", or error state
 * Helps reduce anxiety about data persistence (AuDHD-friendly)
 */
export function SaveStatus({
  isSaving,
  lastSaved,
  error,
  show = false,
}: SaveStatusProps) {
  const [displayText, setDisplayText] = useState<string>('');

  // Update display text based on time since last save
  useEffect(() => {
    if (isSaving) {
      setDisplayText('Saving...');
      return;
    }

    if (error) {
      setDisplayText(`Error: ${error}`);
      return;
    }

    if (!lastSaved) {
      setDisplayText('');
      return;
    }

    const now = new Date();
    const diff = now.getTime() - lastSaved.getTime();

    if (diff < 1000) {
      setDisplayText('Saved just now');
    } else if (diff < 60000) {
      const seconds = Math.floor(diff / 1000);
      setDisplayText(`Saved ${seconds}s ago`);
    } else if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      setDisplayText(`Saved ${minutes}m ago`);
    } else {
      const hours = Math.floor(diff / 3600000);
      setDisplayText(`Saved ${hours}h ago`);
    }
  }, [isSaving, lastSaved, error]);

  // Update display text every few seconds if shown
  useEffect(() => {
    if (!show || !lastSaved || isSaving || error) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - lastSaved.getTime();

      if (diff < 1000) {
        setDisplayText('Saved just now');
      } else if (diff < 60000) {
        const seconds = Math.floor(diff / 1000);
        setDisplayText(`Saved ${seconds}s ago`);
      } else if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        setDisplayText(`Saved ${minutes}m ago`);
      } else {
        const hours = Math.floor(diff / 3600000);
        setDisplayText(`Saved ${hours}h ago`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [show, lastSaved, isSaving, error]);

  // Hide if nothing to show
  if (!displayText && !show) {
    return null;
  }

  return (
    <div
      className={`flex items-center gap-1.5 text-xs font-medium transition-opacity duration-300 ${
        displayText
          ? 'opacity-100'
          : 'opacity-0 pointer-events-none'
      }`}
    >
      {isSaving ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
      ) : error ? (
        <AlertCircle className="h-3.5 w-3.5 text-red-500" />
      ) : (
        <Check className="h-3.5 w-3.5 text-secondary" />
      )}
      <span
        className={
          error ? 'text-red-600' : isSaving ? 'text-primary' : 'text-text-muted'
        }
      >
        {displayText}
      </span>
    </div>
  );
}

export default SaveStatus;
