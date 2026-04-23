import { addDays, startOfWeek } from 'date-fns';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  try {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 0 });
    const weekEndExclusive = addDays(weekStart, 7);
    
    console.log("Date range:", { gte: weekStart, lt: weekEndExclusive });
    
    // We don't have a real userId, so just query all to see if the query structure works
    const wins = await prisma.dailyWin.findMany({
      where: {
        createdAt: {
          gte: weekStart,
          lt: weekEndExclusive,
        },
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        text: true,
        createdAt: true,
      },
    });
    console.log("Success:", wins);
  } catch(e) {
    console.error("Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}
test();
