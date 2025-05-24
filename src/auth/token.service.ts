import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TokenService {
  constructor(private readonly prisma: PrismaService) {}

  async saveToken(data: any) {
    return this.prisma.token.create({
      data: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
        createdAt: new Date(),
      },
    });
  }

  async getLatestToken() {
    return this.prisma.token.findFirst({
      orderBy: { createdAt: 'desc' },
    });
  }
}
