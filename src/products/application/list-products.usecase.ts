import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../domain/product';
import { PRODUCT_REPOSITORY, ProductRepository } from '../domain/ports/product.repository';

@Injectable()
export class ListProductsUseCase {
  constructor(@Inject(PRODUCT_REPOSITORY) private readonly products: ProductRepository) {}

  execute(): Promise<Product[]> {
    return this.products.findAll();
  }
}
