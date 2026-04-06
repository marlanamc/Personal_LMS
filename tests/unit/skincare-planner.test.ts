import { describe, expect, it } from 'vitest';
import {
  EMPTY_SKINCARE_PLANNER_STORE,
  createNewItem,
  updateItem,
  deleteItem,
  getItemsForDaySlot,
  getTodayItems,
  createUniformSchedule,
  createWeekdaySchedule,
  createCustomSchedule,
  migrateLegacyStoreToV2,
  normalizeSkincarePlannerStore,
  addItemToCatalog,
  syncItemsToCatalog,
  type LegacySkincarePlannerStore,
  type SkincareItem,
  type SkincarePlannerStore,
} from '@/lib/skincare-planner';

describe('skincare planner v2 (item-centric)', () => {
  it('normalizes empty/invalid payloads safely', () => {
    expect(normalizeSkincarePlannerStore(null)).toEqual(EMPTY_SKINCARE_PLANNER_STORE);
    expect(normalizeSkincarePlannerStore(undefined)).toEqual(EMPTY_SKINCARE_PLANNER_STORE);
    expect(normalizeSkincarePlannerStore([])).toEqual(EMPTY_SKINCARE_PLANNER_STORE);
    expect(normalizeSkincarePlannerStore({})).toEqual(EMPTY_SKINCARE_PLANNER_STORE);
  });

  it('creates and manages items correctly', () => {
    const item1 = createNewItem('Gentle Cleanser', 'cleanser', createUniformSchedule(true, false));
    expect(item1.name).toBe('Gentle Cleanser');
    expect(item1.category).toBe('cleanser');
    expect(item1.weeklySchedule[0]?.am).toBe(true);
    expect(item1.weeklySchedule[0]?.pm).toBe(false);

    const updated = updateItem(item1, { notes: 'Use morning only' });
    expect(updated.notes).toBe('Use morning only');
    expect(updated.id).toBe(item1.id);

    const items = [item1, createNewItem('Retinol', 'actives')];
    const afterDelete = deleteItem(items, item1.id);
    expect(afterDelete.length).toBe(1);
    expect(afterDelete[0].name).toBe('Retinol');
  });

  it('creates schedule patterns correctly', () => {
    const uniform = createUniformSchedule(true, true);
    expect(uniform[0]?.am).toBe(true);
    expect(uniform[6]?.pm).toBe(true);

    const weekdays = createWeekdaySchedule(true, false);
    expect(weekdays[1]?.am).toBe(true); // Monday
    expect(weekdays[0]?.am).toBeUndefined(); // Sunday
    expect(weekdays[6]?.am).toBeUndefined(); // Saturday

    const custom = createCustomSchedule([1, 3, 5], true, false); // Mon/Wed/Fri AM
    expect(custom[1]?.am).toBe(true);
    expect(custom[3]?.am).toBe(true);
    expect(custom[5]?.am).toBe(true);
    expect(custom[1]?.pm).toBe(false);
    expect(custom[2]?.am).toBeUndefined();
  });

  it('filters items by day and slot correctly', () => {
    const items: SkincareItem[] = [
      createNewItem('Cleanser', 'cleanser', createUniformSchedule(true, true)),
      createNewItem('Vitamin C', 'serums', createUniformSchedule(true, false)), // AM only
      createNewItem('Retinol', 'actives', createCustomSchedule([1, 3, 5], false, true)), // Mon/Wed/Fri PM
      createNewItem('Moisturizer', 'moisturizer', createUniformSchedule(false, true)), // PM only
    ];

    const mondayAM = getItemsForDaySlot(items, 1, 'am');
    expect(mondayAM.length).toBe(2);
    expect(mondayAM.some((i) => i.name === 'Cleanser')).toBe(true);
    expect(mondayAM.some((i) => i.name === 'Vitamin C')).toBe(true);

    const mondayPM = getItemsForDaySlot(items, 1, 'pm');
    expect(mondayPM.length).toBe(3); // Cleanser, Retinol, Moisturizer
    expect(mondayPM.some((i) => i.name === 'Retinol')).toBe(true);

    const tuesdayPM = getItemsForDaySlot(items, 2, 'pm');
    expect(tuesdayPM.length).toBe(2); // Cleanser, Moisturizer (no Retinol)
    expect(tuesdayPM.some((i) => i.name === 'Retinol')).toBe(false);
  });

  it('items are sorted by category order, then name', () => {
    const items: SkincareItem[] = [
      createNewItem('Zinc Sunscreen', 'sunscreen', createUniformSchedule(true, false)),
      createNewItem('Vitamin C', 'serums', createUniformSchedule(true, false)),
      createNewItem('Gentle Cleanser', 'cleanser', createUniformSchedule(true, false)),
      createNewItem('Retinol', 'actives', createUniformSchedule(true, false)),
    ];

    const sorted = getItemsForDaySlot(items, 1, 'am');
    expect(sorted.map((i) => i.name)).toEqual(['Gentle Cleanser', 'Vitamin C', 'Retinol', 'Zinc Sunscreen']);
  });

  it('manages item catalog correctly', () => {
    let catalog = EMPTY_SKINCARE_PLANNER_STORE.itemCatalog;

    catalog = addItemToCatalog(catalog, 'cleanser', 'Gentle Cleanser');
    expect(catalog.cleanser[0]?.text).toBe('Gentle Cleanser');
    expect(catalog.cleanser[0]?.usageCount).toBe(1);

    catalog = addItemToCatalog(catalog, 'cleanser', 'Gentle Cleanser');
    expect(catalog.cleanser[0]?.usageCount).toBe(2);

    catalog = addItemToCatalog(catalog, 'serums', 'Vitamin C');
    expect(catalog.serums[0]?.text).toBe('Vitamin C');
  });

  it('syncs items to catalog automatically', () => {
    const items: SkincareItem[] = [
      createNewItem('Cleanser', 'cleanser', createUniformSchedule(true, false)),
      createNewItem('Vitamin C', 'serums', createUniformSchedule(true, false)),
      createNewItem('Retinol', 'actives', createUniformSchedule(false, true)),
    ];

    const catalog = syncItemsToCatalog(items, EMPTY_SKINCARE_PLANNER_STORE.itemCatalog);
    expect(catalog.cleanser.length).toBe(1);
    expect(catalog.serums.length).toBe(1);
    expect(catalog.actives.length).toBe(1);
    expect(catalog.cleanser[0]?.text).toBe('Cleanser');
  });

  it('migrates legacy v1 store to v2 correctly', () => {
    const legacyStore: LegacySkincarePlannerStore = {
      routines: {
        am: {
          text: 'Gentle Cleanser, Vitamin C',
          notes: 'Morning routine',
          selections: {
            cleanser: ['Gentle Cleanser'],
            toner: [],
            serums: ['Vitamin C'],
            actives: [],
            extras: [],
            moisturizer: [],
            sunscreen: [],
          },
        },
        pm: {
          text: 'Oil Cleanser, Retinol, Moisturizer',
          notes: 'Night routine',
          selections: {
            cleanser: ['Oil Cleanser'],
            toner: [],
            serums: [],
            actives: ['Retinol'],
            extras: [],
            moisturizer: ['Moisturizer'],
            sunscreen: [],
          },
        },
      },
      weeklySchedule: {
        0: { am: true, pm: false },
        1: { am: true, pm: true },
        2: { am: true, pm: true },
        3: { am: true, pm: false },
        4: { am: true, pm: true },
        5: { am: true, pm: true },
        6: { am: false, pm: true },
      },
      itemCatalog: {
        cleanser: [],
        toner: [],
        serums: [],
        actives: [],
        extras: [],
        moisturizer: [],
        sunscreen: [],
      },
    };

    const v2Store = migrateLegacyStoreToV2(legacyStore);

    expect(v2Store.version).toBe(2);
    expect(v2Store.items.length).toBeGreaterThan(0);

    // Check AM items
    const gentleCleanser = v2Store.items.find((i) => i.name === 'Gentle Cleanser');
    expect(gentleCleanser).toBeDefined();
    expect(gentleCleanser?.category).toBe('cleanser');
    expect(gentleCleanser?.weeklySchedule[0]?.am).toBe(true);
    expect(gentleCleanser?.weeklySchedule[0]?.pm).toBe(false);

    // Check PM items
    const retinol = v2Store.items.find((i) => i.name === 'Retinol');
    expect(retinol).toBeDefined();
    expect(retinol?.category).toBe('actives');
    expect(retinol?.weeklySchedule[1]?.pm).toBe(true);
    expect(retinol?.weeklySchedule[0]?.pm).toBeUndefined(); // Sunday has no PM in legacy schedule

    // Check item that appears in both AM and PM
    const oilCleanser = v2Store.items.find((i) => i.name === 'Oil Cleanser');
    expect(oilCleanser).toBeDefined();
    expect(oilCleanser?.category).toBe('cleanser');
  });

  it('normalizes v2 store correctly', () => {
    const store: SkincarePlannerStore = {
      version: 2,
      items: [
        {
          id: 'test-1',
          name: 'Cleanser',
          category: 'cleanser',
          weeklySchedule: {
            0: { am: true, pm: false },
            1: { am: true, pm: true },
          },
          usageCount: 5,
          lastUsedAt: '2026-04-05T00:00:00Z',
        },
      ],
      itemCatalog: {
        cleanser: [{ id: 'cat-1', text: 'Cleanser', usageCount: 5, lastUsedAt: '2026-04-05T00:00:00Z' }],
        toner: [],
        serums: [],
        actives: [],
        extras: [],
        moisturizer: [],
        sunscreen: [],
      },
      shopList: [],
    };

    const normalized = normalizeSkincarePlannerStore(store);
    expect(normalized.version).toBe(2);
    expect(normalized.items.length).toBe(1);
    expect(normalized.items[0].name).toBe('Cleanser');
    expect(normalized.items[0].weeklySchedule[0]?.am).toBe(true);
  });

  it('preserves shop list item price through normalization', () => {
    const store: SkincarePlannerStore = {
      version: 2,
      items: [],
      itemCatalog: EMPTY_SKINCARE_PLANNER_STORE.itemCatalog,
      shopList: [
        {
          id: 'shop-1',
          text: 'Sunscreen',
          checked: false,
          kind: 'to_buy',
          category: 'sunscreen',
          price: '24.99',
          addedAt: '2026-04-06T12:00:00.000Z',
        },
      ],
    };

    const normalized = normalizeSkincarePlannerStore(store);
    expect(normalized.shopList).toHaveLength(1);
    expect(normalized.shopList[0].price).toBe('24.99');
  });

  it('getTodayItems returns items for current day', () => {
    const store: SkincarePlannerStore = {
      version: 2,
      items: [
        createNewItem('Cleanser', 'cleanser', createUniformSchedule(true, true)),
        createNewItem('Vitamin C', 'serums', createUniformSchedule(true, false)),
        createNewItem('Retinol', 'actives', createUniformSchedule(false, true)),
      ],
      itemCatalog: EMPTY_SKINCARE_PLANNER_STORE.itemCatalog,
      shopList: [],
    };

    const today = getTodayItems(store);
    expect(today.am.length).toBeGreaterThanOrEqual(1);
    expect(today.pm.length).toBeGreaterThanOrEqual(1);
    expect(today.am.some((i) => i.name === 'Cleanser')).toBe(true);
    expect(today.pm.some((i) => i.name === 'Retinol')).toBe(true);
  });
});
