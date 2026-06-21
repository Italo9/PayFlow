import { Inject, Injectable } from '@nestjs/common';
import { Company, CompanyNotFound, CompanyOperationNotAllowed } from '../domain/company';
import { COMPANY_REPOSITORY, CompanyRepository, CompanyPatch } from '../domain/ports/company.repository';
import { USER_GATEWAY, UserGateway } from '../domain/ports/user-gateway';

@Injectable()
export class UpdateCompanyUseCase {
  constructor(
    @Inject(COMPANY_REPOSITORY) private readonly companies: CompanyRepository,
    @Inject(USER_GATEWAY) private readonly users: UserGateway,
  ) {}

  async execute(id: number, patch: CompanyPatch, token: string): Promise<Company> {
    const logged = await this.users.getByToken(token);
    const company = await this.companies.findById(id);
    if (!company) throw new CompanyNotFound(id);

    const allowed = logged && (logged.role.toLowerCase() === 'admin' || logged.companyId === company.id);
    if (!allowed) {
      throw new CompanyOperationNotAllowed('Voce nao tem permissao para atualizar esta empresa');
    }

    await this.companies.update(id, patch);
    return (await this.companies.findById(id)) as Company;
  }
}
