"use client";

import Link from "next/link";
import { spanishCourseObjectives } from "@/content/spanish/course-map";

interface RelatedPracticeSectionProps {
  activityId: string;
}

function getObjectiveByGuideId(guideId: string) {
  return spanishCourseObjectives.find((o) => o.canonicalGuideId === guideId);
}

function formatActivityTitle(id: string): string {
  return id
    .replace(/^spanish-|-guide|-vocab|-verb-game|-numbers-game|-flashcards$/g, " ")
    .replace(/[-_]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function RelatedPracticeSection({ activityId }: RelatedPracticeSectionProps) {
  const objective = getObjectiveByGuideId(activityId);
  if (!objective) return null;

  const practiceIds = objective.practiceActivityIds ?? [];
  const vocabIds = objective.relatedVocabIds ?? [];
  const reviewIds = [...new Set([...(objective.recyclesObjectives ?? []), ...(objective.prerequisites ?? [])])];

  const hasPractice = practiceIds.length > 0;
  const hasVocab = vocabIds.length > 0;
  const hasReview = reviewIds.length > 0;
  if (!hasPractice && !hasVocab && !hasReview) return null;

  return (
    <div className="related-practice mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20 text-sm">
      <h4 className="font-semibold text-text mb-2">Related practice</h4>
      <div className="space-y-2">
        {hasPractice && (
          <div>
            <span className="text-text-muted text-xs uppercase tracking-wide">Verb games & practice</span>
            <ul className="mt-1 flex flex-wrap gap-2">
              {practiceIds.map((id) => (
                <li key={id}>
                  <Link
                    href={`/activity/${id}`}
                    className="text-primary hover:underline font-medium"
                  >
                    {formatActivityTitle(id)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {hasVocab && (
          <div>
            <span className="text-text-muted text-xs uppercase tracking-wide">Vocabulary</span>
            <ul className="mt-1 flex flex-wrap gap-2">
              {vocabIds.map((id) => (
                <li key={id}>
                  <Link
                    href={`/activity/${id}`}
                    className="text-primary hover:underline font-medium"
                  >
                    {formatActivityTitle(id)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {hasReview && (
          <div>
            <span className="text-text-muted text-xs uppercase tracking-wide">Review first</span>
            <p className="mt-1 text-text-muted">
              Before or while studying this, review:{" "}
              {reviewIds
                .map((id) => {
                  const obj = spanishCourseObjectives.find((o) => o.id === id);
                  return obj ? obj.title : id;
                })
                .join("; ")}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
