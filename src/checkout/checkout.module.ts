import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { Checkout } from './entities/checkout.entity';
import { AuthGatewayService } from '../auth/auth-gateway.service';
import { WebhookService } from '../webhook/webhook.service';
import { CompanySettingService } from '../company-setting/company-setting.service';
import { CompanySetting } from '../company-setting/entities/company-setting.entity';
import { PaymentModule } from '../payment/payment.module';
import { CartModule } from '../carts/cart.module';
import { CompanyModule } from '../company/company.module';
import { UserModule } from '../user/user.module';
import { ProductService } from '../products/product.service';
import { ProductModule } from '../products/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Checkout, CompanySetting]),
    forwardRef(() => CompanyModule),
    forwardRef(() => UserModule),
    forwardRef(() => PaymentModule),
    forwardRef(() => CartModule),
    forwardRef(() => ProductModule),
  ],
  controllers: [CheckoutController],
  providers: [
    CheckoutService,
    AuthGatewayService,
    WebhookService,
    CompanySettingService,
    ProductService,
  ],
  exports: [TypeOrmModule, CheckoutService],
})
export class CheckoutModule {}
