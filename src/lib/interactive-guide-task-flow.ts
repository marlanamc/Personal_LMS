import type {
    FocusOnFormTrigger,
    InputMaterial,
    InteractiveGuideContent,
    InteractiveGuideSection,
    MiniQuizQuestion,
    PostTaskReflection,
    TaskStage,
} from "@/types/activity";

export interface ResolvedSectionTaskData {
    taskStage: TaskStage | null;
    inputMaterials: InputMaterial[];
    focusOnFormTriggers: FocusOnFormTrigger[];
    reflection: PostTaskReflection | null;
}

export function isTaskFirstGuide(content: InteractiveGuideContent): boolean {
    return Array.isArray(content.taskStages) && content.taskStages.length > 0;
}

export function getCheckpointQuestions(content: InteractiveGuideContent): MiniQuizQuestion[] | undefined {
    if (content.communicativeCheckpoint?.questions?.length) {
        return content.communicativeCheckpoint.questions;
    }
    return content.miniQuiz;
}

export function getResolvedSectionTaskData(
    content: InteractiveGuideContent,
    section: InteractiveGuideSection
): ResolvedSectionTaskData {
    const taskStage =
        content.taskStages?.find((stage) => stage.id === section.taskStageId) ?? null;
    const inputMaterials = (section.inputMaterialIds ?? [])
        .map((id) => content.inputMaterials?.find((item) => item.id === id) ?? null)
        .filter((item): item is InputMaterial => item !== null);
    const focusOnFormTriggers = ((section.focusOnFormTriggerIds?.length
        ? section.focusOnFormTriggerIds.map(
              (id) => content.focusOnFormTriggers?.find((trigger) => trigger.id === id) ?? null
          )
        : content.focusOnFormTriggers?.filter((trigger) => trigger.stageId === section.taskStageId) ?? []
    ).filter((trigger): trigger is FocusOnFormTrigger => trigger !== null));

    return {
        taskStage,
        inputMaterials,
        focusOnFormTriggers,
        reflection: section.postTaskReflection ?? content.postTaskReflection ?? null,
    };
}
