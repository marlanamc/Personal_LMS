import type { GameUi } from "@/lib/gamification/activity-points";

interface GameEmojiInput {
  activityId?: string | null;
  title?: string | null;
  gameUi?: GameUi | null;
}

export function getGameEmojiForActivity({
  activityId,
  title,
  gameUi,
}: GameEmojiInput): string {
  const haystack = `${activityId ?? ""} ${title ?? ""}`.toLowerCase();

  if (haystack.includes("time indicator")) return "⏰";
  if (haystack.includes("verb form")) return "🔤";
  if (haystack.includes("sounds right") || haystack.includes("pronunciation")) return "🔊";
  if (haystack.includes("numbers")) return "🔢";
  if (haystack.includes("countable") || haystack.includes("uncountable")) return "🧺";
  if (haystack.includes("matching") || haystack.includes("match")) return "🧩";
  if (haystack.includes("flashcard")) return "🃏";
  if (haystack.includes("fill") || haystack.includes("blank")) return "📝";

  switch (gameUi) {
    case "numbers":
      return "🔢";
    case "matching":
      return "🧩";
    case "fill-in-blank":
      return "📝";
    case "verb-forms":
      return "🔤";
    case "ed-pronunciation":
    case "minimal-pairs":
      return "🔊";
    case "flashcards":
      return "🃏";
    default:
      return "🎮";
  }
}
