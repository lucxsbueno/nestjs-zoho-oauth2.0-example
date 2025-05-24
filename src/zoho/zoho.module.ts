import { Module } from '@nestjs/common';
import { ZohoController } from './zoho.controller';
import { ZohoService } from './zoho.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ZohoController],
  providers: [ZohoService],
})
export class ZohoModule {}
