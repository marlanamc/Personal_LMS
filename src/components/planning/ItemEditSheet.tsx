'use client';

import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { triggerHaptic } from '@/lib/haptic';
import {
  DAY_LABELS,
  SKINCARE_CATEGORY_ORDER,
  CATEGORY_LABELS,
  SKINCARE_CATEGORY_COLORS,
  getItemsForDaySlot,
  type DayOfWeek,
  type SkincareSlotKey,
  type SkincarePlannerStore,
  type SkincareItem,
  type SkincareCategoryId,
} from '@/lib/skincare-planner';

type ItemEditSheetProps = {
  isOpen: boolean;
  day: DayOfWeek;
  slot: SkincareSlotKey;
  store: SkincarePlannerStore;
  onUpdate: (updater: (store: SkincarePlannerStore) => SkincarePlannerStore) => void;
  onClose: () => void;
};

export function ItemEditSheet({ isOpen, day, slot, store, onUpdate, onClose }: ItemEditSheetProps) {
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());

  // Initialize selected items for this day/slot
  useEffect(() => {
    if (isOpen) {
      const currentItems = getItemsForDaySlot(store.items, day, slot);
      setSelectedItemIds(new Set(currentItems.map((item) => item.id)));
    }
  }, [isOpen, day, slot, store.items]);

  const handleToggleItem = (item: SkincareItem) => {
    triggerHaptic('light');
    const newSelected = new Set(selectedItemIds);
    if (newSelected.has(item.id)) {
      newSelected.delete(item.id);
    } else {
      newSelected.add(item.id);
    }
    setSelectedItemIds(newSelected);
  };

  const handleSave = () => {
    triggerHaptic('medium');
    onUpdate((currentStore) => {
      const updatedItems = currentStore.items.map((item) => {
        const isSelected = selectedItemIds.has(item.id);
        const currentSchedule = item.weeklySchedule[day];

        if (isSelected) {
          // Add to schedule
          return {
            ...item,
            weeklySchedule: {
              ...item.weeklySchedule,
              [day]: {
                am: slot === 'am' ? true : currentSchedule?.am ?? false,
                pm: slot === 'pm' ? true : currentSchedule?.pm ?? false,
              },
            },
          };
        } else {
          // Remove from schedule
          if (!currentSchedule) return item;

          const newAM = slot === 'am' ? false : currentSchedule.am;
          const newPM = slot === 'pm' ? false : currentSchedule.pm;

          if (!newAM && !newPM) {
            // Remove day entirely if both AM and PM are false
            const { [day]: _, ...restSchedule } = item.weeklySchedule;
            return {
              ...item,
              weeklySchedule: restSchedule,
            };
          }

          return {
            ...item,
            weeklySchedule: {
              ...item.weeklySchedule,
              [day]: { am: newAM, pm: newPM },
            },
          };
        }
      });

      return {
        ...currentStore,
        items: updatedItems,
      };
    });

    onClose();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown as any);
      return () => window.removeEventListener('keydown', handleKeyDown as any);
    }
  }, [isOpen, selectedItemIds]);

  if (!isOpen) return null;

  const slotLabel = slot === 'am' ? '☀️ AM' : '🌙 PM';
  const dayLabel = DAY_LABELS[day];

  // Group items by category
  const itemsByCategory: Record<SkincareCategoryId, SkincareItem[]> = {
    cleanser: [],
    toner: [],
    serums: [],
    actives: [],
    extras: [],
    moisturizer: [],
    sunscreen: [],
  };

  for (const item of store.items) {
    itemsByCategory[item.category].push(item);
  }

  const selectedItems = store.items.filter((item) => selectedItemIds.has(item.id));

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Sheet */}
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {dayLabel} {slotLabel} Routine
            </h2>
            <p className="text-sm text-gray-500 mt-1">Select products for this routine</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Selected items preview */}
          {selectedItems.length > 0 && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Selected Products ({selectedItems.length})</h3>
              <div className="space-y-1">
                {selectedItems
                  .sort((a, b) => {
                    const aIdx = SKINCARE_CATEGORY_ORDER.indexOf(a.category);
                    const bIdx = SKINCARE_CATEGORY_ORDER.indexOf(b.category);
                    return aIdx - bIdx;
                  })
                  .map((item) => {
                    const colors = SKINCARE_CATEGORY_COLORS[item.category];
                    return (
                      <div key={item.id} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                        <span className={`text-sm ${colors.text}`}>{item.name}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Category sections */}
          {SKINCARE_CATEGORY_ORDER.map((categoryId) => {
            const items = itemsByCategory[categoryId];
            if (items.length === 0) return null;

            const colors = SKINCARE_CATEGORY_COLORS[categoryId];

            return (
              <div key={categoryId} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${colors.dot}`} />
                  <h3 className="font-semibold text-gray-900">{CATEGORY_LABELS[categoryId]}</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {items.map((item) => {
                    const isSelected = selectedItemIds.has(item.id);

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleToggleItem(item)}
                        className={`
                          flex items-center gap-2 p-3 rounded-lg border-2 transition-all text-left
                          ${
                            isSelected
                              ? `${colors.bg} ${colors.border} ${colors.text}`
                              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                          }
                        `}
                      >
                        <div
                          className={`
                            w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                            ${isSelected ? colors.border : 'border-gray-300'}
                          `}
                        >
                          {isSelected && <Check className={`w-3 h-3 ${colors.text}`} />}
                        </div>
                        <span className="text-sm font-medium">{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Empty state */}
          {store.items.length === 0 && (
            <div className="text-center py-12">
              <span className="text-5xl block mb-4">🧴</span>
              <p className="text-gray-600 mb-4">No skincare items yet</p>
              <p className="text-sm text-gray-500">Close this and click "Manage Items" to add products</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <p className="text-sm text-gray-500">
            <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Esc</kbd> to cancel{' '}
            <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">⌘ Enter</kbd> to save
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
