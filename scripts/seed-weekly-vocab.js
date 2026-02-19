/**
 * Seed consolidated weekly vocabulary activities (Feb–Jun)
 * Creates a SINGLE consolidated activity per week combining:
 * - Word List
 * - Flash Cards
 * - Matching
 * - Fill-in-the-Blank
 *
 * Run: node scripts/seed-weekly-vocab.js
 * Or: npx tsx scripts/seed-weekly-vocab.js (if you prefer tsx)
 */

const { PrismaClient } = require("@prisma/client");
const { weeklyVocabData } = require("./weekly-vocab-data.js");

const prisma = new PrismaClient();

function getUnitNumber(slug) {
  if (slug.startsWith("feb-")) return 6;
  if (slug.startsWith("mar-")) return 7;
  if (slug.startsWith("apr-")) return 8;
  if (slug.startsWith("may-")) return 9;
  if (slug.startsWith("jun-")) return 10;
  return 6;
}

function generatePacketContent(slug, data) {
  if (!data) return {};
  const unit = getUnitNumber(slug);
  const cards = data.words.map((word) => ({
    term: word.term,
    definition: word.def,
    example: word.ex,
  }));
  return { cards };
}

function generateFlashcardContent(slug, data) {
  if (!data) return {};
  const cards = data.words.map((word) => ({
    term: word.term,
    definition: word.def,
    example: word.ex,
  }));
  return { cards };
}

function generateMatchingContent(slug, data) {
  if (!data || !data.words) return {};
  const pairs = data.words.map((w, idx) => ({
    id: idx,
    term: w.term,
    definition: w.def,
  }));
  return { pairs };
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findTermInExample(term, example) {
  if (!example) return null;
  const termLower = term.toLowerCase();
  const exLower = example.toLowerCase();
  const firstIndex = exLower.indexOf(termLower);
  if (firstIndex !== -1) {
    return { start: firstIndex, end: firstIndex + term.length, original: example.substring(firstIndex, firstIndex + term.length) };
  }
  // Try inflection-aware match for phrasal verbs (e.g. "clock out" -> "clocked out")
  const parts = term.split(/\s+/);
  if (parts.length >= 2) {
    const first = escapeRegex(parts[0]);
    const rest = parts.slice(1).join("\\s+");
    const inflectionPattern = new RegExp(`\\b(${first}(?:ed|ing|s)?)\\s+(${rest})\\b`, "i");
    const match = example.match(inflectionPattern);
    if (match) {
      const fullMatch = match[0];
      const start = exLower.indexOf(fullMatch.toLowerCase());
      return { start, end: start + fullMatch.length, original: example.substring(start, start + fullMatch.length) };
    }
  }
  return null;
}

function generateFillBlankContent(slug, data) {
  if (!data || !data.words) return {};
  const sentences = data.words.map((word, idx) => {
    const found = findTermInExample(word.term, word.ex);
    let sentence;
    if (found && word.ex) {
      const before = word.ex.substring(0, found.start);
      const after = word.ex.substring(found.end);
      sentence = before + "_____" + after;
    } else {
      sentence = `Fill in the blank: ${word.term} means ${word.def}.`;
    }
    const availableWords = data.words.filter((w) => w.term !== word.term);
    const numWrong = Math.min(3, availableWords.length);
    const wrongOptions = availableWords
      .sort(() => 0.5 - Math.random())
      .slice(0, numWrong)
      .map((w) => w.term);
    const allOptions = [word.term, ...wrongOptions].sort(() => 0.5 - Math.random());
    return {
      id: `sentence-${idx}`,
      text: sentence,
      blanks: [word.term],
      correctAnswers: [word.term],
      options: allOptions,
      explanation: word.def,
    };
  });
  return { sentences };
}

const monthNames = {
  'feb': 'February',
  'mar': 'March',
  'apr': 'April',
  'may': 'May',
  'jun': 'June'
};

function formatWeek(slug) {
  const parts = slug.split('-');
  const m1 = monthNames[parts[0]];
  if (parts.length === 3) {
    return `${m1} ${parts[1]}–${parts[2]}`;
  } else if (parts.length === 4) {
    const m2 = monthNames[parts[2]];
    return `${m1} ${parts[1]} – ${m2} ${parts[3]}`;
  }
  return slug;
}

async function main() {
  const oldMonthlyIds = ["february", "march", "april", "may"];
  const idsToDelete = [];
  for (const month of oldMonthlyIds) {
    idsToDelete.push(`vocab-${month}-packet`);
    idsToDelete.push(`vocab-${month}-flashcards`);
    idsToDelete.push(`vocab-${month}-matching`);
    idsToDelete.push(`vocab-${month}-fillblank`);
  }

  const deleted = await prisma.activity.deleteMany({
    where: { id: { in: idsToDelete } },
  });
  console.log(`Deleted ${deleted.count} old monthly vocab activities.`);

  const slugs = Object.keys(weeklyVocabData);
  for (const slug of slugs) {
    const data = weeklyVocabData[slug];
    if (!data || !data.words || data.words.length === 0) {
      console.warn(`Skipping ${slug}: no words.`);
      continue;
    }

    const unit = getUnitNumber(slug);
    const wordList = data.words.map((w) => w.term).join(", ");
    const fullWeek = formatWeek(slug);
    const activityId = `vocab-${slug}`;
    const title = `Unit ${unit}: ${fullWeek}`;

    // Generate content for all 4 vocabulary types
    const consolidatedContent = {
      type: "vocabulary",
      wordList: generatePacketContent(slug, data),
      flashcards: generateFlashcardContent(slug, data),
      matching: generateMatchingContent(slug, data),
      fillInBlank: generateFillBlankContent(slug, data),
    };

    // Create or update single consolidated activity
    await prisma.activity.upsert({
      where: { id: activityId },
      update: {
        title,
        category: "Vocab",
        type: "vocabulary",
        description: `Unit ${unit} vocabulary: ${data.topic}. ${wordList}`,
        content: JSON.stringify(consolidatedContent),
      },
      create: {
        id: activityId,
        title,
        category: "Vocab",
        type: "vocabulary",
        level: "intermediate",
        description: `Unit ${unit} vocabulary: ${data.topic}. ${wordList}`,
        content: JSON.stringify(consolidatedContent),
      },
    });

    console.log(`✓ ${slug} (Unit ${unit}): ${data.topic} — ${data.words.length} words`);
  }

  console.log(`\n✅ Created/updated ${slugs.length} consolidated weekly vocab activities.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
