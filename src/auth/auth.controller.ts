import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('zoho')
  redirectToZoho() {
    return this.authService.getAuthUrl();
  }

  @Get('callback')
  async handleCallback(@Query('code') code: string) {
    return await this.authService.exchangeCodeForToken(code);
  }
}
