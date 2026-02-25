"use client";

import Link from "next/link";
import {
  CODING_FOUNDATIONS_GUIDE_IDS,
  CODING_FUNCTIONS_CONTROL_FLOW_GUIDE_IDS,
  CODING_INTERMEDIATE_GUIDE_IDS,
  CODING_ADVANCED_GUIDE_IDS,
} from "@/content/coding/registry";
import { GUIDE_HUBS } from "@/content/guide-hubs";

interface CodingCourseMapVisualProps {
  completedActivityIds?: Set<string>;
  progressMap?: Record<string, { progress: number }>;
}

const SECTIONS: Array<{
  label: string;
  color: string;
  guideIds: readonly string[];
}> = [
  {
    label: "Foundations",
    color: "var(--color-accent-mint)",
    guideIds: CODING_FOUNDATIONS_GUIDE_IDS,
  },
  {
    label: "Functions & Control Flow",
    color: "var(--color-accent-teal)",
    guideIds: CODING_FUNCTIONS_CONTROL_FLOW_GUIDE_IDS,
  },
  {
    label: "Intermediate",
    color: "var(--color-accent-teal)",
    guideIds: CODING_INTERMEDIATE_GUIDE_IDS,
  },
  {
    label: "Advanced",
    color: "var(--color-accent-amethyst)",
    guideIds: CODING_ADVANCED_GUIDE_IDS,
  },
];

function getDisplayName(guideId: string): string {
  for (const hub of GUIDE_HUBS) {
    if (hub.subjectKey === "coding" && hub.guideIds.includes(guideId)) {
      return hub.name;
    }
  }
  // Fallback: format ID (coding-variables-types → Variables & Types)
  return guideId
    .replace(/^coding-/, "")
    .replace(/[-_]+/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function CodingCourseMapVisual({
  completedActivityIds = new Set(),
  progressMap = {},
}: CodingCourseMapVisualProps) {
  const getProgress = (id: string) => progressMap[id]?.progress ?? 0;
  const isCompleted = (id: string) => completedActivityIds.has(id) || getProgress(id) >= 100;
  const allGuideIds = SECTIONS.flatMap((section) => Array.from(section.guideIds));
  const completedTotal = allGuideIds.filter((id) => isCompleted(id)).length;
  const completionPercent = allGuideIds.length > 0 ? Math.round((completedTotal / allGuideIds.length) * 100) : 0;

  return (
    <div className="coding-course-map space-y-7">
      <div className="rounded-2xl border border-border-subtle bg-bg-elevated p-4 sm:p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-display font-bold text-text">Coding Learning Path</h2>
            <p className="text-sm text-text-secondary mt-1">A staged map from foundations through advanced execution.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-surface px-3 py-1.5 text-sm font-semibold text-text-secondary">
            <span className="text-text">{completedTotal}/{allGuideIds.length}</span>
            <span>done</span>
          </div>
        </div>
        <div className="mt-4 h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-progress-track)" }}>
          <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${completionPercent}%`, backgroundColor: "var(--color-accent-sakura)", opacity: 0.9 }} />
        </div>
      </div>

      <div className="space-y-7">
        {SECTIONS.map((section) => {
          const { label, color, guideIds } = section;
          const ids = Array.from(guideIds);
          const doneInSection = ids.filter((id) => isCompleted(id)).length;
          const sectionPercent = ids.length > 0 ? Math.round((doneInSection / ids.length) * 100) : 0;

          return (
            <section key={label} className="rounded-2xl border border-border-subtle bg-bg-elevated/40 p-4 sm:p-5 space-y-4">
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
                  <span style={{ color }}>{doneInSection}/{ids.length}</span>
                  <span>completed</span>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-progress-track)" }}>
                <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${sectionPercent}%`, backgroundColor: color, opacity: 0.9 }} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ids.map((id, idx) => {
                  const title = getDisplayName(id);
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
                          {label}: Guide {idx + 1}
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
      </div>

      <p className="text-xs text-text-muted text-center pt-1">
        Open any guide to continue. Each card shows section order and live progress.
      </p>
    </div>
  );
}
