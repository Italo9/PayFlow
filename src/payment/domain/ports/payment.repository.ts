import { Payment } from '../payment';

export const PAYMENT_REPOSITORY = Symbol('PAYMENT_REPOSITORY');

export interface CreatePaymentData {
  companyId: number;
  status: string;
  receivData: unknown;
}

export interface PaymentRepository {
  create(data: CreatePaymentData): Promise<Payment>;
  findAll(): Promise<Payment[]>;
  updateStatus(id: number, status: string): Promise<Payment>;
}
