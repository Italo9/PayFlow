import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckoutService } from '../checkout/checkout.service';
import { CheckoutController } from '../checkout/checkout.controller';
import { Checkout } from '../checkout/entities/checkout.entity';
import { AuthGatewayService } from '../auth/auth-gateway.service';
import { WebhookService } from './webhook.service';
import { CompanySettingModule } from '../company-setting/company-setting.module';
import { CheckoutModule } from '../checkout/checkout.module';
import { PaymentModule } from '../payment/payment.module';
import { Payment } from '../payment/entities/payment.entity';
import { CartModule } from '../carts/cart.module';
import { CartItemsService } from '../carts_items/cart-items.service';
import { ProductService } from '../products/product.service';
import { CartService } from '../carts/cart.service';
import { ProductModule } from '../products/product.module';
import { CompanyService } from '../company/company.service';
import { CompanyModule } from '../company/company.module';
import { Company } from '../company/entities/company.entity';
import { Product } from '../products/entities/product.entity';
import { UserService } from '../user/user.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Checkout, Payment, Company, Product]),
    CompanySettingModule,
    ProductModule,
    CheckoutModule,
    PaymentModule,
    CartModule,
    CompanyModule,
    AuthModule,
  ],
  controllers: [CheckoutController],
  providers: [
    CheckoutService,
    CartService,
    CartItemsService,
    ProductService,
    AuthGatewayService,
    WebhookService,
    CompanyService,
    UserService,
  ],
  exports: [TypeOrmModule, WebhookService],
})
export class WebhookModule {}
