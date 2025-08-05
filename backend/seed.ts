const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// تابع برای تولید رمز ۵ رقمی رندم
function generateRandom5DigitPassword() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

async function main() {
  try {
    // چک کردن اتصال به دیتابیس
    await prisma.$connect();
    console.log('Connected to database successfully');

    // پاک کردن مسافرها و سپس کاربرها برای جلوگیری از نقض قید خارجی
    await prisma.passenger.deleteMany();
    console.log('Cleared all passengers');
    await prisma.user.deleteMany();
    console.log('Cleared all existing users');

    // لیست کاربران سطح ۱ (۱۲ کاربر)
    const level1Users = Array.from({ length: 12 }, (_, i) => ({
      username: `level1user${i + 1}`,
      password: generateRandom5DigitPassword(), // رمز رندم برای هر کاربر
      role: 'level1',
    }));

    // لیست کاربران سطح ۲ (۳ کاربر)
    const level2Users = Array.from({ length: 3 }, (_, i) => ({
      username: `level2user${i + 1}`,
      password: generateRandom5DigitPassword(), // رمز رندم برای هر کاربر
      role: 'level2',
    }));

    // ادمین (۱ کاربر با رمز ثابت)
    const adminUser = [
      {
        username: 'adminuser',
        password: '19088', // رمز ثابت برای ادمین
        role: 'admin',
      },
    ];

    // ساخت کاربران سطح ۱
    for (const user of level1Users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await prisma.user.upsert({
        where: { username: user.username },
        update: {},
        create: {
          username: user.username,
          password: hashedPassword,
          role: user.role,
          createdAt: new Date(),
        },
      });
      console.log(`Created ${user.username} with password: ${user.password}`);
    }

    // ساخت کاربران سطح ۲
    for (const user of level2Users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await prisma.user.upsert({
        where: { username: user.username },
        update: {},
        create: {
          username: user.username,
          password: hashedPassword,
          role: user.role,
          createdAt: new Date(),
        },
      });
      console.log(`Created ${user.username} with password: ${user.password}`);
    }

    // ساخت ادمین
    for (const user of adminUser) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await prisma.user.upsert({
        where: { username: user.username },
        update: {},
        create: {
          username: user.username,
          password: hashedPassword,
          role: user.role,
          createdAt: new Date(),
        },
      });
      console.log(`Created ${user.username} with password: ${user.password}`);
    }

    console.log('All users seeded successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
    console.log('Database connection closed');
  }
}

main();
