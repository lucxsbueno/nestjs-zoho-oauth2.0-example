import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TokenService {
  constructor(private readonly prisma: PrismaService) {}

  async saveToken(data: any) {
    try {
      const { access_token, refresh_token, expires_in } = data;

      // Se não tiver refresh_token na resposta, busca o último refresh token válido
      let finalRefreshToken = refresh_token;

      if (!finalRefreshToken) {
        const latestToken = await this.getLatestToken();

        if (latestToken) {
          finalRefreshToken = latestToken.refreshToken;

          console.log(
            'Using existing refresh token from:',
            latestToken.createdAt,
          );
        }
      } else {
        console.log('New refresh token received at:', new Date().toISOString());
      }

      if (!access_token || !finalRefreshToken || !expires_in) {
        console.error('Missing required token data:', {
          hasAccessToken: !!access_token,
          hasRefreshToken: !!finalRefreshToken,
          hasExpiresIn: !!expires_in,
        });
        throw new Error('Missing required token data');
      }

      const token = await this.prisma.token.create({
        data: {
          accessToken: access_token,
          refreshToken: finalRefreshToken,
          expiresIn: expires_in,
          createdAt: new Date(),
        },
      });

      console.log('Token saved:', {
        accessTokenExpiresIn: expires_in,
        refreshTokenCreatedAt: token.createdAt,
        refreshTokenExpiresAt: new Date(
          token.createdAt.getTime() + 14 * 24 * 60 * 60 * 1000,
        ), // 14 dias
      });

      return token;
    } catch (error) {
      console.error('Error saving token:', error);
      throw error;
    }
  }

  async getLatestToken() {
    return this.prisma.token.findFirst({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPreviousToken() {
    return this.prisma.token.findFirst({
      orderBy: { createdAt: 'desc' },
      skip: 1,
    });
  }
}
