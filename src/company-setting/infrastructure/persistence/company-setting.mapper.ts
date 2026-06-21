import { CompanySetting } from '../../domain/company-setting';
import { CompanySetting as CompanySettingOrm } from '../../entities/company-setting.entity';

export class CompanySettingMapper {
  static toDomain(row: CompanySettingOrm): CompanySetting {
    return new CompanySetting(
      row.id,
      row.companyId,
      row.carpayment ?? null,
      row.limitProductsCheckout ?? null,
      (row.gateway ?? null) as CompanySetting['gateway'],
    );
  }
}
