import { Injectable } from '@nestjs/common';
import { CartItemsGateway, CheckoutCartItem } from '../../domain/ports/cart-items-gateway';
import { GetCartItemsUseCase } from '../../../carts_items/application/get-cart-items.usecase';

@Injectable()
export class CartItemsGatewayAdapter implements CartItemsGateway {
  constructor(private readonly getCartItems: GetCartItemsUseCase) {}

  async getItems(cartId: number): Promise<CheckoutCartItem[]> {
    const items = await this.getCartItems.execute(cartId);
    return items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      cartId: item.cart.id,
    }));
  }
}
