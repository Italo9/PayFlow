import { Inject, Injectable } from '@nestjs/common';
import { CompanySetting, GatewayConfig } from '../domain/company-setting';
import { COMPANY_SETTING_REPOSITORY, CompanySettingRepository } from '../domain/ports/company-setting.repository';
import { COMPANY_GATEWAY, CompanyGateway } from '../domain/ports/company-gateway';
import { REQUESTER_GATEWAY, RequesterGateway } from '../domain/ports/requester-gateway';
import { ensureCanManageSettings } from './ensure-can-manage-settings';

export interface UpdateCompanySettingInput {
  companyId?: number;
  carpayment?: boolean;
  limitProductsCheckout?: number;
  gateway?: GatewayConfig;
}

@Injectable()
export class UpdateCompanySettingUseCase {
  constructor(
    @Inject(COMPANY_SETTING_REPOSITORY) private readonly settings: CompanySettingRepository,
    @Inject(COMPANY_GATEWAY) private readonly companies: CompanyGateway,
    @Inject(REQUESTER_GATEWAY) private readonly requester: RequesterGateway,
  ) {}

  async execute(id: number, input: UpdateCompanySettingInput, token: string): Promise<CompanySetting | null> {
    await ensureCanManageSettings(this.requester, this.companies, Number(input.companyId), token);
    const existing = await this.settings.findById(id);
    if (!existing) return null;
    return this.settings.update(id, {
      carpayment: input.carpayment,
      limitProductsCheckout: input.limitProductsCheckout,
      gateway: input.gateway,
    });
  }
}
