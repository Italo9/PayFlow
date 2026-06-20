import { Inject, Injectable } from '@nestjs/common';
import { ProductNotFound } from '../domain/product';
import { PRODUCT_REPOSITORY, ProductRepository } from '../domain/ports/product.repository';

@Injectable()
export class DeleteProductUseCase {
  constructor(@Inject(PRODUCT_REPOSITORY) private readonly products: ProductRepository) {}

  async execute(id: number): Promise<void> {
    const product = await this.products.findById(id);
    if (!product) throw new ProductNotFound(id);
    await this.products.delete(id);
  }
}
