'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export interface PhraseItem {
  id: string;
  text: string;
}

const SIZE_CLASS = [
  'text-lg sm:text-2xl font-semibold tracking-[-0.03em]',
  'text-base sm:text-xl font-semibold tracking-[-0.02em]',
  'text-sm sm:text-lg font-medium tracking-[-0.01em]',
] as const;

const TONE_CLASS = [
  'text-primary/85',
  'text-secondary/85',
  'text-accent/80',
  'text-[rgba(94,146,255,0.88)]',
  'text-[rgba(79,176,152,0.86)]',
] as const;

function hashToBucket(id: string, mod: number): number {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) {
    h = (h * 33 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % mod;
}

function rotationDeg(id: string): number {
  return hashToBucket(id, 7) - 3;
}

const DESKTOP_SLOTS = [
  { left: '14%', top: '20%' },
  { left: '56%', top: '16%' },
  { left: '32%', top: '38%' },
  { left: '73%', top: '36%' },
  { left: '17%', top: '58%' },
  { left: '51%', top: '58%' },
  { left: '77%', top: '60%' },
  { left: '36%', top: '74%' },
  { left: '61%', top: '78%' },
] as const;

const MOBILE_SLOTS = [
  { left: '12%', top: '16%' },
  { left: '56%', top: '18%' },
  { left: '18%', top: '38%' },
  { left: '58%', top: '40%' },
  { left: '12%', top: '62%' },
  { left: '56%', top: '64%' },
  { left: '18%', top: '82%' },
  { left: '56%', top: '84%' },
] as const;

interface DailyWinsPhraseCloudProps {
  items: PhraseItem[];
  emptyMessage?: string;
}

export function DailyWinsPhraseCloud({ items, emptyMessage }: DailyWinsPhraseCloudProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const layout = useMemo(
    () => {
      const ranked = [...items].sort((a, b) => a.text.length - b.text.length);

      return ranked.map((item, index) => ({
        item,
        size: SIZE_CLASS[hashToBucket(item.id, SIZE_CLASS.length)] ?? SIZE_CLASS[1],
        tone: TONE_CLASS[hashToBucket(item.id, TONE_CLASS.length)] ?? TONE_CLASS[0],
        rotate: rotationDeg(item.id),
        desktopSlot: DESKTOP_SLOTS[index % DESKTOP_SLOTS.length] ?? DESKTOP_SLOTS[0],
        mobileSlot: MOBILE_SLOTS[index % MOBILE_SLOTS.length] ?? MOBILE_SLOTS[0],
        delay: index * 0.06,
      }));
    },
    [items],
  );

  if (items.length === 0) {
    return (
      <div className="flex min-h-[160px] items-center justify-center rounded-2xl bg-bg-surface/30 px-4 py-10 text-center text-sm text-text-muted backdrop-blur-sm">
        {emptyMessage ?? 'Nothing in the cloud yet—add a win when you can.'}
      </div>
    );
  }

  if (prefersReducedMotion) {
    return (
      <div
        className="relative overflow-hidden rounded-[2rem] border border-white/30 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.55),_rgba(255,244,236,0.92)_45%,_rgba(255,238,228,0.96)_100%)] px-4 py-6 shadow-[0_20px_60px_rgba(219,182,150,0.15),inset_0_1px_0_rgba(255,255,255,0.5)] sm:px-8 sm:py-8"
        aria-hidden
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[8%] top-[12%] h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
          <div className="absolute right-[12%] top-[18%] h-28 w-28 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute bottom-[10%] left-[22%] h-32 w-32 rounded-full bg-secondary/10 blur-3xl" />
        </div>
        <ul className="relative grid min-h-[240px] grid-cols-2 gap-x-5 gap-y-6 py-4 sm:min-h-[320px] sm:grid-cols-3 sm:gap-x-6 sm:gap-y-8">
          {layout.map(({ item, size, tone, rotate }) => (
            <li
              key={item.id}
              className={`flex min-h-[72px] items-center justify-center rounded-[1.75rem] border border-white/35 bg-white/30 px-4 py-3 text-center leading-tight shadow-[0_10px_30px_rgba(255,255,255,0.28)] backdrop-blur-sm ${size} ${tone}`}
              style={{ transform: `rotate(${rotate}deg)` }}
            >
              {item.text}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden rounded-[2rem] border border-white/30 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.55),_rgba(255,244,236,0.92)_45%,_rgba(255,238,228,0.96)_100%)] shadow-[0_20px_60px_rgba(219,182,150,0.15),inset_0_1px_0_rgba(255,255,255,0.5)]"
      aria-hidden
    >
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="absolute left-[8%] top-[12%] h-24 w-24 rounded-full bg-primary/10 blur-2xl sm:h-32 sm:w-32"
          animate={{ x: [0, 10, -6, 0], y: [0, -8, 6, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-[12%] top-[16%] h-28 w-28 rounded-full bg-accent/10 blur-3xl sm:h-36 sm:w-36"
          animate={{ x: [0, -12, 8, 0], y: [0, 10, -8, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[10%] left-[24%] h-32 w-32 rounded-full bg-secondary/10 blur-3xl sm:h-40 sm:w-40"
          animate={{ x: [0, 14, -8, 0], y: [0, -10, 10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <div className="relative min-h-[280px] px-4 py-6 sm:hidden">
        {layout.map(({ item, size, tone, rotate, mobileSlot, delay }) => (
          <motion.li
            key={item.id}
            className={`absolute flex max-w-[38vw] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[1.5rem] border border-white/35 bg-white/35 px-3 py-2 text-center leading-tight shadow-[0_12px_30px_rgba(255,255,255,0.32)] backdrop-blur-sm ${size} ${tone}`}
            style={{ left: mobileSlot.left, top: mobileSlot.top, rotate: `${rotate}deg` }}
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay, duration: 0.45, ease: 'easeOut' }}
            whileHover={{ scale: 1.06, y: -3 }}
          >
            {item.text}
          </motion.li>
        ))}
      </div>

      <div className="relative hidden min-h-[360px] px-8 py-8 sm:block">
        {layout.map(({ item, size, tone, rotate, desktopSlot, delay }) => (
          <motion.div
            key={item.id}
            className={`absolute flex max-w-[22rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[1.75rem] border border-white/40 bg-white/35 px-5 py-3 text-center leading-tight shadow-[0_18px_40px_rgba(255,255,255,0.34)] backdrop-blur-sm ${size} ${tone}`}
            style={{ left: desktopSlot.left, top: desktopSlot.top, rotate: `${rotate}deg` }}
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay, duration: 0.5, ease: 'easeOut' }}
            whileHover={{ scale: 1.08, y: -4 }}
          >
            {item.text}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
