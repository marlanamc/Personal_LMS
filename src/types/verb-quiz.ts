export interface VerbData {
  v1: string;        // base form (pre-filled)
  v1_3rd: string;    // third person singular
  v1_ing: string;    // present participle
  v2: string;        // simple past
  v3: string;        // past participle
}

export interface VerbQuizContent {
  type: 'verb-quiz';
  week: string;
  due_date: string;
  verbs: Record<string, VerbData>;
}

export interface VerbQuizAnswers {
  [verb: string]: {
    v1_3rd: string;
    v1_ing: string;
    v2: string;
    v3: string;
  };
}

export interface VerbQuizSubmission {
  answers: VerbQuizAnswers;
  score: number;
  totalPoints: number;
  correctCount: number;
  totalForms: number;
  results: {
    [verb: string]: {
      v1_3rd: boolean;
      v1_ing: boolean;
      v2: boolean;
      v3: boolean;
    };
  };
  submittedAt: string;
}
