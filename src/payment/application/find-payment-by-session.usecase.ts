import { Inject, Injectable } from '@nestjs/common';
import { Payment } from '../domain/payment';
import { PAYMENT_REPOSITORY, PaymentRepository } from '../domain/ports/payment.repository';

interface ReceivData {
  items?: Array<{ code?: string }>;
}

@Injectable()
export class FindPaymentBySessionUseCase {
  constructor(@Inject(PAYMENT_REPOSITORY) private readonly payments: PaymentRepository) {}

  async execute(sessionId: string): Promise<Payment | null> {
    const payments = await this.payments.findAll();
    const found = payments.find((payment) => {
      try {
        const data: ReceivData =
          typeof payment.receivData === 'string'
            ? JSON.parse(payment.receivData)
            : (payment.receivData as ReceivData);
        return data?.items?.[0]?.code === sessionId;
      } catch {
        return false;
      }
    });
    return found ?? null;
  }
}
