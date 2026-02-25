export interface RubricCriterion {
  id: string;
  label: string;
  description: string;
}

export interface AssessmentRubric {
  id: string;
  /** Tier for Spanish: intermediate or advanced */
  level: "intermediate" | "advanced";
  title: string;
  criteria: RubricCriterion[];
}

export const B1_CORE_RUBRIC: AssessmentRubric = {
  id: "b1-core-rubric",
  level: "intermediate",
  title: "Rúbrica base (Intermediate)",
  criteria: [
    {
      id: "coherencia",
      label: "Coherencia",
      description: "Organiza ideas con secuencia clara y conectores básicos funcionales.",
    },
    {
      id: "precision-gramatical",
      label: "Precisión gramatical",
      description: "Controla estructuras frecuentes con errores no sistemáticos.",
    },
    {
      id: "alcance-lexico",
      label: "Alcance léxico",
      description: "Usa vocabulario suficiente y relativamente variado para sostener postura y ejemplos.",
    },
  ],
};
