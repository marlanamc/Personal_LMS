import type { DailyAnchor } from '@/lib/anchors';
import type { CalendarEvent } from '@/components/dashboard/MiniCalendar';
import type {
  PlannerConstraintRule,
  PlannerConstraintRuleKind,
  TimeBlockEntry,
} from '@/lib/time-block-planner';

export type DailyOverviewItemType = 'anchor' | 'event' | 'boundary' | 'session';

export interface DailyOverviewItem {
  id: string;
  type: DailyOverviewItemType;
  label: string;
  time: string; // Display time (HH:MM or range like "3:00-6:00 PM")
  scheduledMinutes: number; // For chronological sorting (minutes since midnight)
  isDone: boolean;
  isAcknowledged: boolean;
  icon: string; // Icon identifier for rendering
  color?: string;
  description?: string; // Optional secondary text
  /** Set when type is `event` — for calendar marker styling */
  eventType?: CalendarEvent['type'];
  /** Set when type is `boundary` — for rail accent */
  boundaryKind?: PlannerConstraintRuleKind;
  // Original data for type-specific actions
  sourceData: DailyAnchor | CalendarEvent | PlannerConstraintRule | TimeBlockEntry;
}
