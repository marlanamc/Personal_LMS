// Activity UI type detection - determines which game renderer to use for activities
// (Extracted from gamification system - this is UI routing, not gamification)

export type GameUi = "numbers" | "matching" | "fill-in-blank" | "flashcards" | "verb-forms" | "word-list" | "ed-pronunciation" | "minimal-pairs" | "unknown";

export interface ActivityMeta {
  id?: string;
  ui?: string | null;
  content?: string | null;
}

export function resolveActivityGameUi(activity?: ActivityMeta): GameUi {
  const ui = activity?.ui?.trim().toLowerCase();
  if (ui) {
    if (ui === "matching") return "matching";
    if (ui === "word-list" || ui === "wordlist" || ui === "list") return "word-list";
    if (ui === "numbers" || ui === "numbers-game") return "numbers";
    if (ui === "fill-in-blank" || ui === "fillblank") return "fill-in-blank";
    if (ui === "flashcards" || ui === "flashcard") return "flashcards";
    if (ui === "verb-forms" || ui === "verbforms") return "verb-forms";
    if (ui === "ed-pronunciation" || ui === "ed-sounds" || ui === "pronunciation") return "ed-pronunciation";
    if (ui === "minimal-pairs" || ui === "minimalpairs" || ui === "minimal-pairs-listening") return "minimal-pairs";
  }

  const content = activity?.content;
  if (typeof content === "string") {
    const parsed = safeJsonParse(content);
    if (parsed && typeof parsed === "object" && "type" in parsed && (parsed as Record<string, unknown>).type === "numbers-game") {
      return "numbers";
    }
    if (content.includes("Q:") && content.includes("OPTIONS:")) {
      return "fill-in-blank";
    }
    if (content.includes("::")) {
      return "matching";
    }
    if (content.includes("Verb,V1,V1-3rd") || content.includes(".csv")) {
      return "verb-forms";
    }
    // Check for ed-pronunciation content type
    if (parsed && typeof parsed === "object" && "type" in parsed && (parsed as Record<string, unknown>).type === "ed-pronunciation") {
      return "ed-pronunciation";
    }
    // Check for minimal-pairs content type
    if (parsed && typeof parsed === "object" && "type" in parsed && (parsed as Record<string, unknown>).type === "minimal-pairs") {
      return "minimal-pairs";
    }
  }

  return "flashcards";
}

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
