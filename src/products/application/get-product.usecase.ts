import { Inject, Injectable } from '@nestjs/common';
import { Product, ProductNotFound } from '../domain/product';
import { PRODUCT_REPOSITORY, ProductRepository } from '../domain/ports/product.repository';

@Injectable()
export class GetProductUseCase {
  constructor(@Inject(PRODUCT_REPOSITORY) private readonly products: ProductRepository) {}

  async execute(id: number): Promise<Product> {
    const product = await this.products.findById(id);
    if (!product) throw new ProductNotFound(id);
    return product;
  }
}
