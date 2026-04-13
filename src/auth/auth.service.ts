import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: AuthDto) {
    const hash = await bcrypt.hash(dto.password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
        },
      });

      return user;
    } catch (error) {
      throw new ForbiddenException('Email already exists');
    }
  }

  async login(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    const pwMatches = await bcrypt.compare(dto.password, user.password);

    if (!pwMatches) {
      throw new ForbiddenException('Invalid credentials');
    }

    return this.signToken(user.id, user.email);
  }

  async signToken(userId: string, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jwt.signAsync(payload);

    return {
      access_token: token,
    };
  }
}