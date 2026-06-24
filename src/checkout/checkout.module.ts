import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Checkout } from './entities/checkout.entity';
import { CartModule } from '../carts/cart.module';
import { CartItemsModule } from '../carts_items/cart-items.module';
import { ProductModule } from '../products/product.module';
import { AuthModule } from '../auth/auth.module';
import { PaymentModule } from '../payment/payment.module';
import { CheckoutController } from './infrastructure/http/checkout.controller';
import { TypeOrmCheckoutRepository } from './infrastructure/persistence/typeorm-checkout.repository';
import { CartGatewayAdapter } from './infrastructure/cart/cart.gateway.adapter';
import { CartItemsGatewayAdapter } from './infrastructure/cart/cart-items.gateway.adapter';
import { ProductGatewayAdapter } from './infrastructure/product/product.gateway.adapter';
import { PaycoPixGateway } from './infrastructure/pix/payco-pix.gateway';
import { QrCodeAdapter } from './infrastructure/qrcode/qrcode.adapter';
import { CHECKOUT_REPOSITORY } from './domain/ports/checkout.repository';
import { CART_GATEWAY } from './domain/ports/cart-gateway';
import { CART_ITEMS_GATEWAY } from './domain/ports/cart-items-gateway';
import { PRODUCT_GATEWAY } from './domain/ports/product-gateway';
import { PIX_GATEWAY } from './domain/ports/pix-gateway';
import { QRCODE_GENERATOR } from './domain/ports/qrcode-generator';
import { CreateCheckoutUseCase } from './application/create-checkout.usecase';
import { GetCheckoutBySessionUseCase } from './application/get-checkout-by-session.usecase';
import { UpdateCheckoutStatusUseCase } from './application/update-checkout-status.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([Checkout]),
    forwardRef(() => CartModule),
    forwardRef(() => CartItemsModule),
    forwardRef(() => ProductModule),
    forwardRef(() => AuthModule),
    forwardRef(() => PaymentModule),
  ],
  controllers: [CheckoutController],
  providers: [
    { provide: CHECKOUT_REPOSITORY, useClass: TypeOrmCheckoutRepository },
    { provide: CART_GATEWAY, useClass: CartGatewayAdapter },
    { provide: CART_ITEMS_GATEWAY, useClass: CartItemsGatewayAdapter },
    { provide: PRODUCT_GATEWAY, useClass: ProductGatewayAdapter },
    { provide: PIX_GATEWAY, useClass: PaycoPixGateway },
    { provide: QRCODE_GENERATOR, useClass: QrCodeAdapter },
    CreateCheckoutUseCase,
    GetCheckoutBySessionUseCase,
    UpdateCheckoutStatusUseCase,
  ],
  exports: [GetCheckoutBySessionUseCase, UpdateCheckoutStatusUseCase, TypeOrmModule],
})
export class CheckoutModule {}
