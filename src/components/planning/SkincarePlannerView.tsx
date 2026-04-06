'use client';

import { useState } from 'react';
import { LayoutGrid, Settings, ShoppingBag } from 'lucide-react';
import { useSkincarePlanner } from '@/components/dashboard/useSkincarePlanner';
import SaveStatus from '@/components/ui/SaveStatus';
import { WeekViewTable } from './WeekViewTable';
import { WeekViewCards } from './WeekViewCards';
import { ItemEditSheet } from './ItemEditSheet';
import { ItemManagementSheet } from './ItemManagementSheet';
import { SkincareShopPanel } from './SkincareShopPanel';
import type { DayOfWeek, SkincareSlotKey } from '@/lib/skincare-planner';

export interface SkincarePlannerViewProps {
  storageScope: string;
}

type PlannerTab = 'routine' | 'shop';

export function SkincarePlannerView({ storageScope }: SkincarePlannerViewProps) {
  const { plannerStore, setPlannerStore, isLoaded, isSaving, saveError, lastSyncedAt } = useSkincarePlanner(storageScope);

  const [tab, setTab] = useState<PlannerTab>('routine');
  const [editingCell, setEditingCell] = useState<{ day: DayOfWeek; slot: SkincareSlotKey } | null>(null);
  const [isManagementOpen, setIsManagementOpen] = useState(false);

  const handleCellClick = (day: DayOfWeek, slot: SkincareSlotKey) => {
    setEditingCell({ day, slot });
  };

  const handleCloseEditSheet = () => {
    setEditingCell(null);
  };

  const handleOpenManagement = () => {
    setIsManagementOpen(true);
  };

  const handleCloseManagement = () => {
    setIsManagementOpen(false);
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500">Loading your skincare routine...</p>
        </div>
      </div>
    );
  }

  const hasItems = plannerStore.items.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-gray-900">Skincare Planner</h2>

        <div className="flex flex-wrap items-center gap-3">
          <SaveStatus isSaving={isSaving} error={saveError} lastSaved={lastSyncedAt} />

          <button
            onClick={handleOpenManagement}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Manage Items
          </button>
        </div>
      </div>

      <div className="flex rounded-xl border border-border-subtle/50 bg-bg-elevated/35 p-1 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => setTab('routine')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${
            tab === 'routine' ? 'bg-bg-surface/90 text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          <LayoutGrid className="h-4 w-4" />
          Weekly routine
        </button>
        <button
          type="button"
          onClick={() => setTab('shop')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${
            tab === 'shop' ? 'bg-bg-surface/90 text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          Shop list
        </button>
      </div>

      {tab === 'routine' && (
        <>
          {/* Empty state */}
          {!hasItems && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                <span className="text-3xl">🧴</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No skincare items yet</h3>
              <p className="text-gray-600 mb-4 max-w-md mx-auto">
                Get started by adding your skincare products and setting up your weekly routine.
              </p>
              <button
                onClick={handleOpenManagement}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Add Your First Item
              </button>
            </div>
          )}

          {/* Week view - Desktop */}
          {hasItems && (
            <div className="hidden md:block">
              <WeekViewTable items={plannerStore.items} onCellClick={handleCellClick} />
            </div>
          )}

          {/* Week view - Mobile */}
          {hasItems && (
            <div className="block md:hidden">
              <WeekViewCards items={plannerStore.items} onCellClick={handleCellClick} />
            </div>
          )}
        </>
      )}

      {tab === 'shop' && <SkincareShopPanel store={plannerStore} onUpdate={setPlannerStore} />}

      {/* Quick edit sheet */}
      {editingCell && (
        <ItemEditSheet
          isOpen={true}
          day={editingCell.day}
          slot={editingCell.slot}
          store={plannerStore}
          onUpdate={setPlannerStore}
          onClose={handleCloseEditSheet}
        />
      )}

      {/* Item management sheet */}
      {isManagementOpen && (
        <ItemManagementSheet
          isOpen={true}
          store={plannerStore}
          onUpdate={setPlannerStore}
          onClose={handleCloseManagement}
        />
      )}
    </div>
  );
}
