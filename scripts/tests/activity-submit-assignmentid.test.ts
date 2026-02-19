import assert from "node:assert/strict";
import { saveActivitySubmission } from "@/app/api/activity/submit/route";

type Call = {
  method: "upsert" | "findFirst" | "update" | "create";
  args: unknown;
};

function createSubmissionMock(options?: { existingId?: string | null }) {
  const calls: Call[] = [];
  const existingId = options?.existingId ?? null;

  const submission = {
    async upsert(args: unknown) {
      calls.push({ method: "upsert", args });
      return { id: "sub-upsert", score: 100 };
    },
    async findFirst(args: unknown) {
      calls.push({ method: "findFirst", args });
      return existingId ? { id: existingId } : null;
    },
    async update(args: unknown) {
      calls.push({ method: "update", args });
      return { id: "sub-update", score: 100 };
    },
    async create(args: unknown) {
      calls.push({ method: "create", args });
      return { id: "sub-create", score: 100 };
    },
  };

  return { submission, calls };
}

console.log("Running activity submit assignmentId regression checks...");

async function main() {
  // Case 1: assignmentId present -> must use composite-key upsert path.
  {
    const { submission, calls } = createSubmissionMock();
    const assignmentId = "assign_123";
    await saveActivitySubmission({
      submission,
      userId: "user_1",
      activityId: "activity_1",
      assignmentId,
      content: { answers: { a: 1 } },
      score: 100,
      pointsAwarded: 15,
    });

    assert.strictEqual(calls[0]?.method, "upsert", "assignment submissions should use upsert");
    const upsertArgs = calls[0]?.args as {
      where: {
        userId_activityId_assignmentId: { assignmentId: string };
      };
    };
    assert.strictEqual(
      upsertArgs.where.userId_activityId_assignmentId.assignmentId,
      assignmentId,
      "upsert where key should use the provided assignmentId"
    );
  }

  // Case 2: assignmentId null + existing null-assignment row -> findFirst then update (no upsert).
  {
    const { submission, calls } = createSubmissionMock({ existingId: "existing_null_row" });
    await saveActivitySubmission({
      submission,
      userId: "user_1",
      activityId: "activity_1",
      assignmentId: null,
      content: { answers: { a: 1 } },
      score: 100,
      pointsAwarded: 15,
    });

    assert.deepStrictEqual(
      calls.map((c) => c.method),
      ["findFirst", "update"],
      "null assignment should update existing null-assignment record without upsert"
    );
  }

  // Case 3: assignmentId null + no existing row -> findFirst then create (no upsert).
  {
    const { submission, calls } = createSubmissionMock({ existingId: null });
    await saveActivitySubmission({
      submission,
      userId: "user_1",
      activityId: "activity_1",
      assignmentId: null,
      content: { answers: { a: 1 } },
      score: 100,
      pointsAwarded: 15,
    });

    assert.deepStrictEqual(
      calls.map((c) => c.method),
      ["findFirst", "create"],
      "null assignment should create when no existing null-assignment row is found"
    );
  }

  console.log("✅ Activity submit assignmentId checks passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
