import { Injectable } from '@nestjs/common';
import { ProductGateway, CheckoutProduct } from '../../domain/ports/product-gateway';
import { GetProductUseCase } from '../../../products/application/get-product.usecase';

@Injectable()
export class ProductGatewayAdapter implements ProductGateway {
  constructor(private readonly getProduct: GetProductUseCase) {}

  async getById(productId: number): Promise<CheckoutProduct | null> {
    try {
      const product = await this.getProduct.execute(productId);
      return { name: product.name, price: product.price };
    } catch {
      return null;
    }
  }
}
