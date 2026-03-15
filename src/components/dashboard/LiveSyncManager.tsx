'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function LiveSyncManager() {
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<number>(0);

  // Initialize sync time after mount
  useEffect(() => {
    setLastSyncTime(Date.now());
  }, []);

  const sync = useCallback(async (_manual = false) => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    
    // router.refresh() triggers a server-side data fetch for all server components 
    // without resetting client-side state. Perfect for "background" updates.
    router.refresh();
    
    // We add a small delay to make the transition feel deliberate and smooth
    // and to show the user that something actually happened.
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime(Date.now());
    }, 2000);
  }, [isSyncing, router]);

  useEffect(() => {
    // 1. Periodic sync every 2 minutes (120000ms)
    // We don't want to over-fetch, but 2 mins is frequent enough for dashboard updates.
    const pollInterval = setInterval(() => {
      // Only auto-sync if the tab is visible to save resources
      if (document.visibilityState === 'visible') {
        sync();
      }
    }, 120000);

    // 2. Sync on visibility change (re-focusing the tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Only sync if it's been more than 45 seconds since the last sync
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

  return (
    <div className="flex items-center">
      <AnimatePresence mode="wait">
        {isSyncing ? (
          <motion.div
            key="syncing"
            initial={{ opacity: 0, scale: 0.8, x: 5 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -5 }}
            className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-accent-sakura/10 border border-accent-sakura/20"
          >
            <RefreshCw className="w-3 h-3 text-accent-sakura animate-spin" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent-sakura whitespace-nowrap hidden sm:inline-block">
              Syncing
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="group relative flex items-center justify-center w-8 h-8 rounded-full hover:bg-bg-elevated transition-colors cursor-pointer"
            onClick={() => sync(true)}
            title="Click to manually refresh data"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-accent-mint/40 group-hover:bg-accent-mint transition-colors" />
            
            {/* Tooltip on hover */}
            <div className="absolute top-full right-0 mt-2 p-2 rounded-lg bg-bg-elevated border border-border-subtle shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-[60] min-w-[150px]">
              <p className="text-[10px] font-semibold text-text uppercase tracking-wider mb-1 flex justify-between items-center">
                <span>Live Sync Active</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent-mint animate-pulse" />
              </p>
              <p className="text-[9px] text-text-muted mb-1.5">Your dashboard stays updated across all devices automatically.</p>
              <p className="text-[8px] font-medium text-text-muted/60 border-t border-border-subtle pt-1">
                Last synced: {lastSyncTime === 0 ? 'Just now' : new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
