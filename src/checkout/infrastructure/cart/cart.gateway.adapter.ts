import { Injectable } from '@nestjs/common';
import { CartGateway, CartRef } from '../../domain/ports/cart-gateway';
import { GetCartBySessionUseCase } from '../../../carts/application/get-cart-by-session.usecase';

@Injectable()
export class CartGatewayAdapter implements CartGateway {
  constructor(private readonly getCartBySession: GetCartBySessionUseCase) {}

  async getBySessionId(sessionId: string): Promise<CartRef | null> {
    try {
      const cart = await this.getCartBySession.execute(sessionId);
      return { id: cart.id as number };
    } catch {
      return null;
    }
  }
}
