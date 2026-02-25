export interface RubricCriterion {
  id: string;
  label: string;
  description: string;
}

export interface AssessmentRubric {
  id: string;
  level: "B1" | "B2" | "C1" | "C2";
  title: string;
  criteria: RubricCriterion[];
}

export const B1_CORE_RUBRIC: AssessmentRubric = {
  id: "b1-core-rubric",
  level: "B1",
  title: "Rúbrica base B1",
  criteria: [
    {
      id: "coherencia",
      label: "Coherencia",
      description: "Organiza ideas con secuencia clara y conectores básicos funcionales.",
    },
    {
      id: "precision-gramatical",
      label: "Precisión gramatical",
      description: "Controla estructuras frecuentes de B1 con errores no sistemáticos.",
    },
    {
      id: "alcance-lexico",
      label: "Alcance léxico",
      description: "Usa vocabulario suficiente y relativamente variado para sostener postura y ejemplos.",
    },
  ],
};
