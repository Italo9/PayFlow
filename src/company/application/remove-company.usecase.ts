import { Inject, Injectable } from '@nestjs/common';
import { CompanyNotFound, CompanyOperationNotAllowed } from '../domain/company';
import { COMPANY_REPOSITORY, CompanyRepository } from '../domain/ports/company.repository';
import { USER_GATEWAY, UserGateway } from '../domain/ports/user-gateway';

@Injectable()
export class RemoveCompanyUseCase {
  constructor(
    @Inject(COMPANY_REPOSITORY) private readonly companies: CompanyRepository,
    @Inject(USER_GATEWAY) private readonly users: UserGateway,
  ) {}

  async execute(id: number, token: string) {
    const logged = await this.users.getByToken(token);
    const company = await this.companies.findById(id);
    if (!company) throw new CompanyNotFound(id);

    const allowed = logged && (logged.role.toLowerCase() === 'admin' || logged.companyId === company.id);
    if (!allowed) {
      throw new CompanyOperationNotAllowed('Voce nao tem permissao para deletar esta empresa');
    }

    const emails = await this.companies.listUserEmails(id);
    for (const email of emails) {
      await this.users.deleteAuthUser(email).catch(() => undefined);
    }
    await this.users.removeUsersByCompany(id);
    await this.companies.delete(id);

    return { message: 'Empresa e usuarios deletados com sucesso' };
  }
}
