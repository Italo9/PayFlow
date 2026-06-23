import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-items.entity';
import { CartModule } from '../carts/cart.module';
import { ProductModule } from '../products/product.module';
import { CompanySettingModule } from '../company-setting/company-setting.module';
import { CartItemsController } from './infrastructure/http/cart-items.controller';
import { RedisCartStore } from './infrastructure/store/redis-cart.store';
import { ProductGatewayAdapter } from './infrastructure/product/product.gateway.adapter';
import { SettingsGatewayAdapter } from './infrastructure/settings/settings.gateway.adapter';
import { TypeOrmCartItemRepository } from './infrastructure/persistence/typeorm-cart-item.repository';
import { CART_STORE } from './domain/ports/cart-store';
import { PRODUCT_GATEWAY } from './domain/ports/product-gateway';
import { SETTINGS_GATEWAY } from './domain/ports/settings-gateway';
import { CART_ITEM_REPOSITORY } from './domain/ports/cart-item.repository';
import { GetCartUseCase } from './application/get-cart.usecase';
import { GetCartItemsUseCase } from './application/get-cart-items.usecase';
import { AddToCartUseCase } from './application/add-to-cart.usecase';
import { RemoveFromCartUseCase } from './application/remove-from-cart.usecase';
import { ClearCartUseCase } from './application/clear-cart.usecase';
import { PrepaymentUseCase } from './application/prepayment.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartItem]),
    forwardRef(() => CartModule),
    forwardRef(() => ProductModule),
    forwardRef(() => CompanySettingModule),
  ],
  controllers: [CartItemsController],
  providers: [
    { provide: CART_STORE, useClass: RedisCartStore },
    { provide: PRODUCT_GATEWAY, useClass: ProductGatewayAdapter },
    { provide: SETTINGS_GATEWAY, useClass: SettingsGatewayAdapter },
    { provide: CART_ITEM_REPOSITORY, useClass: TypeOrmCartItemRepository },
    GetCartUseCase,
    GetCartItemsUseCase,
    AddToCartUseCase,
    RemoveFromCartUseCase,
    ClearCartUseCase,
    PrepaymentUseCase,
  ],
  exports: [GetCartItemsUseCase, TypeOrmModule],
})
export class CartItemsModule {}
