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
import { EmailsService } from './emails.service';

@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Get('accounts')
  async getAllMailAccounts() {
    return this.emailsService.getAllMailAccounts();
  }

  @Get('accounts/:id')
  async getMailAccount(@Param('id') id: string) {
    return this.emailsService.getMailAccountById(id);
  }

  @Post('accounts')
  async createMailAccount(@Body() mailConfig: any) {
    return this.emailsService.createMailAccount(mailConfig);
  }

  @Put('accounts/:id')
  async updateMailAccount(@Param('id') id: string, @Body() mailConfig: any) {
    return this.emailsService.updateMailAccount(id, mailConfig);
  }

  @Delete('accounts/:id')
  async deleteMailAccount(@Param('id') id: string) {
    return this.emailsService.deleteMailAccount(id);
  }

  @Post('accounts/:accountId/send')
  async sendEmail(
    @Param('accountId') accountId: string,
    @Body()
    emailData: {
      fromAddress: string;
      toAddress: string;
      ccAddress?: string;
      bccAddress?: string;
      subject?: string;
      content: string;
      mailFormat?: 'html' | 'plaintext';
      askReceipt?: 'yes' | 'no';
      encoding?: string;
      isSchedule?: boolean;
      scheduleType?: 1 | 2 | 3 | 4 | 5 | 6;
      timeZone?: string;
      scheduleTime?: string;
    },
  ) {
    return this.emailsService.sendEmail(accountId, emailData);
  }

  @Get('accounts/:accountId/related/:relatedTo')
  async getEmailsByRelatedTo(
    @Param('accountId') accountId: string,
    @Param('relatedTo') relatedTo: string,
  ) {
    return this.emailsService.getEmailsByRelatedTo(accountId, relatedTo);
  }
}
