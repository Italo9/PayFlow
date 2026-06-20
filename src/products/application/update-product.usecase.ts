import { Inject, Injectable } from '@nestjs/common';
import { Product, ProductNotFound } from '../domain/product';
import { PRODUCT_REPOSITORY, ProductRepository } from '../domain/ports/product.repository';

export interface UpdateProductInput {
  name?: string;
  price?: number;
}

@Injectable()
export class UpdateProductUseCase {
  constructor(@Inject(PRODUCT_REPOSITORY) private readonly products: ProductRepository) {}

  async execute(id: number, input: UpdateProductInput): Promise<Product> {
    const product = await this.products.findById(id);
    if (!product) throw new ProductNotFound(id);

    if (input.name !== undefined) product.rename(input.name);
    if (input.price !== undefined) product.reprice(input.price);

    return this.products.update(product);
  }
}
