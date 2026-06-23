import { CartItem } from '../../entities/cart-items.entity';
import { CartItemView } from '../../domain/ports/cart-item.repository';

export class CartItemMapper {
  static toView(row: CartItem): CartItemView {
    return {
      id: row.id,
      quantity: row.quantity,
      product: { id: row.product?.id },
      cart: { id: row.cart?.id },
    };
  }
}
