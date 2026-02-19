/**
 * Weekly vocabulary units (Feb–Jun) replacing the former monthly Units 6–9.
 * Unit number is the same for the whole month: Feb = 6, Mar = 7, Apr = 8, May = 9, Jun = 10.
 * Each unit has 4 activities: word list (packet), flashcards, matching, fill-in-the-blank.
 */

export interface WeeklyVocabUnit {
  id: string;
  label: string;
}

export const VOCAB_WEEKLY_UNITS: WeeklyVocabUnit[] = [
  { id: "feb-3-5", label: "February 3–5" },
  { id: "feb-10-12", label: "February 10–12" },
  { id: "feb-24-26", label: "February 24–26" },
  { id: "mar-3-5", label: "March 3–5" },
  { id: "mar-10-12", label: "March 10–12" },
  { id: "mar-17-19", label: "March 17–19" },
  { id: "mar-24-26", label: "March 24–26" },
  { id: "mar-31-apr-2", label: "March 31 – April 2" },
  { id: "apr-7-9", label: "April 7–9" },
  { id: "apr-14-16", label: "April 14–16" },
  { id: "apr-28-30", label: "April 28–30" },
  { id: "may-5-7", label: "May 5–7" },
  { id: "may-12-14", label: "May 12–14" },
  { id: "may-19-21", label: "May 19–21" },
  { id: "may-26-28", label: "May 26–28" },
  { id: "jun-2-4", label: "June 2–4" },
];

/** Map slug id -> unit number (6 = Feb, 7 = Mar, 8 = Apr, 9 = May, 10 = Jun) */
export const VOCAB_WEEKLY_UNIT_NUMBER: Record<string, number> = Object.fromEntries(
  VOCAB_WEEKLY_UNITS.map((u) => {
    const unitNum = u.id.startsWith("feb-") ? 6 : u.id.startsWith("mar-") ? 7 : u.id.startsWith("apr-") ? 8 : u.id.startsWith("may-") ? 9 : 10;
    return [u.id, unitNum];
  })
);
