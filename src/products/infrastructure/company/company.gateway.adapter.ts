import { Injectable } from '@nestjs/common';
import { CompanyGateway, CompanyView } from '../../domain/ports/company-gateway';
import { GetCompanyUseCase } from '../../../company/application/get-company.usecase';

@Injectable()
export class CompanyGatewayAdapter implements CompanyGateway {
  constructor(private readonly getCompany: GetCompanyUseCase) {}

  async findById(companyId: number): Promise<CompanyView | null> {
    try {
      const company = await this.getCompany.execute(companyId);
      return { id: company.id as number, carpayment: company.carpayment };
    } catch {
      return null;
    }
  }
}
