import { Inject, Injectable } from '@nestjs/common';
import { CheckoutCartNotFound, CheckoutNotFound } from '../domain/checkout';
import { CHECKOUT_REPOSITORY, CheckoutRepository } from '../domain/ports/checkout.repository';
import { CART_GATEWAY, CartGateway } from '../domain/ports/cart-gateway';

@Injectable()
export class UpdateCheckoutStatusUseCase {
  constructor(
    @Inject(CHECKOUT_REPOSITORY) private readonly checkouts: CheckoutRepository,
    @Inject(CART_GATEWAY) private readonly carts: CartGateway,
  ) {}

  async execute(sessionId: string, newStatus: string): Promise<void> {
    const cart = await this.carts.getBySessionId(sessionId);
    if (!cart) throw new CheckoutCartNotFound(sessionId);

    const checkout = await this.checkouts.findByCartId(cart.id);
    if (!checkout) throw new CheckoutNotFound(cart.id);

    await this.checkouts.updateStatus(checkout.id as number, newStatus);
  }
}
