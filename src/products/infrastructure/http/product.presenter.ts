import { Product } from '../../domain/product';

export class ProductPresenter {
  static toHttp(product: Product) {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      qrcode: product.qrcode,
      companyId: product.companyId,
      created_at: product.createdAt,
      updated_at: product.updatedAt,
    };
  }
}
