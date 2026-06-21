import { Inject, Injectable } from '@nestjs/common';
import { CompanyNotFound } from '../domain/company';
import { COMPANY_REPOSITORY, CompanyRepository, ProductSummary } from '../domain/ports/company.repository';

@Injectable()
export class ListCompanyProductsUseCase {
  constructor(@Inject(COMPANY_REPOSITORY) private readonly companies: CompanyRepository) {}

  async execute(companyId: number): Promise<ProductSummary[]> {
    const products = await this.companies.listProducts(companyId);
    if (products === null) throw new CompanyNotFound(companyId);
    return products;
  }
}
