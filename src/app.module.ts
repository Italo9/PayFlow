import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DomainExceptionFilter } from './common/filters/domain-exception.filter';
import { AppDataSource } from './data-source';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';
import { CompanySettingModule } from './company-setting/company-setting.module';
import { ProductModule } from './products/product.module';
import { CartModule } from './carts/cart.module';
import { CartItemsModule } from './carts_items/cart-items.module';
import { CheckoutModule } from './checkout/checkout.module';
import { PaymentModule } from './payment/payment.module';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: () => AppDataSource.options }),
    AuthModule,
    UserModule,
    CompanyModule,
    CompanySettingModule,
    ProductModule,
    CartModule,
    CartItemsModule,
    CheckoutModule,
    PaymentModule,
    WebhookModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
  ],
})
export class AppModule {}
