import { Checkout } from '../checkout';

export const CHECKOUT_REPOSITORY = Symbol('CHECKOUT_REPOSITORY');

export interface SaveCheckoutData {
  qrcode: string;
  total: number;
  paymentStatus: string;
  companyId: number;
  cartId: number;
}

export interface CheckoutRepository {
  save(data: SaveCheckoutData): Promise<Checkout>;
  findByCartId(cartId: number): Promise<Checkout | null>;
  updateStatus(id: number, status: string): Promise<void>;
}
