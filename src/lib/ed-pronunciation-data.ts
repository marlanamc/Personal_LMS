/**
 * -ed Pronunciation Game Data
 *
 * The three sounds:
 * - /d/: After voiced sounds (b, g, v, z, m, n, l, r, vowels)
 * - /t/: After voiceless sounds (p, k, f, s, sh, ch, x)
 * - /ɪd/: After /t/ or /d/ sounds (adds a syllable)
 */

export type EdSound = "d" | "t" | "id";

export interface EdVerb {
  base: string;
  past: string;
  sound: EdSound;
  example: string;
  difficulty: "easy" | "medium" | "hard";
}

// Human-readable rule explanations
export const SOUND_RULES: Record<EdSound, { symbol: string; rule: string; shortRule: string }> = {
  d: {
    symbol: "/d/",
    rule: "When the verb ends in a voiced sound (like b, g, v, z, m, n, l, r, or a vowel), the -ed sounds like /d/.",
    shortRule: "Voiced ending → /d/",
  },
  t: {
    symbol: "/t/",
    rule: "When the verb ends in a voiceless sound (like p, k, f, s, sh, ch), the -ed sounds like /t/.",
    shortRule: "Voiceless ending → /t/",
  },
  id: {
    symbol: "/ɪd/",
    rule: "When the verb already ends in a /t/ or /d/ sound, we add a whole syllable: /ɪd/.",
    shortRule: "Ends in t/d → /ɪd/ (extra syllable)",
  },
};

// Pattern hints shown during discovery phase
export const PATTERN_HINTS: Record<EdSound, string[]> = {
  d: [
    "Notice how these verbs end in sounds you can 'feel' in your throat...",
    "Try humming while saying the last sound of the base verb. Can you feel vibration?",
    "Voiced sounds make your vocal cords vibrate!",
  ],
  t: [
    "These verbs end in 'quiet' sounds - no vibration in your throat...",
    "Try putting your hand on your throat. These ending sounds are silent there!",
    "Voiceless sounds are just air - no buzz from your vocal cords.",
  ],
  id: [
    "These verbs already end in a /t/ or /d/ sound...",
    "We need to add a whole extra syllable here: /ɪd/",
    "want-ed, need-ed - hear the extra beat?",
  ],
};

/**
 * Curated verb list for the -ed pronunciation game.
 * Organized by sound and difficulty.
 */
export const ED_VERBS: EdVerb[] = [
  // ===== /d/ SOUND (voiced endings) =====

  // Easy /d/ - common verbs with clear voiced endings
  { base: "play", past: "played", sound: "d", example: "I played soccer yesterday.", difficulty: "easy" },
  { base: "call", past: "called", sound: "d", example: "She called her mom.", difficulty: "easy" },
  { base: "open", past: "opened", sound: "d", example: "He opened the door.", difficulty: "easy" },
  { base: "close", past: "closed", sound: "d", example: "We closed the window.", difficulty: "easy" },
  { base: "love", past: "loved", sound: "d", example: "They loved the movie.", difficulty: "easy" },
  { base: "live", past: "lived", sound: "d", example: "She lived in Mexico.", difficulty: "easy" },
  { base: "rain", past: "rained", sound: "d", example: "It rained all day.", difficulty: "easy" },
  { base: "clean", past: "cleaned", sound: "d", example: "I cleaned my room.", difficulty: "easy" },
  { base: "stay", past: "stayed", sound: "d", example: "We stayed home.", difficulty: "easy" },
  { base: "try", past: "tried", sound: "d", example: "He tried his best.", difficulty: "easy" },
  { base: "save", past: "saved", sound: "d", example: "She saved money.", difficulty: "easy" },
  { base: "use", past: "used", sound: "d", example: "I used a pen.", difficulty: "easy" },

  // Medium /d/ - less obvious or longer verbs
  { base: "change", past: "changed", sound: "d", example: "He changed his clothes.", difficulty: "medium" },
  { base: "happen", past: "happened", sound: "d", example: "It happened yesterday.", difficulty: "medium" },
  { base: "learn", past: "learned", sound: "d", example: "He learned English.", difficulty: "medium" },
  { base: "turn", past: "turned", sound: "d", example: "She turned left.", difficulty: "medium" },
  { base: "enjoy", past: "enjoyed", sound: "d", example: "We enjoyed the party.", difficulty: "medium" },
  { base: "arrive", past: "arrived", sound: "d", example: "They arrived late.", difficulty: "medium" },
  { base: "describe", past: "described", sound: "d", example: "She described the picture.", difficulty: "medium" },
  { base: "follow", past: "followed", sound: "d", example: "He followed the map.", difficulty: "medium" },
  { base: "listen", past: "listened", sound: "d", example: "I listened to music.", difficulty: "medium" },
  { base: "answer", past: "answered", sound: "d", example: "She answered the phone.", difficulty: "medium" },
  { base: "remember", past: "remembered", sound: "d", example: "I remembered your name.", difficulty: "medium" },

  // Hard /d/ - tricky or less common
  { base: "explain", past: "explained", sound: "d", example: "The teacher explained.", difficulty: "hard" },
  { base: "believe", past: "believed", sound: "d", example: "Nobody believed him.", difficulty: "hard" },
  { base: "surprise", past: "surprised", sound: "d", example: "The news surprised us.", difficulty: "hard" },

  // ===== /t/ SOUND (voiceless endings) =====

  // Easy /t/ - common verbs with clear voiceless endings
  { base: "walk", past: "walked", sound: "t", example: "I walked to school.", difficulty: "easy" },
  { base: "talk", past: "talked", sound: "t", example: "We talked for hours.", difficulty: "easy" },
  { base: "help", past: "helped", sound: "t", example: "She helped her friend.", difficulty: "easy" },
  { base: "stop", past: "stopped", sound: "t", example: "The car stopped.", difficulty: "easy" },
  { base: "watch", past: "watched", sound: "t", example: "They watched TV.", difficulty: "easy" },
  { base: "wash", past: "washed", sound: "t", example: "I washed my hands.", difficulty: "easy" },
  { base: "cook", past: "cooked", sound: "t", example: "Mom cooked dinner.", difficulty: "easy" },
  { base: "look", past: "looked", sound: "t", example: "He looked at me.", difficulty: "easy" },
  { base: "kiss", past: "kissed", sound: "t", example: "Mom kissed the baby.", difficulty: "easy" },
  { base: "push", past: "pushed", sound: "t", example: "He pushed the door.", difficulty: "easy" },
  { base: "brush", past: "brushed", sound: "t", example: "I brushed my teeth.", difficulty: "easy" },

  // Medium /t/ - less obvious
  { base: "ask", past: "asked", sound: "t", example: "She asked a question.", difficulty: "medium" },
  { base: "work", past: "worked", sound: "t", example: "I worked yesterday.", difficulty: "medium" },
  { base: "laugh", past: "laughed", sound: "t", example: "They laughed a lot.", difficulty: "medium" },
  { base: "cough", past: "coughed", sound: "t", example: "He coughed loudly.", difficulty: "medium" },
  { base: "finish", past: "finished", sound: "t", example: "He finished the book.", difficulty: "medium" },
  { base: "dance", past: "danced", sound: "t", example: "We danced all night.", difficulty: "medium" },
  { base: "miss", past: "missed", sound: "t", example: "I missed the bus.", difficulty: "medium" },
  { base: "pass", past: "passed", sound: "t", example: "She passed the test.", difficulty: "medium" },
  { base: "fix", past: "fixed", sound: "t", example: "He fixed the car.", difficulty: "medium" },
  { base: "promise", past: "promised", sound: "t", example: "She promised to help.", difficulty: "medium" },
  { base: "attack", past: "attacked", sound: "t", example: "The cat attacked the toy.", difficulty: "medium" },

  // Hard /t/ - consonant clusters or tricky
  { base: "jump", past: "jumped", sound: "t", example: "The cat jumped.", difficulty: "hard" },
  { base: "mix", past: "mixed", sound: "t", example: "She mixed the ingredients.", difficulty: "hard" },
  { base: "reach", past: "reached", sound: "t", example: "We reached the top.", difficulty: "hard" },

  // ===== /ɪd/ SOUND (t/d endings - extra syllable) =====

  // Easy /ɪd/ - common verbs
  { base: "want", past: "wanted", sound: "id", example: "I wanted pizza.", difficulty: "easy" },
  { base: "need", past: "needed", sound: "id", example: "She needed help.", difficulty: "easy" },
  { base: "start", past: "started", sound: "id", example: "The movie started.", difficulty: "easy" },
  { base: "wait", past: "waited", sound: "id", example: "We waited an hour.", difficulty: "easy" },
  { base: "visit", past: "visited", sound: "id", example: "They visited Paris.", difficulty: "easy" },
  { base: "end", past: "ended", sound: "id", example: "The game ended.", difficulty: "easy" },
  { base: "shout", past: "shouted", sound: "id", example: "He shouted my name.", difficulty: "easy" },
  { base: "test", past: "tested", sound: "id", example: "She tested the pen.", difficulty: "easy" },
  { base: "vote", past: "voted", sound: "id", example: "We voted today.", difficulty: "easy" },
  { base: "hate", past: "hated", sound: "id", example: "I hated the rain.", difficulty: "easy" },
  { base: "paint", past: "painted", sound: "id", example: "She painted a picture.", difficulty: "easy" },
  { base: "land", past: "landed", sound: "id", example: "The plane landed.", difficulty: "easy" },

  // Medium /ɪd/
  { base: "decide", past: "decided", sound: "id", example: "He decided to go.", difficulty: "medium" },
  { base: "remind", past: "reminded", sound: "id", example: "She reminded me.", difficulty: "medium" },
  { base: "provide", past: "provided", sound: "id", example: "They provided food.", difficulty: "medium" },
  { base: "avoid", past: "avoided", sound: "id", example: "He avoided the question.", difficulty: "medium" },
  { base: "succeed", past: "succeeded", sound: "id", example: "She succeeded at work.", difficulty: "medium" },
  { base: "expect", past: "expected", sound: "id", example: "I expected more.", difficulty: "medium" },
  { base: "invite", past: "invited", sound: "id", example: "She invited everyone.", difficulty: "medium" },
  { base: "suggest", past: "suggested", sound: "id", example: "He suggested lunch.", difficulty: "medium" },
  { base: "count", past: "counted", sound: "id", example: "I counted the money.", difficulty: "medium" },
  { base: "print", past: "printed", sound: "id", example: "She printed the paper.", difficulty: "medium" },

  // Hard /ɪd/
  { base: "protect", past: "protected", sound: "id", example: "The dog protected us.", difficulty: "hard" },
  { base: "accept", past: "accepted", sound: "id", example: "They accepted the offer.", difficulty: "hard" },
  { base: "collect", past: "collected", sound: "id", example: "He collected stamps.", difficulty: "hard" },
];

/**
 * Get verbs filtered by difficulty
 */
export function getVerbsByDifficulty(difficulty: "easy" | "medium" | "hard" | "all"): EdVerb[] {
  if (difficulty === "all") return ED_VERBS;
  return ED_VERBS.filter((v) => v.difficulty === difficulty);
}

/**
 * Get verbs filtered by sound
 */
export function getVerbsBySound(sound: EdSound): EdVerb[] {
  return ED_VERBS.filter((v) => v.sound === sound);
}

/**
 * Shuffle an array (Fisher-Yates)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Get a balanced set of verbs for a game round.
 * Ensures roughly equal representation of each sound.
 */
export function getGameRound(
  count: number = 15,
  difficulty: "easy" | "medium" | "hard" | "mixed" = "mixed"
): EdVerb[] {
  const verbPool =
    difficulty === "mixed"
      ? ED_VERBS
      : ED_VERBS.filter((v) => v.difficulty === difficulty);

  // Get roughly equal numbers of each sound
  const perSound = Math.ceil(count / 3);

  const dVerbs = shuffleArray(verbPool.filter((v) => v.sound === "d")).slice(0, perSound);
  const tVerbs = shuffleArray(verbPool.filter((v) => v.sound === "t")).slice(0, perSound);
  const idVerbs = shuffleArray(verbPool.filter((v) => v.sound === "id")).slice(0, perSound);

  // Combine and shuffle, then trim to exact count
  const combined = shuffleArray([...dVerbs, ...tVerbs, ...idVerbs]);
  return combined.slice(0, count);
}

/**
 * Generate minimal pairs for listening discrimination.
 * Each pair is a base form and past form.
 */
export function getMinimalPairs(count: number = 10): Array<{ base: string; past: string; verb: EdVerb }> {
  const shuffled = shuffleArray(ED_VERBS);
  return shuffled.slice(0, count).map((verb) => ({
    base: verb.base,
    past: verb.past,
    verb,
  }));
}
