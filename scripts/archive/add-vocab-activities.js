const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const months = [
  {
    id: "september",
    label: "September",
    subtitle: "Getting to Know You",
    words: [
      "background",
      "registration",
      "vocational",
      "motivation",
      "transition",
      "immigration",
      "commitment",
      "barrier",
      "opportunity",
      "qualification",
    ],
  },
  {
    id: "october",
    label: "October",
    subtitle: "Daily Life in the Community",
    words: [
      "obstacle",
      "reliable",
      "beneficial",
      "harmful",
      "distraction",
      "concentrate",
      "improve",
      "go over",
      "outgoing",
      "reserved",
    ],
  },
  {
    id: "november",
    label: "November",
    subtitle: "Community Participation",
    words: [
      "waived",
      "tab",
      "errands",
      "navigate",
      "urgently",
      "fundraiser",
      "courthouse",
      "entry-level",
      "affordable",
      "relocate",
      "donation",
      "recognized",
      "permits",
      "local government",
      "job training",
    ],
  },
  {
    id: "december",
    label: "December",
    subtitle: "Consumer Smarts",
    words: [
      "installation",
      "included",
      "disadvantages",
      "refund",
      "scam",
      "warranty",
      "expire",
      "outlet",
      "installments",
      "commission",
      "promotion",
      "reliable",
      "features",
      "brand",
      "service provider",
    ],
  },
  {
    id: "january",
    label: "January",
    subtitle: "Housing",
    words: [
      "spacious",
      "deposit",
      "utilities",
      "tenant",
      "landlord",
      "equivalent",
      "stable",
      "lease",
      "property",
      "maintenance",
      "inspect",
      "maintain",
      "vacant",
    ],
  },
  {
    id: "february",
    label: "February",
    subtitle: "Workforce Preparation",
    words: [
      "under pressure",
      "fast-paced",
      "environment",
      "prior",
      "detail-oriented",
      "fluent",
      "preferences",
      "role",
      "self-confidence",
      "enthusiasm",
    ],
  },
  {
    id: "march",
    label: "March",
    subtitle: "Career Awareness",
    words: [
      "behavior",
      "criticize",
      "ambitious",
      "courtesy",
      "strict",
      "gross pay",
      "deductions",
      "coordinate",
      "recruit",
      "take on",
    ],
  },
  {
    id: "april",
    label: "April",
    subtitle: "Health",
    words: [
      "infected",
      "depressed",
      "inflamed",
      "pediatrician",
      "cardiologist",
      "bladder",
      "liver",
      "kidneys",
      "pancreas",
      "joints",
      "arteries",
      "muscles",
      "bones",
      "stroke",
      "arthritis",
    ],
  },
  {
    id: "may",
    label: "May",
    subtitle: "Holistic Wellness",
    words: [
      "addiction",
      "self-esteem",
      "sustain",
      "recreational",
      "well-being",
      "regimen",
      "hydration",
      "moderation",
      "coping skills",
      "burnout",
      "nerves",
      "mind",
      "hiking",
      "hobby",
      "detox",
    ],
  },
  {
    id: "june",
    label: "June",
    subtitle: "Future Academic Goals",
    words: [
      "personal growth",
      "networking",
      "decision-making",
      "professional development",
    ],
  },
];

const vocabActivities = months.flatMap((month, idx) => {
  const baseDate = new Date(2024, idx, 1).toISOString();
  const vocabDescription = `ESOL 3 monthly vocabulary set (${month.label} — ${month.subtitle}): ${month.words.join(
    ", "
  )}.`;

  return [
    {
      id: `vocab-${month.id}-packet`,
      title: `Vocabulary — ${month.label} (${month.subtitle})`,
      description: vocabDescription,
      createdAt: baseDate,
      kind: "packet",
    },
    {
      id: `vocab-${month.id}-flashcards`,
      title: `Flash Cards — ${month.label} (${month.subtitle})`,
      description: `Flash cards practice for ${month.label} (${month.subtitle}) vocabulary: ${month.words.join(
        ", "
      )}.`,
      createdAt: baseDate,
      kind: "flashcards",
    },
  ];
});

async function main() {
  for (const activity of vocabActivities) {
    await prisma.activity.upsert({
      where: { id: activity.id },
      create: {
        id: activity.id,
        title: activity.title,
        description: activity.description,
        type: activity.kind === "flashcards" ? "game" : "resource",
        category: "vocab",
        level: "intermediate",
        content: activity.description,
        createdAt: activity.createdAt ? new Date(activity.createdAt) : undefined,
      },
      update: {
        title: activity.title,
        description: activity.description,
        category: "vocab",
        type: activity.kind === "flashcards" ? "game" : "resource",
        level: "intermediate",
        content: activity.description,
      },
    });
  }
  console.log(`Upserted ${vocabActivities.length} vocabulary activities (packets + flash cards).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

