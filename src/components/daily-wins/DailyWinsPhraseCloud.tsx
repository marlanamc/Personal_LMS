'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useTheme } from '@/context/ThemeContext';

export interface PhraseItem {
  id: string;
  text: string;
  count?: number;
}

// Size buckets — generous on desktop, tighter on mobile so everything fits.
const SIZE_CLASS = [
  'text-xl sm:text-3xl font-semibold tracking-[-0.03em] leading-[1.05]',
  'text-lg sm:text-2xl font-semibold tracking-[-0.025em] leading-[1.1]',
  'text-base sm:text-xl font-medium tracking-[-0.015em] leading-[1.15]',
  'text-sm sm:text-lg font-medium tracking-[-0.01em] leading-[1.2]',
  'text-xs sm:text-base font-medium tracking-[-0.005em] leading-[1.25]',
] as const;

const FONT_CLASS = ['font-display italic', 'font-sans', 'font-sans', 'font-sans'] as const;

type ToneKey = 'sakura' | 'mint' | 'amethyst' | 'periwinkle' | 'sage';

const TONES: { key: ToneKey; text: string; rgb: string }[] = [
  { key: 'sakura',     text: 'text-primary',            rgb: '212, 138, 166' },
  { key: 'mint',       text: 'text-secondary',          rgb: '120, 191, 165' },
  { key: 'amethyst',   text: 'text-accent',             rgb: '160, 137, 199' },
  { key: 'periwinkle', text: 'text-[rgb(140,170,240)]', rgb: '140, 170, 240' },
  { key: 'sage',       text: 'text-[rgb(130,188,168)]', rgb: '130, 188, 168' },
];

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

interface DailyWinsPhraseCloudProps {
  items: PhraseItem[];
  emptyMessage?: string;
}

export function DailyWinsPhraseCloud({ items, emptyMessage }: DailyWinsPhraseCloudProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const layout = useMemo(() => {
    // items arrive newest-first (API returns desc by createdAt).
    const newestId = items[0]?.id;

    // Rank by length so the shortest phrases can claim hero sizes — that's
    // what makes the cloud look curated rather than uniform.
    const byLength = [...items].sort((a, b) => a.text.length - b.text.length);
    const sizeByIndex = new Map<string, string>();
    const n = byLength.length;
    byLength.forEach((it, i) => {
      const pct = n <= 1 ? 0 : i / (n - 1);
      let sizeIdx: number;
      if (pct < 0.15) sizeIdx = 0;
      else if (pct < 0.4) sizeIdx = 1;
      else if (pct < 0.7) sizeIdx = 2;
      else if (pct < 0.9) sizeIdx = 3;
      else sizeIdx = 4;
      sizeByIndex.set(it.id, SIZE_CLASS[sizeIdx]);
    });

    // Every 4th-ish chip rotates 90° for vertical variety — only when the
    // phrase is short enough that a vertical column is legible.
    return items.map((item, index) => {
      const toneIdx = hashToBucket(item.id, TONES.length);
      const tone = TONES[toneIdx];
      const canBeVertical = item.text.length <= 18 && hashToBucket(item.id + 'v', 5) === 0;
      return {
        item,
        isNewest: item.id === newestId,
        size: sizeByIndex.get(item.id) ?? SIZE_CLASS[2],
        font: FONT_CLASS[hashToBucket(item.id, FONT_CLASS.length)],
        toneText: tone.text,
        toneRgb: tone.rgb,
        rotate: canBeVertical ? (hashToBucket(item.id, 2) === 0 ? -90 : 90) : rotationDeg(item.id),
        isVertical: canBeVertical,
        delay: Math.min(index * 0.04, 0.6),
      };
    });
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="flex min-h-[160px] items-center justify-center rounded-2xl bg-bg-surface/30 px-4 py-10 text-center text-sm text-text-muted backdrop-blur-sm">
        {emptyMessage ?? 'Nothing in the cloud yet—add a win when you can.'}
      </div>
    );
  }

  const containerClass = isDark
    ? 'relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(160,137,199,0.22),_rgba(24,39,58,0.95)_45%,_rgba(18,32,51,0.98)_100%)] shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]'
    : 'relative overflow-hidden rounded-[2rem] border border-white/30 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.55),_rgba(255,244,236,0.92)_45%,_rgba(255,238,228,0.96)_100%)] shadow-[0_20px_60px_rgba(219,182,150,0.15),inset_0_1px_0_rgba(255,255,255,0.5)]';

  const chipBase = isDark
    ? 'border border-white/10 bg-white/[0.04] backdrop-blur-md'
    : 'border border-white/40 bg-white/35 backdrop-blur-sm';

  const blobClasses = isDark
    ? { primary: 'bg-primary/25', accent: 'bg-accent/25', secondary: 'bg-secondary/25' }
    : { primary: 'bg-primary/10', accent: 'bg-accent/10', secondary: 'bg-secondary/10' };

  const chipShadow = (toneRgb: string) =>
    isDark
      ? `0 8px 22px rgba(${toneRgb}, 0.16), 0 0 18px rgba(${toneRgb}, 0.1), inset 0 1px 0 rgba(255,255,255,0.08)`
      : `0 8px 22px rgba(255,255,255,0.3), 0 3px 10px rgba(${toneRgb}, 0.1)`;

  const pulseLow = isDark
    ? '0 0 0 0 rgba(212,138,166,0), 0 8px 22px rgba(212,138,166,0.16), inset 0 1px 0 rgba(255,255,255,0.08)'
    : '0 0 0 0 rgba(209,138,122,0), 0 8px 22px rgba(255,255,255,0.3)';
  const pulseHigh = isDark
    ? '0 0 0 5px rgba(212,138,166,0.22), 0 10px 30px rgba(212,138,166,0.32), inset 0 1px 0 rgba(255,255,255,0.1)'
    : '0 0 0 5px rgba(209,138,122,0.22), 0 12px 28px rgba(209,138,122,0.25)';

  const renderChip = (
    entry: (typeof layout)[number],
    opts: { key: string; animated: boolean }
  ) => {
    const { item, size, font, toneText, toneRgb, rotate, isVertical, isNewest, delay } = entry;
    const baseShadow = chipShadow(toneRgb);

    const className = [
      'relative inline-flex items-center justify-center rounded-[1.25rem] px-3 py-2 text-center leading-tight break-words',
      'sm:px-4 sm:py-2.5 sm:rounded-[1.5rem]',
      chipBase,
      size,
      font,
      toneText,
    ].join(' ');

    const style: React.CSSProperties = {
      transform: `rotate(${rotate}deg)`,
      boxShadow: isNewest && opts.animated ? undefined : baseShadow,
      writingMode: isVertical ? ('vertical-rl' as const) : undefined,
    };

    if (!opts.animated) {
      return (
        <div key={opts.key} className={className} style={style}>
          {item.text}
          {(item.count ?? 1) > 1 ? (
            <span className="absolute -right-1.5 -top-1.5 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full border border-white/60 bg-bg-surface px-1.5 text-[10px] font-bold leading-none text-text shadow-sm">
              x{item.count}
            </span>
          ) : null}
        </div>
      );
    }

    const baseTransition = { delay, duration: 0.45, ease: 'easeOut' as const };
    const initial = { opacity: 0, scale: 0.9, y: 8 };
    const animate = isNewest
      ? { opacity: 1, scale: 1, y: 0, boxShadow: [pulseLow, pulseHigh, pulseLow] }
      : { opacity: 1, scale: 1, y: 0 };
    const transition = isNewest
      ? {
          opacity: baseTransition,
          scale: baseTransition,
          y: baseTransition,
          boxShadow: {
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut' as const,
            delay: delay + 0.4,
          },
        }
      : baseTransition;

    return (
      <motion.div
        key={opts.key}
        className={className}
        // Framer Motion needs rotate as a motion prop, but because the
        // chips live in a flex-wrap flow we use style transform to keep
        // layout measurement accurate.
        style={style}
        initial={initial}
        animate={animate}
        transition={transition}
        whileHover={{ scale: 1.06 }}
      >
        {item.text}
        {(item.count ?? 1) > 1 ? (
          <span className="absolute -right-1.5 -top-1.5 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full border border-white/60 bg-bg-surface px-1.5 text-[10px] font-bold leading-none text-text shadow-sm">
            x{item.count}
          </span>
        ) : null}
      </motion.div>
    );
  };

  return (
    <div className={containerClass} aria-hidden>
      <div className="pointer-events-none absolute inset-0">
        {prefersReducedMotion ? (
          <>
            <div className={`absolute left-[8%] top-[12%] h-24 w-24 rounded-full ${blobClasses.primary} blur-2xl sm:h-36 sm:w-36`} />
            <div className={`absolute right-[12%] top-[18%] h-28 w-28 rounded-full ${blobClasses.accent} blur-3xl sm:h-40 sm:w-40`} />
            <div className={`absolute bottom-[10%] left-[22%] h-32 w-32 rounded-full ${blobClasses.secondary} blur-3xl sm:h-44 sm:w-44`} />
          </>
        ) : (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className={`absolute left-[8%] top-[12%] h-24 w-24 rounded-full ${blobClasses.primary} blur-2xl sm:h-36 sm:w-36`}
              animate={{ x: [0, 10, -6, 0], y: [0, -8, 6, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className={`absolute right-[12%] top-[16%] h-28 w-28 rounded-full ${blobClasses.accent} blur-3xl sm:h-40 sm:w-40`}
              animate={{ x: [0, -12, 8, 0], y: [0, 10, -8, 0] }}
              transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className={`absolute bottom-[10%] left-[24%] h-32 w-32 rounded-full ${blobClasses.secondary} blur-3xl sm:h-44 sm:w-44`}
              animate={{ x: [0, 14, -8, 0], y: [0, -10, 10, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        )}
      </div>

      <div className="relative flex flex-wrap items-center justify-center gap-2 px-3 py-6 sm:gap-3 sm:px-8 sm:py-10">
        {layout.map((entry) =>
          renderChip(entry, { key: entry.item.id, animated: !prefersReducedMotion }),
        )}
      </div>
    </div>
  );
}
