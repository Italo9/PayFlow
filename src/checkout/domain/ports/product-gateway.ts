export const PRODUCT_GATEWAY = Symbol('CHECKOUT_PRODUCT_GATEWAY');

export interface CheckoutProduct {
  name: string;
  price: number;
}

export interface ProductGateway {
  getById(productId: number): Promise<CheckoutProduct | null>;
}
