'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { Check, Trash2 } from 'lucide-react';
import {
  CATEGORY_LABELS,
  SKINCARE_CATEGORY_ORDER,
  SKINCARE_SHOP_KIND_LABELS,
  SKINCARE_SHOP_LIST_KIND_ORDER,
  sortSkincareShopItems,
  type SkincareCategoryId,
  type SkincarePlannerStore,
  type SkincareShopItem,
  type SkincareShopListKind,
} from '@/lib/skincare-planner';

function newShopItemId(): string {
  return `skin-shop-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeCaptureText(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

function SwipeableRow({
  children,
  onDelete,
  disabled,
}: {
  children: React.ReactNode;
  onDelete: () => void;
  disabled?: boolean;
}) {
  const [offset, setOffset] = useState(0);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const lockRef = useRef<'none' | 'h' | 'v'>('none');

  const reset = () => {
    setOffset(0);
    startRef.current = null;
    lockRef.current = 'none';
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    if ((e.target as HTMLElement).closest('button, select, input, a, textarea')) return;
    startRef.current = { x: e.clientX, y: e.clientY };
    lockRef.current = 'none';
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!startRef.current || disabled) return;
    if ((e.target as HTMLElement).closest('button, select, input, a, textarea')) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    if (lockRef.current === 'none' && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
      lockRef.current = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
    }
    if (lockRef.current === 'h' && dx < 0) {
      setOffset(Math.max(dx, -80));
    }
  };

  const onPointerEnd = () => {
    if (offset < -48) onDelete();
    reset();
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div
        className="absolute inset-y-0 right-0 flex w-20 items-center justify-center bg-red-500/15 text-red-600"
        aria-hidden
      >
        <Trash2 className="h-5 w-5" />
      </div>
      <div
        style={{ transform: `translateX(${offset}px)` }}
        className="relative touch-pan-y bg-bg-surface/80 transition-transform duration-200 ease-out"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
      >
        {children}
      </div>
    </div>
  );
}

type SkincareShopPanelProps = {
  store: SkincarePlannerStore;
  onUpdate: (updater: (prev: SkincarePlannerStore) => SkincarePlannerStore) => void;
};

export function SkincareShopPanel({ store, onUpdate }: SkincareShopPanelProps) {
  const [captureKind, setCaptureKind] = useState<SkincareShopListKind>('to_buy');
  const [captureDraft, setCaptureDraft] = useState('');
  const [captureCategory, setCaptureCategory] = useState<SkincareCategoryId | ''>('');
  const [capturePrice, setCapturePrice] = useState('');

  const addFromCapture = useCallback(() => {
    const text = normalizeCaptureText(captureDraft);
    if (!text) return;
    const item: SkincareShopItem = {
      id: newShopItemId(),
      text,
      checked: false,
      kind: captureKind,
      category: captureCategory === '' ? undefined : captureCategory,
      price: capturePrice.trim() || undefined,
      addedAt: new Date().toISOString(),
    };
    onUpdate((prev) => ({
      ...prev,
      shopList: [item, ...prev.shopList],
    }));
    setCaptureDraft('');
    setCapturePrice('');
  }, [captureDraft, captureKind, captureCategory, capturePrice, onUpdate]);

  const toggleItem = useCallback(
    (id: string) => {
      onUpdate((prev) => ({
        ...prev,
        shopList: prev.shopList.map((g) => (g.id === id ? { ...g, checked: !g.checked } : g)),
      }));
    },
    [onUpdate],
  );

  const removeItem = useCallback(
    (id: string) => {
      onUpdate((prev) => ({
        ...prev,
        shopList: prev.shopList.filter((g) => g.id !== id),
      }));
    },
    [onUpdate],
  );

  const clearChecked = useCallback(() => {
    onUpdate((prev) => ({
      ...prev,
      shopList: prev.shopList.filter((g) => !g.checked),
    }));
  }, [onUpdate]);

  const hasAnyChecked = store.shopList.some((g) => g.checked);

  const itemsByKind = useMemo(() => {
    const map = new Map<SkincareShopListKind, SkincareShopItem[]>();
    for (const k of SKINCARE_SHOP_LIST_KIND_ORDER) {
      map.set(k, []);
    }
    for (const item of store.shopList) {
      const list = map.get(item.kind);
      if (list) list.push(item);
    }
    for (const k of SKINCARE_SHOP_LIST_KIND_ORDER) {
      map.set(k, sortSkincareShopItems(map.get(k) ?? []));
    }
    return map;
  }, [store.shopList]);

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="sticky top-0 z-sticky -mx-1 px-1 pt-1 pb-2 bg-gradient-to-b from-bg-base via-bg-base/95 to-transparent md:static md:bg-transparent md:p-0">
        <div className="space-y-2">
          {/* Tab selector */}
          <div
            className="flex w-fit rounded-xl border border-border-subtle/50 bg-bg-surface/80 p-1 backdrop-blur-sm"
            role="tablist"
            aria-label="List to add to"
          >
            {SKINCARE_SHOP_LIST_KIND_ORDER.map((k) => (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={captureKind === k}
                id={`skincare-shop-tab-${k}`}
                onClick={() => setCaptureKind(k)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  captureKind === k
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-muted hover:bg-bg-elevated/60 hover:text-text-secondary'
                }`}
              >
                {SKINCARE_SHOP_KIND_LABELS[k]}
              </button>
            ))}
          </div>

          {/* Input bar */}
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border-subtle/50 bg-bg-surface/80 p-2 backdrop-blur-sm">
            <label htmlFor="skincare-shop-capture" className="sr-only">
              Add shop list item
            </label>
            <input
              id="skincare-shop-capture"
              value={captureDraft}
              onChange={(e) => setCaptureDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addFromCapture();
                }
              }}
              placeholder={captureKind === 'to_buy' ? 'Add to buy…' : 'Add to wishlist…'}
              aria-labelledby={`skincare-shop-tab-${captureKind}`}
              className="h-10 min-w-0 flex-1 basis-[140px] rounded-lg border-none bg-transparent px-3 text-text-primary placeholder:text-text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 transition"
              autoComplete="off"
            />
            <input
              type="text"
              inputMode="decimal"
              value={capturePrice}
              onChange={(e) => setCapturePrice(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addFromCapture();
                }
              }}
              placeholder="$"
              aria-label="Price (optional)"
              className="h-10 w-16 shrink-0 rounded-lg border border-border-subtle/40 bg-bg-elevated/60 px-2 text-center text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 transition"
              autoComplete="off"
            />
            <select
              aria-label="Product type"
              value={captureCategory}
              onChange={(e) => setCaptureCategory(e.target.value as SkincareCategoryId | '')}
              className="h-10 shrink-0 rounded-lg border border-border-subtle/40 bg-bg-elevated/60 px-3 text-xs text-text-primary"
            >
              <option value="">Type…</option>
              {SKINCARE_CATEGORY_ORDER.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => addFromCapture()}
              className="h-10 shrink-0 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50"
              disabled={!captureDraft.trim()}
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-border-subtle/50 bg-bg-surface/80 p-4 backdrop-blur-sm md:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg text-text-primary">Your lists</h2>
          <button
            type="button"
            onClick={clearChecked}
            className="rounded-xl border border-border-subtle/60 px-3 py-2 text-xs font-semibold text-text-secondary hover:bg-bg-elevated/60 disabled:opacity-40"
            disabled={!hasAnyChecked}
          >
            Clear checked
          </button>
        </div>

        {store.shopList.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border-subtle/60 bg-bg-elevated/30 px-4 py-8 text-center text-sm text-text-muted">
            Nothing here yet. Choose To buy or Wishlist in the bar above, type a product, and add — same idea as
            groceries on the meal planner.
          </p>
        ) : (
          <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6">
            {SKINCARE_SHOP_LIST_KIND_ORDER.map((kind) => {
              const sectionItems = itemsByKind.get(kind) ?? [];
              if (sectionItems.length === 0) {
                return (
                  <div
                    key={kind}
                    className="min-w-0 rounded-xl border border-dashed border-border-subtle/50 bg-bg-elevated/20 px-4 py-5"
                  >
                    <h3 className="font-display text-base text-text-primary">{SKINCARE_SHOP_KIND_LABELS[kind]}</h3>
                    <p className="mt-3 text-xs text-text-muted/80">No items in this list yet.</p>
                  </div>
                );
              }

              return (
                <div key={kind} className="min-w-0">
                  <h3 className="font-display mb-3 text-base text-text-primary">{SKINCARE_SHOP_KIND_LABELS[kind]}</h3>
                  <ul className="space-y-2">
                    {sectionItems.map((item) => (
                      <li key={item.id}>
                        <SwipeableRow onDelete={() => removeItem(item.id)}>
                          <div
                            className={`flex items-center gap-2 rounded-xl border border-border-subtle/40 bg-bg-surface/70 px-3 py-2.5 transition ${
                              item.checked ? 'opacity-50' : ''
                            }`}
                          >
                            <button
                              type="button"
                              role="checkbox"
                              aria-checked={item.checked}
                              onClick={() => toggleItem(item.id)}
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 transition hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                                item.checked
                                  ? 'border-primary bg-primary text-white shadow-sm'
                                  : 'border-border-subtle/70 bg-transparent hover:border-primary/50'
                              }`}
                            >
                              {item.checked ? <Check className="h-5 w-5" aria-hidden /> : null}
                            </button>
                            <span
                              className={`min-w-0 flex-1 text-sm ${
                                item.checked
                                  ? 'text-text-muted line-through decoration-primary/60'
                                  : 'text-text-primary'
                              }`}
                            >
                              {item.text}
                            </span>
                            {item.price && (
                              <span className="shrink-0 rounded-md bg-secondary/10 px-2 py-1 text-xs font-semibold text-secondary">
                                ${item.price}
                              </span>
                            )}
                            {item.category && (
                              <span className="shrink-0 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                                {CATEGORY_LABELS[item.category]}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="hidden shrink-0 rounded-lg p-2 text-text-muted hover:bg-red-500/10 hover:text-red-600 sm:inline-flex"
                              aria-label={`Remove ${item.text}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </SwipeableRow>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
