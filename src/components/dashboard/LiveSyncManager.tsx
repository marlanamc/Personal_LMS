'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type LiveSyncControlVariant = 'toolbar' | 'menu';

export interface LiveSyncState {
  isSyncing: boolean;
  lastSyncTime: number;
  sync: (manual?: boolean) => void;
}

export function useLiveSync(): LiveSyncState {
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<number>(0);

  useEffect(() => {
    setLastSyncTime(Date.now());
  }, []);

  const sync = useCallback(
    async (_manual = false) => {
      if (isSyncing) return;

      setIsSyncing(true);

      router.refresh();

      setTimeout(() => {
        setIsSyncing(false);
        setLastSyncTime(Date.now());
      }, 2000);
    },
    [isSyncing, router],
  );

  useEffect(() => {
    const pollInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        sync();
      }
    }, 120000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const timeSinceLastSync = Date.now() - lastSyncTime;
        if (timeSinceLastSync > 45000) {
          sync();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(pollInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [sync, lastSyncTime]);

  return { isSyncing, lastSyncTime, sync };
}

interface LiveSyncControlProps extends LiveSyncState {
  variant?: LiveSyncControlVariant;
  className?: string;
}

export function LiveSyncControl({
  isSyncing,
  lastSyncTime,
  sync,
  variant = 'toolbar',
  className = '',
}: LiveSyncControlProps) {
  const isMenu = variant === 'menu';

  return (
    <div className={`flex items-center shrink-0 ${className}`}>
      <AnimatePresence mode="wait">
        {isSyncing ? (
          <motion.div
            key="syncing"
            initial={{ opacity: 0, scale: 0.8, x: 5 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -5 }}
            className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-accent-sakura/10 border border-accent-sakura/20"
          >
            <RefreshCw className="w-3 h-3 text-accent-sakura animate-spin shrink-0" />
            {!isMenu && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent-sakura whitespace-nowrap hidden sm:inline-block">
                Syncing
              </span>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="group relative flex items-center justify-center w-8 h-8 rounded-full hover:bg-bg-elevated transition-colors cursor-pointer"
            onClick={() => sync(true)}
            title="Click to manually refresh data"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                sync(true);
              }
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-accent-mint/40 group-hover:bg-accent-mint transition-colors" />

            <div
              className={`absolute p-2 rounded-lg bg-bg-elevated border border-border-subtle shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-[60] min-w-[150px] ${
                isMenu
                  ? 'top-full right-0 mt-1'
                  : 'top-full right-0 mt-2'
              }`}
            >
              <p className="text-[10px] font-semibold text-text uppercase tracking-wider mb-1 flex justify-between items-center gap-2">
                <span>Live Sync Active</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent-mint animate-pulse shrink-0" />
              </p>
              <p className="text-[9px] text-text-muted mb-1.5">
                Your dashboard stays updated across all devices automatically.
              </p>
              <p className="text-[8px] font-medium text-text-muted/60 border-t border-border-subtle pt-1">
                Last synced:{' '}
                {lastSyncTime === 0
                  ? 'Just now'
                  : new Date(lastSyncTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function LiveSyncManager() {
  const state = useLiveSync();
  return <LiveSyncControl {...state} variant="toolbar" />;
}
