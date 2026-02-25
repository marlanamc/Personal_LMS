"use client";

import Link from "next/link";
import { SPANISH_GUIDE_IDS, SPANISH_GUIDE_META } from "@/content/spanish/registry";
import type { SpanishTier } from "@/content/spanish/registry";

interface SpanishCourseMapVisualProps {
  completedActivityIds?: Set<string>;
  progressMap?: Record<string, { progress: number }>;
}

const TIER_ORDER: SpanishTier[] = ["basics", "intermediate", "advanced"];
const TIER_LABELS: Record<SpanishTier, string> = {
  basics: "Basics",
  intermediate: "Intermediate",
  advanced: "Advanced",
};
const TIER_COLORS: Record<SpanishTier, string> = {
  basics: "var(--color-accent-mint)",
  intermediate: "var(--color-accent-teal)",
  advanced: "var(--color-accent-amethyst)",
};

function getGuidesByTier() {
  const byTier: Record<SpanishTier, string[]> = {
    basics: [],
    intermediate: [],
    advanced: [],
  };

  const otherGuides: string[] = [];

  for (const id of SPANISH_GUIDE_IDS) {
    const meta = SPANISH_GUIDE_META[id as keyof typeof SPANISH_GUIDE_META];
    if (!meta || meta.lessonNumber === 0) {
      otherGuides.push(id);
      continue;
    }
    if (meta.tier in byTier) {
      byTier[meta.tier as SpanishTier].push(id);
    }
  }

  // Sort each tier by lesson number
  for (const tier of TIER_ORDER) {
    byTier[tier].sort(
      (a, b) =>
        (SPANISH_GUIDE_META[a as keyof typeof SPANISH_GUIDE_META]?.lessonNumber ?? 0) -
        (SPANISH_GUIDE_META[b as keyof typeof SPANISH_GUIDE_META]?.lessonNumber ?? 0)
    );
  }

  return { byTier, otherGuides };
}

export function SpanishCourseMapVisual({
  completedActivityIds = new Set(),
  progressMap = {},
}: SpanishCourseMapVisualProps) {
  const { byTier, otherGuides } = getGuidesByTier();

  const getProgress = (id: string) => progressMap[id]?.progress ?? 0;
  const isCompleted = (id: string) => completedActivityIds.has(id) || getProgress(id) >= 100;

  return (
    <div className="spanish-course-map space-y-10">
      <h2 className="text-xl font-display font-bold text-text text-center">
        Spanish Learning Path
      </h2>

      <div className="space-y-12">
        {TIER_ORDER.map((tier) => {
          const guides = byTier[tier];
          if (guides.length === 0) return null;

          const color = TIER_COLORS[tier];
          const label = TIER_LABELS[tier];

          return (
            <section key={tier} className="space-y-4">
              <div
                className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider"
                style={{ color }}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                {label}
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                {guides.map((id, idx) => {
                  const meta = SPANISH_GUIDE_META[id as keyof typeof SPANISH_GUIDE_META];
                  const title = meta?.topic ?? id;
                  const lessonNum = meta?.lessonNumber ?? idx + 1;
                  const done = isCompleted(id);

                  return (
                    <Link
                      key={id}
                      href={`/activity/${id}`}
                      className="group block flex-shrink-0"
                    >
                      <div
                        className={`
                          relative rounded-xl border-2 px-4 py-3 min-w-[140px] sm:min-w-[160px]
                          transition-all duration-200
                          ${done
                            ? "border-success/50 bg-success/10 hover:border-success hover:bg-success/15"
                            : "border-border/60 bg-bg-surface hover:border-primary/50 hover:bg-primary/5"
                          }
                        `}
                        style={{
                          borderColor: done ? undefined : `${color}30`,
                        }}
                      >
                        {done && (
                          <span
                            className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center bg-success/20"
                            aria-hidden
                          >
                            <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                        <span className="text-[10px] font-bold text-text-muted block mb-1">
                          {label} {lessonNum}
                        </span>
                        <span className="text-sm font-semibold text-text group-hover:text-primary transition-colors block">
                          {title}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}

        {otherGuides.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-text-muted">
              <span className="w-2 h-2 rounded-full bg-text-muted/50 flex-shrink-0" />
              Additional
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {otherGuides.map((id) => {
                const meta = SPANISH_GUIDE_META[id as keyof typeof SPANISH_GUIDE_META];
                const title = meta?.topic ?? id;
                const done = isCompleted(id);

                return (
                  <Link key={id} href={`/activity/${id}`} className="group block flex-shrink-0">
                    <div
                      className={`
                        relative rounded-xl border-2 border-border/60 px-4 py-3 min-w-[140px] sm:min-w-[160px]
                        transition-all duration-200
                        ${done ? "border-success/50 bg-success/10" : "bg-bg-surface hover:border-primary/50 hover:bg-primary/5"}
                      `}
                    >
                      {done && (
                        <span className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center bg-success/20" aria-hidden>
                          <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                      <span className="text-sm font-semibold text-text group-hover:text-primary transition-colors block">
                        {title}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>

      <p className="text-xs text-text-muted text-center pt-4">
        Click any lesson to open it. Completed lessons show a checkmark.
      </p>
    </div>
  );
}
