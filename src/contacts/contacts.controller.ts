import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get('search')
  async searchContact(
    @Query('email') email: string,
    @Query('name') name: string,
    @Query('phone') phone: string,
  ) {
    return this.contactsService.searchContact(email, name, phone);
  }

  @Get(':id')
  async getContact(@Param('id') id: string) {
    return this.contactsService.getContactById(id);
  }

  @Post()
  async createContact(@Body() contactData: any) {
    return this.contactsService.createContact(contactData);
  }

  @Put(':id')
  async updateContact(@Param('id') id: string, @Body() contactData: any) {
    return this.contactsService.updateContact(id, contactData);
  }

  @Delete(':id')
  async deleteContact(@Param('id') id: string) {
    return this.contactsService.deleteContact(id);
  }
}
