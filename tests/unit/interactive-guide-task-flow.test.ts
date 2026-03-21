import { describe, expect, it } from "vitest";

import type { InteractiveGuideContent } from "@/types/activity";
import {
  getCheckpointQuestions,
  getResolvedSectionTaskData,
  isTaskFirstGuide,
} from "@/lib/interactive-guide-task-flow";

const taskFirstGuide: InteractiveGuideContent = {
  type: "interactive-guide",
  sections: [
    {
      id: "section-1",
      title: "Section 1",
      taskStageId: "stage-1",
      inputMaterialIds: ["input-1"],
      focusOnFormTriggerIds: ["trigger-1"],
      exercises: [],
    },
  ],
  taskScenario: {
    title: "Scenario",
    summary: "Summary",
  },
  inputMaterials: [
    {
      id: "input-1",
      title: "Input",
      kind: "dialogue",
      content: "<p>Hola</p>",
    },
  ],
  taskStages: [
    {
      id: "stage-1",
      title: "Stage",
      goal: "Goal",
      prompt: "Prompt",
      expectedOutput: "short-response",
    },
  ],
  focusOnFormTriggers: [
    {
      id: "trigger-1",
      stageId: "stage-1",
      triggerType: "production",
      detectedIssue: "Issue",
      microExplanation: "Explanation",
      contrastExamples: ["bad", "good"],
      repairPrompt: "Try again",
    },
  ],
  communicativeCheckpoint: {
    title: "Checkpoint",
    questions: [
      {
        id: "q1",
        question: "Question",
        options: [{ value: "a", label: "A" }],
        correctAnswer: "a",
      },
    ],
  },
};

describe("interactive guide task flow helpers", () => {
  it("detects task-first guides", () => {
    expect(isTaskFirstGuide(taskFirstGuide)).toBe(true);
    expect(
      isTaskFirstGuide({
        type: "interactive-guide",
        sections: [{ title: "Legacy section", exercises: [] }],
      })
    ).toBe(false);
  });

  it("prefers communicative checkpoint questions over legacy mini quiz", () => {
    const questions = getCheckpointQuestions(taskFirstGuide);
    expect(questions).toHaveLength(1);
    expect(questions?.[0]?.id).toBe("q1");
  });

  it("resolves task stage, input materials, and focus triggers for a section", () => {
    const resolved = getResolvedSectionTaskData(taskFirstGuide, taskFirstGuide.sections[0]!);
    expect(resolved.taskStage?.id).toBe("stage-1");
    expect(resolved.inputMaterials).toHaveLength(1);
    expect(resolved.focusOnFormTriggers).toHaveLength(1);
  });
});
