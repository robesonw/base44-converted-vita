import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminUser = await prisma.user.create({
    data: {
      email: process.env.SEED_ADMIN_EMAIL,
      passwordHash: await bcrypt.hash('adminpass', 12),
      role: 'admin'
    }
  });
  console.log({ adminUser });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });