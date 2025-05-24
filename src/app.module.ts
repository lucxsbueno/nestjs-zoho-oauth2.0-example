import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ZohoModule } from './zoho/zoho.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, ZohoModule],
})
export class AppModule {}
