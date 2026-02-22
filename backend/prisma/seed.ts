import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: process.env.SEED_ADMIN_EMAIL,
      passwordHash: await bcrypt.hash('admin_password', 12), // Default password for seed
      role: 'admin',
    },
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());