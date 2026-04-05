export type CalendarEventType =
  | "due"
  | "holiday"
  | "event"
  | "reminder"
  | "quiz"
  | "appointment"
  | "workout";

export interface CalendarEvent {
  id?: string;
  date: Date | string;
  endDate?: Date | string | null;
  type?: CalendarEventType;
  title?: string | null;
  description?: string | null;
}
