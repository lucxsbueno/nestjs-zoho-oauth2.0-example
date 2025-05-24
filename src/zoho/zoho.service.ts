// src/zoho/zoho.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ZohoService {
  constructor(private readonly authService: AuthService) {}

  async searchContactByEmail(email: string) {
    const accessToken = await this.authService.getValidAccessToken();
    const criteria = `(Email:equals:${email})`;

    const response = await axios.get(
      `${process.env.ZOHO_API_DOMAIN}/crm/v8/Contacts/search`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
        params: {
          criteria,
        },
      },
    );

    return response.data;
  }
}
