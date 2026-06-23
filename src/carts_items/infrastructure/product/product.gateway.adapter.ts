import { Injectable } from '@nestjs/common';
import { ProductGateway, ProductView } from '../../domain/ports/product-gateway';
import { GetProductUseCase } from '../../../products/application/get-product.usecase';

@Injectable()
export class ProductGatewayAdapter implements ProductGateway {
  constructor(private readonly getProduct: GetProductUseCase) {}

  async getById(productId: number): Promise<ProductView | null> {
    try {
      const product = await this.getProduct.execute(productId);
      return { id: product.id as number, companyId: product.companyId };
    } catch {
      return null;
    }
  }
}
