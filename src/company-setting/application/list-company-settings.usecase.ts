import { Inject, Injectable } from '@nestjs/common';
import { CompanySetting } from '../domain/company-setting';
import { COMPANY_SETTING_REPOSITORY, CompanySettingRepository } from '../domain/ports/company-setting.repository';

@Injectable()
export class ListCompanySettingsUseCase {
  constructor(@Inject(COMPANY_SETTING_REPOSITORY) private readonly settings: CompanySettingRepository) {}

  execute(): Promise<CompanySetting[]> {
    return this.settings.findAll();
  }
}
