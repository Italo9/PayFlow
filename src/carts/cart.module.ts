import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CompanyModule } from '../company/company.module';
import { TypeOrmCartRepository } from './infrastructure/persistence/typeorm-cart.repository';
import { CompanyGatewayAdapter } from './infrastructure/company/company.gateway.adapter';
import { CART_REPOSITORY } from './domain/ports/cart.repository';
import { COMPANY_GATEWAY } from './domain/ports/company-gateway';
import { CreateCartUseCase } from './application/create-cart.usecase';
import { GetCartBySessionUseCase } from './application/get-cart-by-session.usecase';
import { GetCartByIdUseCase } from './application/get-cart-by-id.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart]),
    forwardRef(() => CompanyModule),
  ],
  providers: [
    { provide: CART_REPOSITORY, useClass: TypeOrmCartRepository },
    { provide: COMPANY_GATEWAY, useClass: CompanyGatewayAdapter },
    CreateCartUseCase,
    GetCartBySessionUseCase,
    GetCartByIdUseCase,
  ],
  exports: [
    CreateCartUseCase,
    GetCartBySessionUseCase,
    GetCartByIdUseCase,
    TypeOrmModule,
  ],
})
export class CartModule {}
