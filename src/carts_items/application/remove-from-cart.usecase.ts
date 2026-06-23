import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { CART_STORE, CartStore } from '../domain/ports/cart-store';

@Injectable()
export class RemoveFromCartUseCase {
  constructor(@Inject(CART_STORE) private readonly store: CartStore) {}

  async execute(sessionId: string, productId: string) {
    if (isNaN(Number(productId))) {
      throw new BadRequestException('Product ID must be a valid number.');
    }

    const removed = await this.store.removeItem(sessionId, productId);
    const items = await this.store.listItems(sessionId);

    return {
      message: removed ? 'Produto removido do carrinho' : 'Produto nao encontrado no carrinho',
      result: { sessionId, items },
    };
  }
}
