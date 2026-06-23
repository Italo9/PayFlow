import { Inject, Injectable } from '@nestjs/common';
import { Cart, CartNotFound } from '../domain/cart';
import { CART_REPOSITORY, CartRepository } from '../domain/ports/cart.repository';

@Injectable()
export class GetCartByIdUseCase {
  constructor(@Inject(CART_REPOSITORY) private readonly carts: CartRepository) {}

  async execute(id: number): Promise<Cart> {
    const cart = await this.carts.findById(id);
    if (!cart) throw new CartNotFound(id);
    return cart;
  }
}
