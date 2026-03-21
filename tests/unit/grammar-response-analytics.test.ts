import { describe, expect, it } from "vitest";

import {
  aggregateResponsesBySkill,
  parseResponsesFromSubmissionContent,
} from "@/lib/grammar-response-analytics";

describe("grammar response analytics", () => {
  it("parses enriched responses from submission content", () => {
    const parsed = parseResponsesFromSubmissionContent(
      JSON.stringify({
        responses: [
          {
            questionId: "q1",
            userAnswer: "a",
            isCorrect: true,
            skillTag: "present-ending-choice",
            communicativeGoalTag: "present-routine-description",
            failureReasonTag: "present-ending-choice",
            improvedAfterSupport: true,
          },
        ],
      })
    );

    expect(parsed).toHaveLength(1);
    expect(parsed[0]?.communicativeGoalTag).toBe("present-routine-description");
    expect(parsed[0]?.improvedAfterSupport).toBe(true);
  });

  it("aggregates responses by skill tag and tracks support improvement", () => {
    const stats = aggregateResponsesBySkill([
      {
        response: {
          questionId: "q1",
          userAnswer: "a",
          isCorrect: true,
          skillTag: "request-softening",
          communicativeGoalTag: "restaurant-ordering",
          failureReasonTag: "request-softening",
          improvedAfterSupport: true,
        },
        completedAt: new Date("2026-03-20T12:00:00.000Z"),
      },
      {
        response: {
          questionId: "q2",
          userAnswer: "b",
          isCorrect: false,
          skillTag: "request-softening",
          communicativeGoalTag: "restaurant-ordering",
          failureReasonTag: "request-softening",
          improvedAfterSupport: false,
        },
        completedAt: new Date("2026-03-19T12:00:00.000Z"),
      },
    ]);

    expect(stats).toHaveLength(1);
    expect(stats[0]?.attempts).toBe(2);
    expect(stats[0]?.correct).toBe(1);
    expect(stats[0]?.improvedAfterSupportCount).toBe(1);
  });
});
