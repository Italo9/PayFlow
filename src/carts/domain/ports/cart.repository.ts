import { Cart } from '../cart';

export const CART_REPOSITORY = Symbol('CART_REPOSITORY');

export interface CartRepository {
  create(sessionId: string, companyId: number): Promise<Cart>;
  findById(id: number): Promise<Cart | null>;
  findBySessionId(sessionId: string): Promise<Cart | null>;
}
