import { Module } from '@nestjs/common';
import { CompanySettingService } from './company-setting.service';
import { CompanySettingController } from './company-setting.controller';

@Module({
  controllers: [CompanySettingController],
  providers: [CompanySettingService],
})
export class CompanySettingModule {}
