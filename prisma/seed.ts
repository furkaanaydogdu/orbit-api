import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.user.create({
    data: {
      email: 'seller@example.com',
      password: 'hashed_password_here',
      role: 'SELLER',
    },
  });
  console.log('Seed complete.');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
