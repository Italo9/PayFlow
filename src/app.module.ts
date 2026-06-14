import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';
import { CheckoutModule } from './checkout/checkout.module';
import { PaymentModule } from './payment/payment.module';
import { CompanySettingModule } from './company-setting/company-setting.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/controllers/auth.controller';
import { AuthGuard } from './auth/guards/auth.guard';
import { AuthUseCase } from './auth/use-cases/auth.use-case';
import { Company } from './company/entities/company.entity';
import { Checkout } from './checkout/entities/checkout.entity';
import { Payment } from './payment/entities/payment.entity';
import { User } from './user/entities/user.entity';
import { UserAuth } from './auth/entities/user.entity';
import { Session } from './auth/entities/session.entity';
import { WebhookModule } from './webhook/webhook.module';
import { CompanySettingController } from './company-setting/company-setting.controller';
import { CompanySetting } from './company-setting/entities/company-setting.entity';
import { WebhookController } from './webhook/webhook.controller';
import { ProductModule } from './products/product.module';
import { ProductController } from './products/product.controller';
import { Product } from './products/entities/product.entity';
import { CartModule } from './carts/cart.module';
import { CartItemsModule } from './carts_items/cart-items.module';
import { CartItem } from './carts_items/entities/cart-items.entity';
import { Cart } from './carts/entities/cart.entity';
import { PaymentController } from './payment/payment.controller';
import { CheckoutController } from './checkout/checkout.controller';
import { CartItemsController } from './carts_items/cart-items.controller';
import { AppDataSource } from './data-source';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => AppDataSource.options,
    }),
    UserModule,
    CompanyModule,
    CheckoutModule,
    PaymentModule,
    ProductModule,
    CompanySettingModule,
    CartModule,
    CartItemsModule,
    WebhookModule,
  ],
  controllers: [
    AppController,
    AuthController,
    CompanySettingController,
    ProductController,
    WebhookController,
    PaymentController,
    CheckoutController,
    CartItemsController,
  ],

  providers: [AppService, AuthUseCase, AuthGuard],
})
export class AppModule {}
