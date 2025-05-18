"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async signIn(username, pass) {
        console.log(`Attempting login for username: ${username}, password: ${pass}`);
        const user = await this.prisma.user.findUnique({ where: { username } });
        if (!user) {
            console.log(`User ${username} not found in database`);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        console.log(`User found: ${JSON.stringify(user, null, 2)}`);
        console.log(`Stored hashed password for ${username}: ${user.password}`);
        const isPasswordValid = await bcrypt.compare(pass, user.password);
        console.log(`Password comparison result for ${username}: ${isPasswordValid}`);
        if (!isPasswordValid) {
            console.log(`Password mismatch for user ${username}`);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: user.id, username: user.username, role: user.role };
        const token = await this.jwtService.signAsync(payload);
        console.log(`Generated token for ${username}: ${token}`);
        return { access_token: token };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map