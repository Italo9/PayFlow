import { forwardRef, Module } from '@nestjs/common';
import { CheckoutModule } from '../checkout/checkout.module';
import { PaymentModule } from '../payment/payment.module';
import { WebhookController } from './infrastructure/http/webhook.controller';
import { ProcessPaymentWebhookUseCase } from './application/process-payment-webhook.usecase';

@Module({
  imports: [
    forwardRef(() => CheckoutModule),
    forwardRef(() => PaymentModule),
  ],
  controllers: [WebhookController],
  providers: [ProcessPaymentWebhookUseCase],
})
export class WebhookModule {}
