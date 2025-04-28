import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('test123', 10); // رمز: test123
  await prisma.user.upsert({
    where: { username: 'testuser' },
    update: {},
    create: {
      username: 'testuser',
      password,
      role: 'admin',
    },
  });
  console.log('User created or updated: testuser');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
