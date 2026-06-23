export const CART_ITEMS_GATEWAY = Symbol('CHECKOUT_CART_ITEMS_GATEWAY');

export interface CheckoutCartItem {
  productId: number;
  quantity: number;
  cartId: number;
}

export interface CartItemsGateway {
  getItems(cartId: number): Promise<CheckoutCartItem[]>;
}
