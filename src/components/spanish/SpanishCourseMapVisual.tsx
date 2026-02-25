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
  const allGuides = [...TIER_ORDER.flatMap((tier) => byTier[tier]), ...otherGuides];
  const completedTotal = allGuides.filter((id) => isCompleted(id)).length;
  const completionPercent = allGuides.length > 0 ? Math.round((completedTotal / allGuides.length) * 100) : 0;

  return (
    <div className="spanish-course-map space-y-7">
      <div className="rounded-2xl border border-border-subtle bg-bg-elevated p-4 sm:p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-display font-bold text-text">Spanish Learning Path</h2>
            <p className="text-sm text-text-secondary mt-1">Tiered roadmap with ordered guides and progress.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-surface px-3 py-1.5 text-sm font-semibold text-text-secondary">
            <span className="text-text">{completedTotal}/{allGuides.length}</span>
            <span>done</span>
          </div>
        </div>
        <div className="mt-4 h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-progress-track)" }}>
          <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${completionPercent}%`, backgroundColor: "var(--color-accent-sakura)", opacity: 0.9 }} />
        </div>
      </div>

      <div className="space-y-7">
        {TIER_ORDER.map((tier) => {
          const guides = byTier[tier];
          if (guides.length === 0) return null;

          const color = TIER_COLORS[tier];
          const label = TIER_LABELS[tier];
          const doneInTier = guides.filter((id) => isCompleted(id)).length;
          const tierPercent = Math.round((doneInTier / guides.length) * 100);

          return (
            <section key={tier} className="rounded-2xl border border-border-subtle bg-bg-elevated/40 p-4 sm:p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
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
                <div className="inline-flex items-center gap-2 text-xs font-semibold rounded-full border border-border-subtle px-2.5 py-1 bg-bg-surface text-text-secondary">
                  <span style={{ color }}>{doneInTier}/{guides.length}</span>
                  <span>completed</span>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-progress-track)" }}>
                <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${tierPercent}%`, backgroundColor: color, opacity: 0.9 }} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {guides.map((id, idx) => {
                  const meta = SPANISH_GUIDE_META[id as keyof typeof SPANISH_GUIDE_META];
                  const title = meta?.topic ?? id;
                  const lessonNum = meta?.lessonNumber ?? idx + 1;
                  const done = isCompleted(id);
                  const progress = Math.min(100, Math.max(0, getProgress(id)));
                  const statusLabel = done ? "Completed" : progress > 0 ? "In Progress" : "Not Started";

                  return (
                    <Link
                      key={id}
                      href={`/activity/${id}`}
                      className="group block flex-shrink-0"
                    >
                      <div
                        className={`
                          relative rounded-xl border px-4 py-3 transition-all duration-200 shadow-sm hover:shadow-md
                          ${done
                            ? "border-success/40 bg-success/10"
                            : "border-border-subtle bg-bg-surface hover:border-border"
                          }
                        `}
                        style={{ borderLeft: `3px solid ${color}` }}
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
                        <span className="text-[10px] font-bold tracking-wide uppercase text-text-muted block mb-1">
                          {label}: Guide {lessonNum}
                        </span>
                        <span className="text-sm font-semibold text-text group-hover:text-primary transition-colors block line-clamp-2">
                          {title}
                        </span>
                        <div className="mt-2 flex items-center justify-between gap-2 text-[11px]">
                          <span className="text-text-secondary font-medium">{statusLabel}</span>
                          <span className="font-semibold" style={{ color }}>{Math.round(progress)}%</span>
                        </div>
                        <div className="mt-1 h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-progress-track)" }}>
                          <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${progress}%`, backgroundColor: color, opacity: 0.9 }} />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}

        {otherGuides.length > 0 && (
          <section className="rounded-2xl border border-border-subtle bg-bg-elevated/40 p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-text-muted">
              <span className="w-2 h-2 rounded-full bg-text-muted/50 flex-shrink-0" />
              Additional
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {otherGuides.map((id) => {
                const meta = SPANISH_GUIDE_META[id as keyof typeof SPANISH_GUIDE_META];
                const title = meta?.topic ?? id;
                const done = isCompleted(id);
                const progress = Math.min(100, Math.max(0, getProgress(id)));

                return (
                  <Link key={id} href={`/activity/${id}`} className="group block flex-shrink-0">
                    <div
                      className={`
                        relative rounded-xl border border-border-subtle px-4 py-3 transition-all duration-200 shadow-sm hover:shadow-md
                        ${done ? "border-success/40 bg-success/10" : "bg-bg-surface hover:border-border"}
                      `}
                      style={{ borderLeft: "3px solid var(--color-text-muted)" }}
                    >
                      {done && (
                        <span className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center bg-success/20" aria-hidden>
                          <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                      <span className="text-sm font-semibold text-text group-hover:text-primary transition-colors block line-clamp-2">
                        {title}
                      </span>
                      <div className="mt-2 flex items-center justify-between gap-2 text-[11px]">
                        <span className="text-text-secondary font-medium">{done ? "Completed" : progress > 0 ? "In Progress" : "Not Started"}</span>
                        <span className="font-semibold text-text-muted">{Math.round(progress)}%</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-progress-track)" }}>
                        <div className="h-full rounded-full transition-[width] duration-500 bg-text-muted/70" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>

      <p className="text-xs text-text-muted text-center pt-1">
        Open any guide to continue. Colors indicate tier; bars show exact progress.
      </p>
    </div>
  );
}
