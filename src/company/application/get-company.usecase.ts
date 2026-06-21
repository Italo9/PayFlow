import { Inject, Injectable } from '@nestjs/common';
import { Company, CompanyNotFound } from '../domain/company';
import { COMPANY_REPOSITORY, CompanyRepository } from '../domain/ports/company.repository';

@Injectable()
export class GetCompanyUseCase {
  constructor(@Inject(COMPANY_REPOSITORY) private readonly companies: CompanyRepository) {}

  async execute(id: number): Promise<Company> {
    const company = await this.companies.findById(id);
    if (!company) throw new CompanyNotFound(id);
    return company;
  }
}
