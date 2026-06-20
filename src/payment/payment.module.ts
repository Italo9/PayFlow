import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment } from './entities/payment.entity';
import { Checkout } from '../checkout/entities/checkout.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanySettingModule } from '../company-setting/company-setting.module';
import { Cart } from '../carts/entities/cart.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Checkout, Cart]), 
    CompanySettingModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [TypeOrmModule, PaymentService ],
})
export class PaymentModule {}
