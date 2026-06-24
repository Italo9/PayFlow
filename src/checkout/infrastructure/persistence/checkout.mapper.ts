import { Checkout } from '../../domain/checkout';
import { Checkout as CheckoutOrm } from '../../entities/checkout.entity';

export class CheckoutMapper {
  static toDomain(row: CheckoutOrm): Checkout {
    return new Checkout(
      row.id,
      row.paymentStatus,
      Number(row.total),
      row.qrcode,
      row.companyId,
      row.cartId,
    );
  }
}
