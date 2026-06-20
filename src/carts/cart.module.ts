import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartService } from './cart.service';
import { ProductService } from '../products/product.service';
import { CompanyModule } from '../company/company.module';
import { ProductModule } from '../products/product.module';
import { Product } from '../products/entities/product.entity';
import { CartItemsService } from '../carts_items/cart-items.service';
import { CartItem } from '../carts_items/entities/cart-items.entity';
import { CompanySettingModule } from '../company-setting/company-setting.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, Product, CartItem]),
    forwardRef(() => CompanyModule),
    forwardRef(() => ProductModule),
    forwardRef(() => CompanySettingModule),
  ],
  providers: [CartService, ProductService, CartItemsService],
  exports: [CartService, TypeOrmModule, CartItemsService],
})
export class CartModule {}
