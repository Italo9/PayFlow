export const CART_ITEM_REPOSITORY = Symbol('CART_ITEM_REPOSITORY');

export interface CartItemToSave {
  cartId: number;
  productId: number;
  quantity: number;
}

export interface CartItemView {
  id: number;
  quantity: number;
  product: { id: number };
  cart: { id: number };
}

export interface CartItemRepository {
  saveMany(items: CartItemToSave[]): Promise<void>;
  findByCart(cartId: number): Promise<CartItemView[]>;
}
