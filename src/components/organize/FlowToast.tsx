'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Target } from 'lucide-react';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info';
}

export function FlowToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast = (event: Event) => {
      const customEvent = event as CustomEvent<{ message: string; type: 'success' | 'info' }>;
      const { message, type } = customEvent.detail;

      const id = `${Date.now()}-${Math.random()}`;
      const newToast: ToastMessage = { id, message, type };

      setToasts((prev) => [...prev, newToast]);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    };

    window.addEventListener('flow-toast', handleToast);
    return () => window.removeEventListener('flow-toast', handleToast);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`pointer-events-auto rounded-xl px-4 py-3 shadow-xl backdrop-blur-md flex items-center gap-3 min-w-[280px] ${
              toast.type === 'success'
                ? 'bg-accent-mint/20 border border-accent-mint/30 text-accent-mint'
                : 'bg-primary/20 border border-primary/30 text-primary'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 shrink-0" />
            ) : (
              <Target className="h-5 w-5 shrink-0" />
            )}
            <p className="text-sm font-medium text-text">{toast.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
