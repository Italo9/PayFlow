import { Injectable } from '@nestjs/common';
import { CompanyGateway } from '../../domain/ports/company-gateway';
import { GetCompanyUseCase } from '../../../company/application/get-company.usecase';

@Injectable()
export class CompanyGatewayAdapter implements CompanyGateway {
  constructor(private readonly getCompany: GetCompanyUseCase) {}

  async findById(companyId: number): Promise<{ id: number } | null> {
    try {
      const company = await this.getCompany.execute(companyId);
      return { id: company.id as number };
    } catch {
      return null;
    }
  }
}
