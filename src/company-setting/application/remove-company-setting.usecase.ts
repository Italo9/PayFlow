import { Inject, Injectable } from '@nestjs/common';
import { COMPANY_SETTING_REPOSITORY, CompanySettingRepository } from '../domain/ports/company-setting.repository';
import { COMPANY_GATEWAY, CompanyGateway } from '../domain/ports/company-gateway';
import { REQUESTER_GATEWAY, RequesterGateway } from '../domain/ports/requester-gateway';
import { CompanyNotFound, CompanySettingNotFound } from '../domain/company-setting';

@Injectable()
export class RemoveCompanySettingUseCase {
  constructor(
    @Inject(COMPANY_SETTING_REPOSITORY) private readonly settings: CompanySettingRepository,
    @Inject(COMPANY_GATEWAY) private readonly companies: CompanyGateway,
    @Inject(REQUESTER_GATEWAY) private readonly requester: RequesterGateway,
  ) {}

  async execute(companyId: number, token: string): Promise<void> {
    const existing = await this.settings.findByCompanyId(companyId);
    if (!existing) throw new CompanySettingNotFound();
    await this.requester.getByToken(token);
    const exists = await this.companies.exists(companyId);
    if (!exists) throw new CompanyNotFound();
  }
}
