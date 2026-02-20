export {
  greetingsBasicsCards,
  greetingsBasicsVocabulary,
} from "./greetings-basics";

export {
  numbers1to100Cards,
  numbers1to100Vocabulary,
  SPANISH_NUMBERS,
  checkSpanishNumber,
  getSpanishNumber,
} from "./numbers-1-100";

export {
  colorsShapesCards,
  colorsShapesVocabulary,
} from "./colors-shapes";

export {
  familyRelationshipsCards,
  familyRelationshipsVocabulary,
} from "./family-relationships";

export {
  commonVerbCards,
  commonVerbsVocabulary,
  verbConjugations,
  getVerbsByType,
  checkConjugation,
} from "./common-verbs";

// All vocabulary sets for easy iteration
export const allSpanishVocabularySets = [
  { id: "spanish-vocab-greetings", module: () => import("./greetings-basics") },
  { id: "spanish-vocab-numbers", module: () => import("./numbers-1-100") },
  { id: "spanish-vocab-colors", module: () => import("./colors-shapes") },
  { id: "spanish-vocab-family", module: () => import("./family-relationships") },
  { id: "spanish-vocab-verbs", module: () => import("./common-verbs") },
];
