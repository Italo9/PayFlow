import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanySetting } from './entities/company-setting.entity';
import { CompanyModule } from '../company/company.module';
import { UserModule } from '../user/user.module';
import { CompanySettingController } from './infrastructure/http/company-setting.controller';
import { TypeOrmCompanySettingRepository } from './infrastructure/persistence/typeorm-company-setting.repository';
import { CompanyGatewayAdapter } from './infrastructure/company/company.gateway.adapter';
import { RequesterGatewayAdapter } from './infrastructure/user/requester.gateway.adapter';
import { COMPANY_SETTING_REPOSITORY } from './domain/ports/company-setting.repository';
import { COMPANY_GATEWAY } from './domain/ports/company-gateway';
import { REQUESTER_GATEWAY } from './domain/ports/requester-gateway';
import { CreateCompanySettingUseCase } from './application/create-company-setting.usecase';
import { ListCompanySettingsUseCase } from './application/list-company-settings.usecase';
import { GetCompanySettingByCompanyUseCase } from './application/get-company-setting-by-company.usecase';
import { UpdateCompanySettingUseCase } from './application/update-company-setting.usecase';
import { RemoveCompanySettingUseCase } from './application/remove-company-setting.usecase';
import { IsCarPaymentActiveUseCase } from './application/is-car-payment-active.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanySetting]),
    forwardRef(() => CompanyModule),
    forwardRef(() => UserModule),
  ],
  controllers: [CompanySettingController],
  providers: [
    { provide: COMPANY_SETTING_REPOSITORY, useClass: TypeOrmCompanySettingRepository },
    { provide: COMPANY_GATEWAY, useClass: CompanyGatewayAdapter },
    { provide: REQUESTER_GATEWAY, useClass: RequesterGatewayAdapter },
    CreateCompanySettingUseCase,
    ListCompanySettingsUseCase,
    GetCompanySettingByCompanyUseCase,
    UpdateCompanySettingUseCase,
    RemoveCompanySettingUseCase,
    IsCarPaymentActiveUseCase,
  ],
  exports: [
    GetCompanySettingByCompanyUseCase,
    IsCarPaymentActiveUseCase,
    TypeOrmModule,
  ],
})
export class CompanySettingModule {}
