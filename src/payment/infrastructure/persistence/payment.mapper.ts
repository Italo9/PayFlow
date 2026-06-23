import { Payment } from '../../domain/payment';
import { Payment as PaymentOrm } from '../../entities/payment.entity';

export class PaymentMapper {
  static toDomain(row: PaymentOrm): Payment {
    return new Payment(row.id, row.companyId, row.status, row.receivData);
  }
}
