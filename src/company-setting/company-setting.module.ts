import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanySetting } from './entities/company-setting.entity';
import { CompanySettingService } from './company-setting.service';
import { CompanyModule } from '../company/company.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanySetting]),
    forwardRef(() => CompanyModule),
    forwardRef(() => UserModule),
  ],
  providers: [CompanySettingService],
  exports: [CompanySettingService, TypeOrmModule],
})
export class CompanySettingModule {}
