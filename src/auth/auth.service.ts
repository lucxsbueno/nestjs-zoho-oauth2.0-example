import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(private readonly tokenService: TokenService) {}

  getAuthUrl(): string {
    const base = process.env.ZOHO_API_DOMAIN + '/oauth/v2/auth';
    const params: URLSearchParams = new URLSearchParams({
      client_id: process.env.ZOHO_CLIENT_ID ?? '',
      redirect_uri: process.env.ZOHO_REDIRECT_URI ?? '',
      scope: process.env.ZOHO_SCOPE ?? '',
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
    });
    return `${base}?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string) {
    const params: URLSearchParams = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.ZOHO_CLIENT_ID ?? '',
      client_secret: process.env.ZOHO_CLIENT_SECRET ?? '',
      redirect_uri: process.env.ZOHO_REDIRECT_URI ?? '',
      code,
    });

    const res = await axios.post(
      `${process.env.ZOHO_API_DOMAIN}/oauth/v2/token`,
      params,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    await this.tokenService.saveToken(res.data);
    return res.data;
  }

  async getValidAccessToken(): Promise<string> {
    const token = await this.tokenService.getLatestToken();

    if (!token) {
      throw new Error('No token found. Please authenticate first.');
    }

    const expirationTime =
      new Date(token.createdAt).getTime() + token.expiresIn * 1000;

    if (Date.now() >= expirationTime - 60000) {
      const params: URLSearchParams = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: process.env.ZOHO_CLIENT_ID ?? '',
        client_secret: process.env.ZOHO_CLIENT_SECRET ?? '',
        refresh_token: token.refreshToken,
      });

      const res = await axios.post(
        `${process.env.ZOHO_API_DOMAIN}/oauth/v2/token`,
        params,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );

      await this.tokenService.saveToken(res.data);
      return res.data.access_token;
    }

    return token.accessToken;
  }
}
