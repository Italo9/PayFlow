import { Inject, Injectable } from '@nestjs/common';
import { Product, ProductNotFound } from '../domain/product';
import { PRODUCT_REPOSITORY, ProductRepository } from '../domain/ports/product.repository';
import { COMPANY_GATEWAY, CompanyGateway } from '../domain/ports/company-gateway';

export interface ScanResult {
  redirectToCheckout: boolean;
  product: Product;
}

@Injectable()
export class ScanProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly products: ProductRepository,
    @Inject(COMPANY_GATEWAY) private readonly companies: CompanyGateway,
  ) {}

  async execute(qrcode: string): Promise<ScanResult> {
    const product = await this.products.findByQrCode(qrcode);
    if (!product) throw new ProductNotFound(qrcode);

    const company = await this.companies.findById(product.companyId);
    const redirectToCheckout = !company || !company.carpayment;
    return { redirectToCheckout, product };
  }
}
