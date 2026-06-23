import { Inject, Injectable } from '@nestjs/common';
import { Payment } from '../domain/payment';
import { PAYMENT_REPOSITORY, PaymentRepository, CreatePaymentData } from '../domain/ports/payment.repository';

@Injectable()
export class ProcessPaymentUseCase {
  constructor(@Inject(PAYMENT_REPOSITORY) private readonly payments: PaymentRepository) {}

  execute(data: CreatePaymentData): Promise<Payment> {
    return this.payments.create(data);
  }
}
