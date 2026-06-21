import { Company } from '../../domain/company';
import { Company as CompanyOrm } from '../../entities/company.entity';

export class CompanyMapper {
  static toDomain(row: CompanyOrm): Company {
    return new Company(
      row.id,
      row.name,
      row.cnpj,
      row.active,
      row.carpayment,
      row.qrcode ?? null,
      row.peopleForContact ?? null,
      row.phone ?? null,
      row.email ?? null,
    );
  }
}
