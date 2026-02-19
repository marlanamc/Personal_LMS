import { PrismaClient } from '@prisma/client';
import { modalsObligationPermissionContent } from '../src/content/grammar/modals-obligation-permission';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Modals for Obligation & Permission grammar guide...');

  await prisma.activity.upsert({
    where: { id: "modals-obligation-permission" },
    update: {
      content: JSON.stringify(modalsObligationPermissionContent),
      title: "Modals for Obligation & Permission Guide",
      type: "guide",
      category: "grammar",
      description: "Master workplace modals: must, have to, can, may, could, should. Learn politeness levels for professional communication.",
    },
    create: {
      id: "modals-obligation-permission",
      title: "Modals for Obligation & Permission Guide",
      type: "guide",
      category: "grammar",
      content: JSON.stringify(modalsObligationPermissionContent),
      description: "Master workplace modals: must, have to, can, may, could, should. Learn politeness levels for professional communication.",
    },
  });

  console.log('✅ Modals for Obligation & Permission guide seeded successfully!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
