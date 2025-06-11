// src/zoho/zoho.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ZohoService {
  constructor(private readonly authService: AuthService) {}

  async searchContactByEmail(email: string) {
    const accessToken = await this.authService.getValidAccessToken();
    const criteria = `(Email:equals:${email})`;

    try {
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
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async getAllMailAccounts() {
    const accessToken = await this.authService.getValidAccessToken();

    try {
      const response = await axios.get(
        //`https://mail.zoho.com/api/accounts/8409990000000008002/messages/view`,
        `https://mail.zoho.com/api/accounts/8409990000000008002/messages/view?threadId=1748278166462102600`,
        //`https://mail.zoho.com/api/accounts/8409990000000008002/folders/8409990000000008014/messages/1748278373169116200/content`,
        //`https://mail.zoho.com/api/accounts/8409990000000008002/messages/search?criteria=(threadId:equals:1748278166462102600))`,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.log(JSON.stringify(error));
      throw new InternalServerErrorException(error);
    }
  }
}
