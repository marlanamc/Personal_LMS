import { PrismaClient } from '@prisma/client';
import { modalsHealthAdviceCautionConsentContent } from '../src/content/grammar/modals-health-advice-caution-consent';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Modals for Health: Advice, Caution & Consent grammar guide...');

  await prisma.activity.upsert({
    where: { id: "modals-health-advice-caution-consent" },
    update: {
      content: JSON.stringify(modalsHealthAdviceCautionConsentContent),
      title: "Modals for Health: Advice, Caution & Consent Guide",
      type: "guide",
      category: "grammar",
      description: "Master health modals: should/shouldn't (advice), must/must not (caution), can/may/are allowed to (consent). Learn to follow medical instructions, understand warnings, and exercise patient rights.",
    },
    create: {
      id: "modals-health-advice-caution-consent",
      title: "Modals for Health: Advice, Caution & Consent Guide",
      type: "guide",
      category: "grammar",
      content: JSON.stringify(modalsHealthAdviceCautionConsentContent),
      description: "Master health modals: should/shouldn't (advice), must/must not (caution), can/may/are allowed to (consent). Learn to follow medical instructions, understand warnings, and exercise patient rights.",
    },
  });

  console.log('✅ Modals for Health: Advice, Caution & Consent guide seeded successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
