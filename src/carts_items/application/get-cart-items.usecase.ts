import { Inject, Injectable } from '@nestjs/common';
import { CART_ITEM_REPOSITORY, CartItemRepository, CartItemView } from '../domain/ports/cart-item.repository';

@Injectable()
export class GetCartItemsUseCase {
  constructor(@Inject(CART_ITEM_REPOSITORY) private readonly items: CartItemRepository) {}

  execute(cartId: number): Promise<CartItemView[]> {
    return this.items.findByCart(cartId);
  }
}
