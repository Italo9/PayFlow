export interface StoredCartItem {
  cart_sessionId?: string;
  cart_productId: number | string;
  cart_companyId?: string;
  quantity: string;
}

export interface CartPayment {
  allowMultiple: boolean;
}

export const CART_STORE = Symbol('CART_STORE');

export interface CartStore {
  listItems(sessionId: string): Promise<StoredCartItem[]>;
  getQuantity(sessionId: string, productId: string): Promise<number>;
  itemCount(sessionId: string): Promise<number>;
  getCompanyId(sessionId: string): Promise<number | null>;
  getCartPayment(sessionId: string): Promise<CartPayment | null>;
  addItem(sessionId: string, productId: string, companyId: number, quantity: number): Promise<void>;
  removeItem(sessionId: string, productId: string): Promise<boolean>;
  clear(sessionId: string): Promise<void>;
}
