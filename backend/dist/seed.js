const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();
function generateRandom5DigitPassword() {
    return Math.floor(10000 + Math.random() * 90000).toString();
}
async function main() {
    try {
        await prisma.$connect();
        console.log('Connected to database successfully');
        await prisma.passenger.deleteMany();
        console.log('Cleared all passengers');
        await prisma.user.deleteMany();
        console.log('Cleared all existing users');
        const level1Users = Array.from({ length: 12 }, (_, i) => ({
            username: `level1user${i + 1}`,
            password: generateRandom5DigitPassword(),
            role: 'level1',
        }));
        const level2Users = Array.from({ length: 3 }, (_, i) => ({
            username: `level2user${i + 1}`,
            password: generateRandom5DigitPassword(),
            role: 'level2',
        }));
        const adminUser = [
            {
                username: 'adminuser',
                password: '19088',
                role: 'admin',
            },
        ];
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
    }
    catch (error) {
        console.error('Error during seeding:', error);
    }
    finally {
        await prisma.$disconnect();
        console.log('Database connection closed');
    }
}
main();
//# sourceMappingURL=seed.js.map