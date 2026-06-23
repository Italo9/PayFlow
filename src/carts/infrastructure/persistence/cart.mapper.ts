import { Cart } from '../../domain/cart';
import { Cart as CartOrm } from '../../entities/cart.entity';

export class CartMapper {
  static toDomain(row: CartOrm): Cart {
    return new Cart(
      row.id,
      row.sessionId,
      row.company?.id ?? 0,
      row.created_at,
      row.updated_at,
    );
  }
}
