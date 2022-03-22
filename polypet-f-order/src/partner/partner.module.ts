import { Module } from '@nestjs/common';
import { PartnerService } from './partner.service';

@Module({
  providers: [PartnerService],
  exports: [PartnerService]
})
export class PartnerModule { }
