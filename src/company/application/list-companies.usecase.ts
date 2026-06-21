import { Inject, Injectable } from '@nestjs/common';
import { Company } from '../domain/company';
import { COMPANY_REPOSITORY, CompanyRepository } from '../domain/ports/company.repository';
import { USER_GATEWAY, UserGateway } from '../domain/ports/user-gateway';
import { CompanyOperationNotAllowed } from '../domain/company';

@Injectable()
export class ListCompaniesUseCase {
  constructor(
    @Inject(COMPANY_REPOSITORY) private readonly companies: CompanyRepository,
    @Inject(USER_GATEWAY) private readonly users: UserGateway,
  ) {}

  async execute(token: string): Promise<Company[]> {
    const logged = await this.users.getByToken(token);
    if (!logged || logged.role !== 'admin') {
      throw new CompanyOperationNotAllowed('Voce nao tem permissao para acessar esta pagina');
    }
    return this.companies.findAll();
  }
}
