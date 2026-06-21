import { Inject, Injectable } from '@nestjs/common';
import { CompanySetting, GatewayConfig } from '../domain/company-setting';
import { COMPANY_SETTING_REPOSITORY, CompanySettingRepository } from '../domain/ports/company-setting.repository';
import { COMPANY_GATEWAY, CompanyGateway } from '../domain/ports/company-gateway';
import { REQUESTER_GATEWAY, RequesterGateway } from '../domain/ports/requester-gateway';
import { ensureCanManageSettings } from './ensure-can-manage-settings';

export interface CreateCompanySettingInput {
  companyId: number;
  carpayment?: boolean;
  limitProductsCheckout?: number;
  gateway?: GatewayConfig;
}

@Injectable()
export class CreateCompanySettingUseCase {
  constructor(
    @Inject(COMPANY_SETTING_REPOSITORY) private readonly settings: CompanySettingRepository,
    @Inject(COMPANY_GATEWAY) private readonly companies: CompanyGateway,
    @Inject(REQUESTER_GATEWAY) private readonly requester: RequesterGateway,
  ) {}

  async execute(input: CreateCompanySettingInput, token: string): Promise<CompanySetting> {
    await ensureCanManageSettings(this.requester, this.companies, input.companyId, token);
    return this.settings.create({
      companyId: input.companyId,
      carpayment: input.carpayment,
      limitProductsCheckout: input.limitProductsCheckout,
      gateway: input.gateway,
    });
  }
}
