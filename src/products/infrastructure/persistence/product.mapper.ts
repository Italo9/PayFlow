import { Product } from '../../domain/product';
import { ProductOrmEntity } from './product.orm-entity';

export class ProductMapper {
  static toDomain(row: ProductOrmEntity): Product {
    return new Product(
      row.id,
      row.name,
      Number(row.price),
      row.companyId,
      row.qrcode,
      row.created_at,
      row.updated_at,
    );
  }

  static toPersistence(product: Product): Partial<ProductOrmEntity> {
    return {
      ...(product.id ? { id: product.id } : {}),
      name: product.name,
      price: product.price,
      qrcode: product.qrcode,
      companyId: product.companyId,
    };
  }
}
