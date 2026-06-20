import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrmEntity } from './infrastructure/persistence/product.orm-entity';
import { TypeOrmProductRepository } from './infrastructure/persistence/typeorm-product.repository';
import { QrCodeAdapter } from './infrastructure/qrcode/qrcode.adapter';
import { CompanyGatewayAdapter } from './infrastructure/company/company.gateway.adapter';
import { ProductController } from './infrastructure/http/product.controller';
import { PRODUCT_REPOSITORY } from './domain/ports/product.repository';
import { QRCODE_GENERATOR } from './domain/ports/qrcode-generator';
import { COMPANY_GATEWAY } from './domain/ports/company-gateway';
import { CreateProductUseCase } from './application/create-product.usecase';
import { ListProductsUseCase } from './application/list-products.usecase';
import { GetProductUseCase } from './application/get-product.usecase';
import { UpdateProductUseCase } from './application/update-product.usecase';
import { DeleteProductUseCase } from './application/delete-product.usecase';
import { ScanProductUseCase } from './application/scan-product.usecase';
import { AuthModule } from '../auth/auth.module';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductOrmEntity]),
    forwardRef(() => AuthModule),
    forwardRef(() => CompanyModule),
  ],
  controllers: [ProductController],
  providers: [
    { provide: PRODUCT_REPOSITORY, useClass: TypeOrmProductRepository },
    { provide: QRCODE_GENERATOR, useClass: QrCodeAdapter },
    { provide: COMPANY_GATEWAY, useClass: CompanyGatewayAdapter },
    CreateProductUseCase,
    ListProductsUseCase,
    GetProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    ScanProductUseCase,
  ],
  exports: [PRODUCT_REPOSITORY, GetProductUseCase],
})
export class ProductModule {}
