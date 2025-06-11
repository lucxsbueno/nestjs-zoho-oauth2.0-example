// src/zoho/zoho.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ZohoService } from './zoho.service';

@Controller('zoho')
export class ZohoController {
  constructor(private readonly zohoService: ZohoService) {}

  @Get('search-contact')
  async searchContact(@Query('email') email: string) {
    return this.zohoService.searchContactByEmail(email);
  }

  @Get('mails')
  async getAllMailAccounts(@Query('email') email: string) {
    return this.zohoService.getAllMailAccounts();
  }
}
