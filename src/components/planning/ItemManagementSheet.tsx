'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { triggerHaptic } from '@/lib/haptic';
import {
  DAY_SHORT_LABELS,
  DAY_OF_WEEK_KEYS,
  SKINCARE_CATEGORY_ORDER,
  CATEGORY_LABELS,
  SKINCARE_CATEGORY_COLORS,
  createNewItem,
  createUniformSchedule,
  createWeekdaySchedule,
  createWeekendSchedule,
  createCustomSchedule,
  syncItemsToCatalog,
  type SkincarePlannerStore,
  type SkincareItem,
  type SkincareCategoryId,
  type DayOfWeek,
} from '@/lib/skincare-planner';

type ItemManagementSheetProps = {
  isOpen: boolean;
  store: SkincarePlannerStore;
  onUpdate: (updater: (store: SkincarePlannerStore) => SkincarePlannerStore) => void;
  onClose: () => void;
};

function FrequencyGrid({ item, onChange }: { item: SkincareItem; onChange: (item: SkincareItem) => void }) {
  const toggleDay = (day: DayOfWeek, slot: 'am' | 'pm') => {
    triggerHaptic('light');
    const currentSchedule = item.weeklySchedule[day];
    const currentValue = currentSchedule?.[slot] ?? false;

    if (!currentValue) {
      // Enable
      onChange({
        ...item,
        weeklySchedule: {
          ...item.weeklySchedule,
          [day]: {
            am: slot === 'am' ? true : currentSchedule?.am ?? false,
            pm: slot === 'pm' ? true : currentSchedule?.pm ?? false,
          },
        },
      });
    } else {
      // Disable
      const newAM = slot === 'am' ? false : currentSchedule?.am ?? false;
      const newPM = slot === 'pm' ? false : currentSchedule?.pm ?? false;

      if (!newAM && !newPM) {
        // Remove day entirely
        const { [day]: _, ...restSchedule } = item.weeklySchedule;
        onChange({
          ...item,
          weeklySchedule: restSchedule,
        });
      } else {
        onChange({
          ...item,
          weeklySchedule: {
            ...item.weeklySchedule,
            [day]: { am: newAM, pm: newPM },
          },
        });
      }
    }
  };

  const applyPreset = (preset: 'every-day' | 'weekdays' | 'weekend' | 'mon-wed-fri') => {
    let newSchedule;
    switch (preset) {
      case 'every-day':
        newSchedule = createUniformSchedule(true, true);
        break;
      case 'weekdays':
        newSchedule = createWeekdaySchedule(true, true);
        break;
      case 'weekend':
        newSchedule = createWeekendSchedule(true, true);
        break;
      case 'mon-wed-fri':
        newSchedule = createCustomSchedule([1, 3, 5], true, true);
        break;
    }
    onChange({ ...item, weeklySchedule: newSchedule });
  };

  return (
    <div className="space-y-3">
      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => applyPreset('every-day')}
          className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Every day
        </button>
        <button
          onClick={() => applyPreset('weekdays')}
          className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Weekdays
        </button>
        <button
          onClick={() => applyPreset('weekend')}
          className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Weekends
        </button>
        <button
          onClick={() => applyPreset('mon-wed-fri')}
          className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Mon/Wed/Fri
        </button>
      </div>

      {/* Grid */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left font-medium text-gray-600"></th>
              {DAY_OF_WEEK_KEYS.map((day) => (
                <th key={day} className="p-2 text-center font-medium text-gray-600">
                  {DAY_SHORT_LABELS[day]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-200">
              <td className="p-2 font-medium text-gray-600">☀️ AM</td>
              {DAY_OF_WEEK_KEYS.map((day) => {
                const isChecked = item.weeklySchedule[day]?.am ?? false;
                return (
                  <td key={day} className="p-2 text-center">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleDay(day, 'am')}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </td>
                );
              })}
            </tr>
            <tr className="border-t border-gray-200">
              <td className="p-2 font-medium text-gray-600">🌙 PM</td>
              {DAY_OF_WEEK_KEYS.map((day) => {
                const isChecked = item.weeklySchedule[day]?.pm ?? false;
                return (
                  <td key={day} className="p-2 text-center">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleDay(day, 'pm')}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ItemCard({
  item,
  onChange,
  onDelete,
}: {
  item: SkincareItem;
  onChange: (item: SkincareItem) => void;
  onDelete: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const colors = SKINCARE_CATEGORY_COLORS[item.category];

  return (
    <div className={`border-2 rounded-lg overflow-hidden ${colors.border} ${isExpanded ? colors.bg : 'bg-white'}`}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${colors.dot}`} />
          <span className={`font-medium ${colors.text}`}>{item.name}</span>
        </div>

        {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="p-4 pt-0 space-y-4">
          {/* Schedule */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Weekly Schedule</label>
            <FrequencyGrid item={item} onChange={onChange} />
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Notes (optional)</label>
            <textarea
              value={item.notes || ''}
              onChange={(e) => onChange({ ...item, notes: e.target.value || undefined })}
              placeholder="e.g., Wait 20 min before next step, Use only 3x/week"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              rows={2}
            />
          </div>

          {/* Delete button */}
          <button
            onClick={onDelete}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full justify-center border border-red-200"
          >
            <Trash2 className="w-4 h-4" />
            Delete Item
          </button>
        </div>
      )}
    </div>
  );
}

export function ItemManagementSheet({ isOpen, store, onUpdate, onClose }: ItemManagementSheetProps) {
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<SkincareCategoryId>('cleanser');

  const handleAddItem = () => {
    const trimmed = newItemName.trim();
    if (!trimmed) return;

    triggerHaptic('medium');
    const newItem = createNewItem(trimmed, newItemCategory, createUniformSchedule(true, false));

    onUpdate((currentStore) => ({
      ...currentStore,
      items: [...currentStore.items, newItem],
      itemCatalog: syncItemsToCatalog([newItem], currentStore.itemCatalog),
    }));

    setNewItemName('');
    setNewItemCategory('cleanser');
  };

  const handleUpdateItem = (updatedItem: SkincareItem) => {
    onUpdate((currentStore) => ({
      ...currentStore,
      items: currentStore.items.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
    }));
  };

  const handleDeleteItem = (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    triggerHaptic('heavy');
    onUpdate((currentStore) => ({
      ...currentStore,
      items: currentStore.items.filter((item) => item.id !== itemId),
    }));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  if (!isOpen) return null;

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

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Sheet */}
      <div className="fixed inset-y-0 right-0 w-full max-w-3xl bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Manage Skincare Items</h2>
            <p className="text-sm text-gray-500 mt-1">Add, edit, or remove skincare products</p>
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
          {/* Add new item */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900">Add New Item</h3>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddItem();
                }}
                placeholder="Product name..."
                className="flex-1 p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />

              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value as SkincareCategoryId)}
                className="p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {SKINCARE_CATEGORY_ORDER.map((categoryId) => (
                  <option key={categoryId} value={categoryId}>
                    {CATEGORY_LABELS[categoryId]}
                  </option>
                ))}
              </select>

              <button
                onClick={handleAddItem}
                disabled={!newItemName.trim()}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          {/* Item list by category */}
          {SKINCARE_CATEGORY_ORDER.map((categoryId) => {
            const items = itemsByCategory[categoryId];
            if (items.length === 0) return null;

            const colors = SKINCARE_CATEGORY_COLORS[categoryId];

            return (
              <div key={categoryId} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${colors.dot}`} />
                  <h3 className="font-semibold text-gray-900">
                    {CATEGORY_LABELS[categoryId]} ({items.length})
                  </h3>
                </div>

                <div className="space-y-2">
                  {items.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onChange={handleUpdateItem}
                      onDelete={() => handleDeleteItem(item.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Empty state */}
          {store.items.length === 0 && (
            <div className="text-center py-12">
              <span className="text-5xl block mb-4">🧴</span>
              <p className="text-gray-600 mb-4">No skincare items yet</p>
              <p className="text-sm text-gray-500">Add your first item using the form above</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
}
