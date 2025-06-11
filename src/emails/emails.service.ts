import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import axios from 'axios';
import { EmailDataDto } from './dto/email-data.dto';

@Injectable()
export class EmailsService {
  private readonly zohoMailApiUrl = process.env.ZOHO_MAIL_API_URL;

  constructor(private readonly authService: AuthService) {}

  async getAllMailAccounts() {
    const token = await this.authService.getValidAccessToken();
    const response = await axios.get(`${this.zohoMailApiUrl}/accounts`, {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    });
    return response.data;
  }

  async getMailAccountById(id: string) {
    const token = await this.authService.getValidAccessToken();
    const response = await axios.get(`${this.zohoMailApiUrl}/accounts/${id}`, {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    });
    return response.data;
  }

  async createMailAccount(mailConfig: any) {
    const token = await this.authService.getValidAccessToken();
    const response = await axios.post(
      `${this.zohoMailApiUrl}/accounts`,
      mailConfig,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
        },
      },
    );
    return response.data;
  }

  async updateMailAccount(id: string, mailConfig: any) {
    const token = await this.authService.getValidAccessToken();
    const response = await axios.put(
      `${this.zohoMailApiUrl}/accounts/${id}`,
      mailConfig,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
        },
      },
    );
    return response.data;
  }

  async deleteMailAccount(id: string) {
    const token = await this.authService.getValidAccessToken();
    const response = await axios.delete(
      `${this.zohoMailApiUrl}/accounts/${id}`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
        },
      },
    );
    return response.data;
  }

  async sendEmail(accountId: string, emailData: EmailDataDto) {
    const token = await this.authService.getValidAccessToken();
    const response = await axios.post(
      `${this.zohoMailApiUrl}/accounts/${accountId}/messages`,
      emailData,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );
    return response.data;
  }

  async getEmailsByRelatedTo(accountId: string, relatedTo: string) {
    const token = await this.authService.getValidAccessToken();
    const response = await axios.get(
      `${this.zohoMailApiUrl}/accounts/${accountId}/messages/search`,
      {
        params: {
          relatedTo,
        },
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
        },
      },
    );
    return response.data;
  }
}
