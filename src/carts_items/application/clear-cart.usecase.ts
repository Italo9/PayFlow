import { Inject, Injectable } from '@nestjs/common';
import { CART_STORE, CartStore } from '../domain/ports/cart-store';

@Injectable()
export class ClearCartUseCase {
  constructor(@Inject(CART_STORE) private readonly store: CartStore) {}

  async execute(sessionId: string): Promise<void> {
    await this.store.clear(sessionId);
  }
}
