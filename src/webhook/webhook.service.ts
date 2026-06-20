import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CheckoutService } from '../checkout/checkout.service';
import { PaymentService } from '../payment/payment.service';
@Injectable()
export class WebhookService {
  constructor(
    private readonly checkoutService: CheckoutService,
    private readonly paymentService: PaymentService,
  ) {}
  async handlePaymentWebhook(
    session: string,
    paymentDetails: any,
  ): Promise<void> {
    try {
      console.log(`Pagamento recebido para a sessão: ${session}`);
      console.log('Detalhes do pagamento:', paymentDetails);

      const paymentStatus = paymentDetails?.payload?.status;
      const sessionId = paymentDetails?.payload?.items[0].code;
      if (paymentStatus === 'PAID') {
        await this.checkoutService.updateCheckoutStatus(
          sessionId,
          paymentStatus,
        );

        await this.paymentService.updatePaymentStatus(sessionId, paymentStatus);
      } else {
        console.log(`Pagamento não confirmado para a sessão ${sessionId}`);
      }
    } catch (error) {
      console.error('Erro ao processar o webhook de pagamento:', error);
      throw new HttpException(
        'Erro ao processar o webhook de pagamento',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
