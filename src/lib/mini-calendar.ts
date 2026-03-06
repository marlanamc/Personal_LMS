export interface MiniCalendarDayPresentationInput {
  isToday: boolean;
  isSelected: boolean;
  hasEvent: boolean;
  hasVacation: boolean;
}

export interface MiniCalendarDayPresentation {
  useTodayFill: boolean;
  useSelectedFill: boolean;
  ring: 'event' | 'vacation' | null;
  showEventDot: boolean;
  showVacationDot: boolean;
}

export function getMiniCalendarDayPresentation({
  isToday,
  isSelected,
  hasEvent,
  hasVacation,
}: MiniCalendarDayPresentationInput): MiniCalendarDayPresentation {
  return {
    useTodayFill: isToday,
    useSelectedFill: isSelected && !isToday,
    ring: hasEvent ? 'event' : hasVacation ? 'vacation' : null,
    showEventDot: hasEvent,
    showVacationDot: hasVacation,
  };
}
