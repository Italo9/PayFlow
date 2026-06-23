import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { CART_STORE, CartStore, StoredCartItem } from '../domain/ports/cart-store';

export interface CartResult {
  message: string;
  result: { sessionId: string; items: StoredCartItem[] };
}

@Injectable()
export class GetCartUseCase {
  constructor(@Inject(CART_STORE) private readonly store: CartStore) {}

  async execute(sessionId: string): Promise<CartResult> {
    if (!sessionId) {
      throw new BadRequestException('Session ID e obrigatorio.');
    }
    const items = await this.store.listItems(sessionId);
    if (items.length === 0) {
      return { message: 'Carrinho esta vazio', result: { sessionId, items: [] } };
    }
    return { message: 'Carrinho recuperado com sucesso', result: { sessionId, items } };
  }
}
