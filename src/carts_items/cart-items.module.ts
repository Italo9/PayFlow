import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-items.entity';
import { CartItemsService } from './cart-items.service';
import { CartItemsController } from './cart-items.controller';
import { ProductService } from '../products/product.service';
import { CompanyModule } from '../company/company.module';
import { CartModule } from '../carts/cart.module';
import { CheckoutModule } from '../checkout/checkout.module';
import { PaymentModule } from '../payment/payment.module';
import { CompanySettingModule } from '../company-setting/company-setting.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartItem]),
    forwardRef(() => CompanyModule),
    forwardRef(() => CartModule),
    forwardRef(() => CheckoutModule),
    forwardRef(() => PaymentModule),
    forwardRef(() => CompanySettingModule),
  ],
  controllers: [CartItemsController],
  providers: [CartItemsService, ProductService],
  exports: [CartItemsService, TypeOrmModule],
})
export class CartItemsModule {}
