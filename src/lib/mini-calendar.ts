export interface MiniCalendarDayPresentationInput {
  isToday: boolean;
  isSelected: boolean;
  hasEvent: boolean;
  hasVacation: boolean;
  hasAppointment?: boolean;
  hasWorkout?: boolean;
}

export interface MiniCalendarDayPresentation {
  useTodayFill: boolean;
  useSelectedFill: boolean;
  ring: 'event' | 'vacation' | null;
  showEventDot: boolean;
  showVacationDot: boolean;
  showAppointmentDot: boolean;
  showWorkoutDot: boolean;
}

export function getMiniCalendarDayPresentation({
  isToday,
  isSelected,
  hasEvent,
  hasVacation,
  hasAppointment = false,
  hasWorkout = false,
}: MiniCalendarDayPresentationInput): MiniCalendarDayPresentation {
  return {
    useTodayFill: isToday,
    useSelectedFill: isSelected && !isToday,
    ring: hasEvent ? 'event' : hasVacation ? 'vacation' : null,
    showEventDot: hasEvent,
    showVacationDot: hasVacation,
    showAppointmentDot: hasAppointment,
    showWorkoutDot: hasWorkout,
  };
}
