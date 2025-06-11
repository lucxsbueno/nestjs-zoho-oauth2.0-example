import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import axios from 'axios';

@Injectable()
export class ContactsService {
  private readonly zohoApiUrl = process.env.ZOHO_CRM_API_URL;

  constructor(private readonly authService: AuthService) {}

  async searchContact(email: string, name: string, phone: string) {
    const token = await this.authService.getValidAccessToken();

    if (!email) {
      throw new BadRequestException(
        'Email is a required query parameter for search',
      );
    }

    const queryParams = new URLSearchParams();
    queryParams.append('email', email);

    if (name)
      queryParams.append(
        'criteria',
        `((Full_Name:equals:${name}) or (Phone:equals:${phone}))`,
      );

    const response = await axios.get(
      `${this.zohoApiUrl}/Contacts/search?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
        },
      },
    );
    return response.data;
  }

  async getContactById(id: string) {
    const token = await this.authService.getValidAccessToken();
    const response = await axios.get(`${this.zohoApiUrl}/Contacts/${id}`, {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    });
    return response.data;
  }

  async createContact(contactData: any) {
    const token = await this.authService.getValidAccessToken();
    const response = await axios.post(
      `${this.zohoApiUrl}/Contacts`,
      { data: [contactData] },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
        },
      },
    );
    return response.data;
  }

  async updateContact(id: string, contactData: any) {
    const token = await this.authService.getValidAccessToken();
    const response = await axios.put(
      `${this.zohoApiUrl}/Contacts/${id}`,
      { data: [contactData] },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
        },
      },
    );
    return response.data;
  }

  async deleteContact(id: string) {
    const token = await this.authService.getValidAccessToken();
    const response = await axios.delete(`${this.zohoApiUrl}/Contacts/${id}`, {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    });
    return response.data;
  }
}
