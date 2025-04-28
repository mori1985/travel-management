"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    const password = await bcrypt.hash('test123', 10);
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
//# sourceMappingURL=seed.js.map