import { describe, expect, it } from 'vitest';
import { parseSpotlightNowInsertIndex, spotlightNowInsertId } from '@/lib/organize-spotlight';

describe('organize spotlight ids', () => {
  it('builds and parses insert indices', () => {
    expect(spotlightNowInsertId(0)).toBe('spotlight:now:at:0');
    expect(parseSpotlightNowInsertIndex('spotlight:now:at:3')).toBe(3);
    expect(parseSpotlightNowInsertIndex('lane:p1:now')).toBeNull();
  });
});
