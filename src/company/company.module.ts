import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { CompanyController } from './infrastructure/http/company.controller';
import { TypeOrmCompanyRepository } from './infrastructure/persistence/typeorm-company.repository';
import { QrCodeAdapter } from './infrastructure/qrcode/qrcode.adapter';
import { UserGatewayAdapter } from './infrastructure/user/user-gateway.adapter';
import { COMPANY_REPOSITORY } from './domain/ports/company.repository';
import { USER_GATEWAY } from './domain/ports/user-gateway';
import { QRCODE_GENERATOR } from './domain/ports/qrcode-generator';
import { CreateCompanyUseCase } from './application/create-company.usecase';
import { ListCompaniesUseCase } from './application/list-companies.usecase';
import { GetCompanyUseCase } from './application/get-company.usecase';
import { ListCompanyProductsUseCase } from './application/list-company-products.usecase';
import { UpdateCompanyUseCase } from './application/update-company.usecase';
import { RemoveCompanyUseCase } from './application/remove-company.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, User]),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [CompanyController],
  providers: [
    { provide: COMPANY_REPOSITORY, useClass: TypeOrmCompanyRepository },
    { provide: USER_GATEWAY, useClass: UserGatewayAdapter },
    { provide: QRCODE_GENERATOR, useClass: QrCodeAdapter },
    CreateCompanyUseCase,
    ListCompaniesUseCase,
    GetCompanyUseCase,
    ListCompanyProductsUseCase,
    UpdateCompanyUseCase,
    RemoveCompanyUseCase,
  ],
  exports: [COMPANY_REPOSITORY, GetCompanyUseCase, TypeOrmModule],
})
export class CompanyModule {}
