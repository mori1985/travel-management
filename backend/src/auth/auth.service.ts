import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<{ access_token: string }> {
    console.log(`Attempting login for username: ${username}, password: ${pass}`);
    
    // پیدا کردن کاربر
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) {
      console.log(`User ${username} not found in database`);
      throw new UnauthorizedException('Invalid credentials');
    }
    console.log(`User found: ${JSON.stringify(user, null, 2)}`);
    console.log(`Stored hashed password for ${username}: ${user.password}`);

    // چک کردن رمز عبور
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    console.log(`Password comparison result for ${username}: ${isPasswordValid}`);
    if (!isPasswordValid) {
      console.log(`Password mismatch for user ${username}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // تولید توکن
    const payload = { sub: user.id, username: user.username, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    console.log(`Generated token for ${username}: ${token}`);
    return { access_token: token };
  }
}