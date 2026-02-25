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

  return (
    <div className="coding-course-map space-y-10">
      <h2 className="text-xl font-display font-bold text-text text-center">
        Coding Learning Path
      </h2>

      <div className="space-y-12">
        {SECTIONS.map((section) => {
          const { label, color, guideIds } = section;
          const ids = Array.from(guideIds);

          return (
            <section key={label} className="space-y-4">
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
                {ids.map((id, idx) => {
                  const title = getDisplayName(id);
                  const done = isCompleted(id);

                  return (
                    <Link
                      key={id}
                      href={`/activity/${id}`}
                      className="group block flex-shrink-0"
                    >
                      <div
                        className={`
                          relative rounded-xl border-2 px-4 py-3 min-w-[140px] sm:min-w-[180px]
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
                        <span className="text-xs font-medium text-text-muted block mb-1">
                          {idx + 1} of {ids.length}
                        </span>
                        <span className="text-sm font-semibold text-text group-hover:text-primary transition-colors block line-clamp-2">
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
      </div>

      <p className="text-xs text-text-muted text-center pt-4">
        Click any lesson to open it. Completed lessons show a checkmark.
      </p>
    </div>
  );
}
