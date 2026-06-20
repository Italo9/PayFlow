import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../domain/product';
import { PRODUCT_REPOSITORY, ProductRepository } from '../domain/ports/product.repository';
import { QRCODE_GENERATOR, QrCodeGenerator } from '../domain/ports/qrcode-generator';
import { COMPANY_GATEWAY, CompanyGateway } from '../domain/ports/company-gateway';
import { CompanyNotFound } from '../domain/product';

export interface CreateProductInput {
  name: string;
  price: number;
  companyId: number;
}

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly products: ProductRepository,
    @Inject(QRCODE_GENERATOR) private readonly qrcode: QrCodeGenerator,
    @Inject(COMPANY_GATEWAY) private readonly companies: CompanyGateway,
  ) {}

  async execute(input: CreateProductInput): Promise<Product> {
    const company = await this.companies.findById(input.companyId);
    if (!company) throw new CompanyNotFound(input.companyId);

    const qrcode = await this.qrcode.fromText(
      `Produto: ${input.name}, Preco: ${input.price}, Empresa: ${input.companyId}`,
    );

    const product = new Product(null, input.name, input.price, input.companyId, qrcode);
    return this.products.save(product);
  }
}
