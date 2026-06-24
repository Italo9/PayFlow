import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UpdateCheckoutStatusUseCase } from '../../checkout/application/update-checkout-status.usecase';
import { UpdatePaymentStatusUseCase } from '../../payment/application/update-payment-status.usecase';

export interface WebhookPayload {
  payload?: {
    status?: string;
    items?: Array<{ code?: string }>;
  };
}

@Injectable()
export class ProcessPaymentWebhookUseCase {
  constructor(
    private readonly updateCheckoutStatus: UpdateCheckoutStatusUseCase,
    private readonly updatePaymentStatus: UpdatePaymentStatusUseCase,
  ) {}

  async execute(session: string, paymentDetails: WebhookPayload): Promise<void> {
    try {
      const paymentStatus = paymentDetails?.payload?.status;
      const sessionId = paymentDetails?.payload?.items?.[0]?.code;

      if (paymentStatus === 'PAID' && sessionId) {
        await this.updateCheckoutStatus.execute(sessionId, paymentStatus);
        await this.updatePaymentStatus.execute(sessionId, paymentStatus);
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
