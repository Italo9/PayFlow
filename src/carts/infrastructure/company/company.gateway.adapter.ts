import { Injectable } from '@nestjs/common';
import { CompanyGateway } from '../../domain/ports/company-gateway';
import { GetCompanyUseCase } from '../../../company/application/get-company.usecase';

@Injectable()
export class CompanyGatewayAdapter implements CompanyGateway {
  constructor(private readonly getCompany: GetCompanyUseCase) {}

  async exists(companyId: number): Promise<boolean> {
    try {
      await this.getCompany.execute(companyId);
      return true;
    } catch {
      return false;
    }
  }
}
