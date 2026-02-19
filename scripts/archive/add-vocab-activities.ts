import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const vocabActivities = [
  {
    id: "vocab-september-packet",
    title: "Unit 1: Word List",
    description: "ESOL 3 monthly vocabulary set: background, registration, vocational, motivation, transition, immigration, commitment, barrier, opportunity, qualification.",
  },
  {
    id: "vocab-october",
    title: "Vocabulary — October (Daily Life in the Community)",
    description: "ESOL 3 monthly vocabulary set: obstacle, reliable, beneficial, harmful, distraction, concentrate, improve, go over, outgoing, reserved.",
  },
  {
    id: "vocab-november",
    title: "Vocabulary — November (Community Participation)",
    description: "ESOL 3 monthly vocabulary set: waived, tab, errands, navigate, urgently, fundraiser, courthouse, entry-level, affordable, relocate, donation, recognized, permits, local government, job training.",
  },
  {
    id: "vocab-december",
    title: "Vocabulary — December (Consumer Smarts)",
    description: "ESOL 3 monthly vocabulary set: installation, included, disadvantages, refund, scam, warranty, expire, outlet, installments, commission, promotion, reliable, features, brand, service provider.",
  },
  {
    id: "vocab-january",
    title: "Vocabulary — January (Housing)",
    description: "ESOL 3 monthly vocabulary set: spacious, deposit, utilities, tenant, landlord, equivalent, stable, lease, property, maintenance, inspect, maintain, vacant.",
  },
  {
    id: "vocab-february",
    title: "Vocabulary — February (Workforce Preparation)",
    description: "ESOL 3 monthly vocabulary set: under pressure, fast-paced, environment, prior, detail-oriented, fluent, preferences, role, self-confidence, enthusiasm.",
  },
  {
    id: "vocab-march",
    title: "Vocabulary — March (Career Awareness)",
    description: "ESOL 3 monthly vocabulary set: behavior, criticize, ambitious, courtesy, strict, gross pay, deductions, coordinate, recruit, take on.",
  },
  {
    id: "vocab-april",
    title: "Vocabulary — April (Health)",
    description: "ESOL 3 monthly vocabulary set: infected, depressed, inflamed, pediatrician, cardiologist, bladder, liver, kidneys, pancreas, joints, arteries, muscles, bones, stroke, arthritis.",
  },
  {
    id: "vocab-may",
    title: "Vocabulary — May (Holistic Wellness)",
    description: "ESOL 3 monthly vocabulary set: addiction, self-esteem, sustain, recreational, well-being, regimen, hydration, moderation, coping skills, burnout, nerves, mind, hiking, hobby, detox.",
  },
  {
    id: "vocab-june",
    title: "Vocabulary — June (Future Academic Goals)",
    description: "ESOL 3 monthly vocabulary set: personal growth, networking, decision-making, professional development.",
  },
];

async function main() {
  for (const activity of vocabActivities) {
    await prisma.activity.upsert({
      where: { id: activity.id },
      create: {
        id: activity.id,
        title: activity.title,
        description: activity.description,
        type: "resource",
        category: "vocab",
        level: "intermediate",
        content: activity.description,
      },
      update: {
        title: activity.title,
        description: activity.description,
        category: "vocab",
        type: "resource",
        level: "intermediate",
        content: activity.description,
      },
    });
  }
  console.log(`Upserted ${vocabActivities.length} vocabulary activities.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

