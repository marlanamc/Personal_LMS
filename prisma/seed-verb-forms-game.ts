import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const teacher = await prisma.user.findFirst({
    where: { role: 'teacher' }
  });

  if (!teacher) {
    console.error('Teacher user not found. Please run main seed first.');
    return;
  }

  const csvContent = `V1,V1-3rd,V1-ing,V2,V3,Irregular
be,is,being,was,been,Yes
have,has,having,had,had,Yes
do,does,doing,did,done,Yes
say,says,saying,said,said,Yes
go,goes,going,went,gone,Yes
get,gets,getting,got,gotten,Yes
make,makes,making,made,made,Yes
know,knows,knowing,knew,known,Yes
think,thinks,thinking,thought,thought,Yes
take,takes,taking,took,taken,Yes
see,sees,seeing,saw,seen,Yes
come,comes,coming,came,come,Yes
want,wants,wanting,wanted,wanted,No
use,uses,using,used,used,No
find,finds,finding,found,found,Yes
give,gives,giving,gave,given,Yes
tell,tells,telling,told,told,Yes
work,works,working,worked,worked,No
call,calls,calling,called,called,No
try,tries,trying,tried,tried,No`;

  const activity = await prisma.activity.upsert({
    where: { id: 'verb-forms-challenge' },
    update: {
      title: 'Verb Forms Challenge',
      description: 'Master the different forms of common English verbs. Practice V1, V1-3rd, V1-ing, V2, and V3 forms with this interactive game!',
      type: 'game',
      category: 'games',
      ui: 'verb-forms',
      level: 'intermediate',
      content: csvContent,
      isReleased: true,
    },
    create: {
      id: 'verb-forms-challenge',
      title: 'Verb Forms Challenge',
      description: 'Master the different forms of common English verbs. Practice V1, V1-3rd, V1-ing, V2, and V3 forms with this interactive game!',
      type: 'game',
      category: 'games',
      ui: 'verb-forms',
      level: 'intermediate',
      content: csvContent,
      createdBy: teacher.id,
      isReleased: true,
    }
  });

  console.log(`✅ Verb Forms Challenge activity ${activity.id} seeded/updated.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
