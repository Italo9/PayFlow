import { Injectable } from '@nestjs/common';
import { CompanyGateway, CompanyView } from '../../domain/ports/company-gateway';
import { CompanyService } from '../../../company/company.service';

@Injectable()
export class CompanyGatewayAdapter implements CompanyGateway {
  constructor(private readonly companyService: CompanyService) {}

  async findById(companyId: number): Promise<CompanyView | null> {
    const company = await this.companyService.findOne(String(companyId));
    if (!company) return null;
    return { id: company.id, carpayment: company.carpayment };
  }
}
