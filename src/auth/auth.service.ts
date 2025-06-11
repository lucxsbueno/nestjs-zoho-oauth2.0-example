import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(private readonly tokenService: TokenService) {}

  getAuthUrl(): string {
    const base = process.env.ZOHO_API_ACCOUNT + '/oauth/v2/auth';
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

    try {
      console.log('Exchanging code for token with params:', params.toString());
      console.log(
        'Request URL:',
        `${process.env.ZOHO_API_ACCOUNT}/oauth/v2/token`,
      );

      const res = await axios.post(
        `${process.env.ZOHO_API_ACCOUNT}/oauth/v2/token`,
        params,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );

      console.log('Token response status:', res.status);
      console.log('Token response headers:', res.headers);
      console.log('Token response data:', JSON.stringify(res.data, null, 2));

      if (
        !res.data.access_token ||
        !res.data.refresh_token ||
        !res.data.expires_in
      ) {
        console.error('Missing fields in response:', {
          hasAccessToken: !!res.data.access_token,
          hasRefreshToken: !!res.data.refresh_token,
          hasExpiresIn: !!res.data.expires_in,
          fullResponse: res.data,
        });
        throw new Error('Invalid token response from Zoho');
      }

      const tokenData = {
        access_token: res.data.access_token,
        refresh_token: res.data.refresh_token,
        expires_in: parseInt(res.data.expires_in, 10),
      };

      await this.tokenService.saveToken(tokenData);

      return tokenData;
    } catch (error) {
      console.error(
        'Error exchanging code for token:',
        error.response?.data || error,
      );
      throw new InternalServerErrorException(error);
    }
  }

  async getValidAccessToken(): Promise<string> {
    try {
      const token = await this.tokenService.getLatestToken();

      console.log('Current token:', {
        accessToken: token?.accessToken ? 'Present' : 'Missing',
        refreshToken: token?.refreshToken ? 'Present' : 'Missing',
        createdAt: token?.createdAt,
        expiresIn: token?.expiresIn,
        accessTokenExpiresAt: token
          ? new Date(token.createdAt.getTime() + token.expiresIn * 1000)
          : 'N/A',
        isExpired: token
          ? Date.now() >= token.createdAt.getTime() + token.expiresIn * 1000
          : true,
      });

      if (!token) {
        throw new Error(
          'No token found. Please authenticate first by visiting /auth/zoho',
        );
      }

      const expirationTime =
        new Date(token.createdAt).getTime() + token.expiresIn * 1000;

      // Só faz refresh se o token realmente expirou
      if (Date.now() >= expirationTime) {
        console.log('Access token expired, refreshing...');

        const params: URLSearchParams = new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: process.env.ZOHO_CLIENT_ID ?? '',
          client_secret: process.env.ZOHO_CLIENT_SECRET ?? '',
          refresh_token: token.refreshToken,
        });

        try {
          const res = await axios.post(
            `${process.env.ZOHO_API_ACCOUNT}/oauth/v2/token`,
            params,
            {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            },
          );

          console.log('Refresh token response:', res.data);

          if (!res.data.access_token || !res.data.expires_in) {
            console.error('Invalid refresh token response:', res.data);
            throw new Error('Invalid refresh token response from Zoho');
          }

          // Sempre mantém o refresh token existente
          const tokenData = {
            access_token: res.data.access_token,
            refresh_token: token.refreshToken, // mantém o refresh token existente
            expires_in: parseInt(res.data.expires_in, 10),
          };

          await this.tokenService.saveToken(tokenData);
          return tokenData.access_token;
        } catch (refreshError) {
          console.error(
            'Error refreshing token:',
            refreshError.response?.data || refreshError,
          );

          // Tratamento específico para diferentes erros do Zoho
          if (refreshError.response?.data?.error === 'invalid_grant') {
            console.log(
              'Refresh token is invalid or has been revoked. You need to authenticate again by visiting /auth',
            );
            throw new Error(
              'Refresh token is invalid or has been revoked. Please visit /auth/zoho to authenticate again.',
            );
          } else if (refreshError.response?.data?.error === 'Access Denied') {
            console.log(
              'Rate limit exceeded. Too many token requests in 10 minutes. Waiting before retrying...',
            );
            throw new Error(
              'Too many token requests. Please try again in a few minutes.',
            );
          } else if (
            refreshError.response?.data?.error === 'INVALID_OAUTHTOKEN'
          ) {
            console.log(
              'Invalid access token. This might happen if we have more than 15 active tokens.',
            );
            throw new Error('Invalid access token. Please try again.');
          }

          throw refreshError;
        }
      }

      return token.accessToken;
    } catch (error) {
      console.error('Error in getValidAccessToken:', error);
      throw new InternalServerErrorException(error);
    }
  }
}
