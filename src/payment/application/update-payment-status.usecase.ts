import { Injectable } from '@nestjs/common';
import { Payment, PaymentNotFound } from '../domain/payment';
import { Inject } from '@nestjs/common';
import { PAYMENT_REPOSITORY, PaymentRepository } from '../domain/ports/payment.repository';
import { FindPaymentBySessionUseCase } from './find-payment-by-session.usecase';

@Injectable()
export class UpdatePaymentStatusUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY) private readonly payments: PaymentRepository,
    private readonly findBySession: FindPaymentBySessionUseCase,
  ) {}

  async execute(sessionId: string, status: string): Promise<Payment> {
    const payment = await this.findBySession.execute(sessionId);
    if (!payment) {
      throw new PaymentNotFound();
    }
    return this.payments.updateStatus(payment.id as number, status);
  }
}
