'use client';

import { SKINCARE_CATEGORY_COLORS, SKINCARE_CATEGORY_ORDER, type SkincareItem } from '@/lib/skincare-planner';

type ColoredDotsProps = {
  items: SkincareItem[];
  maxVisible?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export function ColoredDots({ items, maxVisible = 8, size = 'md', className = '' }: ColoredDotsProps) {
  const sortedItems = [...items].sort((a, b) => {
    const aIndex = SKINCARE_CATEGORY_ORDER.indexOf(a.category);
    const bIndex = SKINCARE_CATEGORY_ORDER.indexOf(b.category);
    return aIndex - bIndex;
  });

  const visibleItems = sortedItems.slice(0, maxVisible);
  const hasMore = sortedItems.length > maxVisible;

  const sizeClasses = {
    sm: { dot: 'w-2 h-2', text: 'text-xs' },
    md: { dot: 'w-2.5 h-2.5', text: 'text-sm' },
    lg: { dot: 'w-3 h-3', text: 'text-base' },
  };

  const sizes = sizeClasses[size];

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-col items-start gap-0.5 text-left ${className}`}>
      {visibleItems.map((item, idx) => {
        const colors = SKINCARE_CATEGORY_COLORS[item.category];
        return (
          <div
            key={`${item.id}-${idx}`}
            className="flex w-full items-start gap-1.5 text-left"
            title={`${item.name} (${item.category})`}
          >
            <div className={`${sizes.dot} rounded-full ${colors.dot} flex-shrink-0`} />
            <span className={`${sizes.text} ${colors.text} block text-left leading-tight`}>
              {item.name}
            </span>
          </div>
        );
      })}
      {hasMore && (
        <span className="text-xs text-gray-500" title={`+${sortedItems.length - maxVisible} more items`}>
          +{sortedItems.length - maxVisible}
        </span>
      )}
    </div>
  );
}
