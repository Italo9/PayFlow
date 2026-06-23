import { Inject, Injectable } from '@nestjs/common';
import { Cart, CartNotFound } from '../domain/cart';
import { CART_REPOSITORY, CartRepository } from '../domain/ports/cart.repository';

@Injectable()
export class GetCartBySessionUseCase {
  constructor(@Inject(CART_REPOSITORY) private readonly carts: CartRepository) {}

  async execute(sessionId: string): Promise<Cart> {
    const cart = await this.carts.findBySessionId(sessionId);
    if (!cart) throw new CartNotFound(sessionId);
    return cart;
  }
}
