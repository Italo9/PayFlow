export const CART_GATEWAY = Symbol('CHECKOUT_CART_GATEWAY');

export interface CartRef {
  id: number;
}

export interface CartGateway {
  getBySessionId(sessionId: string): Promise<CartRef | null>;
}
