export const PRODUCT_GATEWAY = Symbol('CART_ITEMS_PRODUCT_GATEWAY');

export interface ProductView {
  id: number;
  companyId: number;
}

export interface ProductGateway {
  getById(productId: number): Promise<ProductView | null>;
}
