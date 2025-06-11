import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import axios from 'axios';

@Injectable()
export class ContactsService {
  private readonly zohoApiUrl = 'https://www.zohoapis.com/crm/v3';

  constructor(private readonly authService: AuthService) {}

  async searchContactByEmail(email: string) {
    const token = await this.authService.getValidAccessToken();
    const response = await axios.get(
      `${this.zohoApiUrl}/Contacts/search?email=${email}`,
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
