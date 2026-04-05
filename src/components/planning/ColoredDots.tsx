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
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const dotSize = sizeClasses[size];

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap items-center gap-1 ${className}`}>
      {visibleItems.map((item, idx) => {
        const colors = SKINCARE_CATEGORY_COLORS[item.category];
        return (
          <div
            key={`${item.id}-${idx}`}
            className={`${dotSize} rounded-full ${colors.dot}`}
            title={`${item.name} (${item.category})`}
          />
        );
      })}
      {hasMore && (
        <span className="text-xs text-gray-500 ml-0.5" title={`+${sortedItems.length - maxVisible} more items`}>
          +{sortedItems.length - maxVisible}
        </span>
      )}
    </div>
  );
}
