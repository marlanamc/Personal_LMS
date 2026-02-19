export type MinimalPairSide = "left" | "right";
export type MinimalPairDifficulty = "easy" | "medium" | "hard";

export interface MinimalPair {
  leftWord: string;
  rightWord: string;
  leftIpa: string;
  rightIpa: string;
  difficulty: MinimalPairDifficulty;
}

export interface MinimalPairContrast {
  id: string;
  label: string;
  description: string;
  spanishTip: string;
  pairs: MinimalPair[];
}

export const MINIMAL_PAIR_CONTRASTS = [
  {
    id: "short-i-long-e",
    label: "Short i vs Long e",
    description: "Hear the difference between /I/ and /iː/ (sit vs seat).",
    spanishTip: "In Spanish this contrast is close to one sound, so stretch /iː/ longer in words like seat.",
    pairs: [
      { leftWord: "sit", rightWord: "seat", leftIpa: "/sIt/", rightIpa: "/siːt/", difficulty: "easy" },
      { leftWord: "ship", rightWord: "sheep", leftIpa: "/SIp/", rightIpa: "/Siːp/", difficulty: "easy" },
      { leftWord: "bit", rightWord: "beat", leftIpa: "/bIt/", rightIpa: "/biːt/", difficulty: "easy" },
      { leftWord: "hit", rightWord: "heat", leftIpa: "/hIt/", rightIpa: "/hiːt/", difficulty: "easy" },
      { leftWord: "fill", rightWord: "feel", leftIpa: "/fIl/", rightIpa: "/fiːl/", difficulty: "medium" },
      { leftWord: "live", rightWord: "leave", leftIpa: "/lIv/", rightIpa: "/liːv/", difficulty: "medium" },
      { leftWord: "chip", rightWord: "cheap", leftIpa: "/tSIp/", rightIpa: "/tSiːp/", difficulty: "medium" },
      { leftWord: "slip", rightWord: "sleep", leftIpa: "/slIp/", rightIpa: "/sliːp/", difficulty: "medium" },
      { leftWord: "lick", rightWord: "leak", leftIpa: "/lIk/", rightIpa: "/liːk/", difficulty: "hard" },
      { leftWord: "pill", rightWord: "peel", leftIpa: "/pIl/", rightIpa: "/piːl/", difficulty: "hard" },
    ],
  },
  {
    id: "b-v",
    label: "B vs V",
    description: "Differentiate /b/ and /v/ at the start of words.",
    spanishTip: "Press top teeth to lower lip for /v/. Do not close both lips like /b/.",
    pairs: [
      { leftWord: "ban", rightWord: "van", leftIpa: "/bæn/", rightIpa: "/væn/", difficulty: "easy" },
      { leftWord: "bet", rightWord: "vet", leftIpa: "/bet/", rightIpa: "/vet/", difficulty: "easy" },
      { leftWord: "best", rightWord: "vest", leftIpa: "/best/", rightIpa: "/vest/", difficulty: "easy" },
      { leftWord: "bat", rightWord: "vat", leftIpa: "/bæt/", rightIpa: "/væt/", difficulty: "easy" },
      { leftWord: "boat", rightWord: "vote", leftIpa: "/boʊt/", rightIpa: "/voʊt/", difficulty: "medium" },
      { leftWord: "base", rightWord: "vase", leftIpa: "/beɪs/", rightIpa: "/veɪs/", difficulty: "medium" },
      { leftWord: "berry", rightWord: "very", leftIpa: "/ˈberi/", rightIpa: "/ˈveri/", difficulty: "medium" },
      { leftWord: "bow", rightWord: "vow", leftIpa: "/baʊ/", rightIpa: "/vaʊ/", difficulty: "hard" },
      { leftWord: "robe", rightWord: "rove", leftIpa: "/roʊb/", rightIpa: "/roʊv/", difficulty: "hard" },
      { leftWord: "bowl", rightWord: "vole", leftIpa: "/boʊl/", rightIpa: "/voʊl/", difficulty: "hard" },
    ],
  },
  {
    id: "r-l",
    label: "R vs L",
    description: "Hear /r/ and /l/ clearly in common words.",
    spanishTip: "Keep tongue away from the roof for English /r/. Touch the roof behind teeth for /l/.",
    pairs: [
      { leftWord: "rice", rightWord: "lice", leftIpa: "/raɪs/", rightIpa: "/laɪs/", difficulty: "easy" },
      { leftWord: "right", rightWord: "light", leftIpa: "/raɪt/", rightIpa: "/laɪt/", difficulty: "easy" },
      { leftWord: "road", rightWord: "load", leftIpa: "/roʊd/", rightIpa: "/loʊd/", difficulty: "easy" },
      { leftWord: "rock", rightWord: "lock", leftIpa: "/rɑk/", rightIpa: "/lɑk/", difficulty: "easy" },
      { leftWord: "fry", rightWord: "fly", leftIpa: "/fraɪ/", rightIpa: "/flaɪ/", difficulty: "medium" },
      { leftWord: "grass", rightWord: "glass", leftIpa: "/græs/", rightIpa: "/glæs/", difficulty: "medium" },
      { leftWord: "pray", rightWord: "play", leftIpa: "/preɪ/", rightIpa: "/pleɪ/", difficulty: "medium" },
      { leftWord: "crime", rightWord: "climb", leftIpa: "/kraɪm/", rightIpa: "/klaɪm/", difficulty: "hard" },
      { leftWord: "red", rightWord: "led", leftIpa: "/red/", rightIpa: "/led/", difficulty: "hard" },
      { leftWord: "correct", rightWord: "collect", leftIpa: "/kəˈrekt/", rightIpa: "/kəˈlekt/", difficulty: "hard" },
    ],
  },
  {
    id: "sh-ch",
    label: "Sh vs Ch",
    description: "Discriminate /S/ and /tS/ (ship vs chip).",
    spanishTip: "For /ch/, release with a small stop + burst. For /sh/, keep a smooth fricative.",
    pairs: [
      { leftWord: "ship", rightWord: "chip", leftIpa: "/SIp/", rightIpa: "/tSIp/", difficulty: "easy" },
      { leftWord: "shop", rightWord: "chop", leftIpa: "/Sɑp/", rightIpa: "/tSɑp/", difficulty: "easy" },
      { leftWord: "cash", rightWord: "catch", leftIpa: "/kæS/", rightIpa: "/kætS/", difficulty: "easy" },
      { leftWord: "mash", rightWord: "match", leftIpa: "/mæS/", rightIpa: "/mætS/", difficulty: "easy" },
      { leftWord: "sheep", rightWord: "cheap", leftIpa: "/Siːp/", rightIpa: "/tSiːp/", difficulty: "medium" },
      { leftWord: "share", rightWord: "chair", leftIpa: "/Ser/", rightIpa: "/tSer/", difficulty: "medium" },
      { leftWord: "wash", rightWord: "watch", leftIpa: "/wɑS/", rightIpa: "/wɑtS/", difficulty: "medium" },
      { leftWord: "wish", rightWord: "which", leftIpa: "/wIS/", rightIpa: "/wItS/", difficulty: "hard" },
      { leftWord: "sheer", rightWord: "cheer", leftIpa: "/SIr/", rightIpa: "/tSIr/", difficulty: "hard" },
      { leftWord: "shin", rightWord: "chin", leftIpa: "/SIn/", rightIpa: "/tSIn/", difficulty: "hard" },
    ],
  },
  {
    id: "s-th",
    label: "S vs Th",
    description: "Distinguish between /s/ and /θ/ (sink vs think).",
    spanishTip: "For 'th', stick your tongue tip slightly between your teeth. For 's', keep tongue inside.",
    pairs: [
      { leftWord: "sink", rightWord: "think", leftIpa: "/sɪŋk/", rightIpa: "/θɪŋk/", difficulty: "easy" },
      { leftWord: "sick", rightWord: "thick", leftIpa: "/sɪk/", rightIpa: "/θɪk/", difficulty: "easy" },
      { leftWord: "sum", rightWord: "thumb", leftIpa: "/sʌm/", rightIpa: "/θʌm/", difficulty: "easy" },
      { leftWord: "pass", rightWord: "path", leftIpa: "/pæs/", rightIpa: "/pæθ/", difficulty: "medium" },
      { leftWord: "mouse", rightWord: "mouth", leftIpa: "/maʊs/", rightIpa: "/maʊθ/", difficulty: "medium" },
      { leftWord: "face", rightWord: "faith", leftIpa: "/feɪs/", rightIpa: "/feɪθ/", difficulty: "medium" },
      { leftWord: "miss", rightWord: "myth", leftIpa: "/mɪs/", rightIpa: "/mɪθ/", difficulty: "hard" },
      { leftWord: "sought", rightWord: "thought", leftIpa: "/sɔːt/", rightIpa: "/θɔːt/", difficulty: "hard" },
    ],
  },
  {
    id: "v-w",
    label: "V vs W",
    description: "Contrast /v/ (friction) and /w/ (glide).",
    spanishTip: "For /v/, bite your lip slightly. For /w/, round your lips like a kiss.",
    pairs: [
      { leftWord: "vet", rightWord: "wet", leftIpa: "/vet/", rightIpa: "/wet/", difficulty: "easy" },
      { leftWord: "vest", rightWord: "west", leftIpa: "/vest/", rightIpa: "/west/", difficulty: "easy" },
      { leftWord: "vine", rightWord: "wine", leftIpa: "/vaɪn/", rightIpa: "/waɪn/", difficulty: "easy" },
      { leftWord: "vent", rightWord: "went", leftIpa: "/vent/", rightIpa: "/went/", difficulty: "medium" },
      { leftWord: "veil", rightWord: "whale", leftIpa: "/veɪl/", rightIpa: "/weɪl/", difficulty: "medium" },
      { leftWord: "vow", rightWord: "wow", leftIpa: "/vaʊ/", rightIpa: "/waʊ/", difficulty: "hard" },
      { leftWord: "rover", rightWord: "rower", leftIpa: "/ˈroʊvər/", rightIpa: "/ˈroʊər/", difficulty: "hard" },
    ],
  },
  {
    id: "p-b",
    label: "P vs B",
    description: "Hear the difference between voiceless /p/ and voiced /b/.",
    spanishTip: "/p/ has a puff of air (explosion). /b/ has vibration in the throat.",
    pairs: [
      { leftWord: "pat", rightWord: "bat", leftIpa: "/pæt/", rightIpa: "/bæt/", difficulty: "easy" },
      { leftWord: "pack", rightWord: "back", leftIpa: "/pæk/", rightIpa: "/bæk/", difficulty: "easy" },
      { leftWord: "cap", rightWord: "cab", leftIpa: "/kæp/", rightIpa: "/kæb/", difficulty: "easy" },
      { leftWord: "pay", rightWord: "bay", leftIpa: "/peɪ/", rightIpa: "/beɪ/", difficulty: "easy" },
      { leftWord: "rope", rightWord: "robe", leftIpa: "/roʊp/", rightIpa: "/roʊb/", difficulty: "medium" },
      { leftWord: "cup", rightWord: "cub", leftIpa: "/kʌp/", rightIpa: "/kʌb/", difficulty: "medium" },
      { leftWord: "staple", rightWord: "stable", leftIpa: "/ˈsteɪpəl/", rightIpa: "/ˈsteɪbəl/", difficulty: "hard" },
      { leftWord: "pear", rightWord: "bear", leftIpa: "/per/", rightIpa: "/ber/", difficulty: "medium" },
    ],
  },
] as const satisfies MinimalPairContrast[];

export type MinimalPairContrastId = (typeof MINIMAL_PAIR_CONTRASTS)[number]["id"];

export interface MinimalPairQuestion {
  contrastId: MinimalPairContrastId;
  contrastLabel: string;
  pair: MinimalPair;
  targetSide: MinimalPairSide;
}

export interface MinimalPairRoundOptions {
  contrastId?: MinimalPairContrastId | "mixed";
  difficulty?: MinimalPairDifficulty | "mixed";
  roundSize?: number;
}

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getCandidatePairs(options: MinimalPairRoundOptions) {
  const selectedContrast = options.contrastId ?? "mixed";
  const selectedDifficulty = options.difficulty ?? "mixed";

  const contrasts = selectedContrast === "mixed"
    ? MINIMAL_PAIR_CONTRASTS
    : MINIMAL_PAIR_CONTRASTS.filter((contrast) => contrast.id === selectedContrast);

  return contrasts.flatMap((contrast) => {
    const pairs = selectedDifficulty === "mixed"
      ? contrast.pairs
      : contrast.pairs.filter((pair) => pair.difficulty === selectedDifficulty);

    return pairs.map((pair) => ({
      contrastId: contrast.id,
      contrastLabel: contrast.label,
      pair,
    }));
  });
}

export function getMinimalPairsRound(options: MinimalPairRoundOptions = {}): MinimalPairQuestion[] {
  const roundSize = options.roundSize ?? 12;
  const selectedContrast = options.contrastId ?? "mixed";
  const candidates = getCandidatePairs(options);
  if (candidates.length === 0) return [];

  if (selectedContrast !== "mixed") {
    return shuffleArray(candidates)
      .slice(0, roundSize)
      .map((item) => ({
        ...item,
        targetSide: Math.random() > 0.5 ? "left" : "right",
      }));
  }

  // Mixed mode: guarantee at least one item from each contrast when possible.
  const byContrast = new Map<MinimalPairContrastId, Array<(typeof candidates)[number]>>();
  for (const candidate of candidates) {
    const existing = byContrast.get(candidate.contrastId as MinimalPairContrastId) ?? [];
    existing.push(candidate);
    byContrast.set(candidate.contrastId as MinimalPairContrastId, existing);
  }

  const picks: Array<(typeof candidates)[number]> = [];
  for (const [, bucket] of byContrast) {
    if (picks.length >= roundSize) break;
    picks.push(shuffleArray(bucket)[0]!);
  }

  const pickedKeys = new Set(
    picks.map((item) => `${item.contrastId}:${item.pair.leftWord}:${item.pair.rightWord}`)
  );
  const remaining = shuffleArray(
    candidates.filter(
      (item) => !pickedKeys.has(`${item.contrastId}:${item.pair.leftWord}:${item.pair.rightWord}`)
    )
  );

  for (const item of remaining) {
    if (picks.length >= roundSize) break;
    picks.push(item);
  }

  return shuffleArray(picks).map((item) => ({
    ...item,
    targetSide: Math.random() > 0.5 ? "left" : "right",
  }));
}

export function getAllMinimalPairWords(): string[] {
  const words = new Set<string>();
  for (const contrast of MINIMAL_PAIR_CONTRASTS) {
    for (const pair of contrast.pairs) {
      words.add(pair.leftWord);
      words.add(pair.rightWord);
    }
  }
  return Array.from(words).sort();
}
