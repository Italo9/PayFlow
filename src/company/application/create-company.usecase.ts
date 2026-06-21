import { Inject, Injectable } from '@nestjs/common';
import { COMPANY_REPOSITORY, CompanyRepository } from '../domain/ports/company.repository';
import { USER_GATEWAY, UserGateway } from '../domain/ports/user-gateway';
import { QRCODE_GENERATOR, QrCodeGenerator } from '../domain/ports/qrcode-generator';
import { CompanyAlreadyExists, CompanyOperationNotAllowed } from '../domain/company';

export interface CreateCompanyInput {
  name: string;
  cnpj: string;
  active: boolean;
  carpayment?: boolean;
  peopleForContact?: string;
  phone?: string;
  email?: string;
  user: {
    name: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    loggedUserEmail?: string;
  };
}

@Injectable()
export class CreateCompanyUseCase {
  constructor(
    @Inject(COMPANY_REPOSITORY) private readonly companies: CompanyRepository,
    @Inject(USER_GATEWAY) private readonly users: UserGateway,
    @Inject(QRCODE_GENERATOR) private readonly qrcode: QrCodeGenerator,
  ) {}

  async execute(input: CreateCompanyInput, token: string) {
    const { user, ...companyData } = input;

    if (companyData.email && (await this.companies.findByEmail(companyData.email))) {
      throw new CompanyAlreadyExists('Ja existe uma empresa cadastrada com este e-mail.');
    }
    if (await this.companies.findByCnpj(companyData.cnpj)) {
      throw new CompanyAlreadyExists('Ja existe uma empresa com este CNPJ');
    }

    const loggedUser = await this.users.findByEmail(user.loggedUserEmail as string);
    if (loggedUser?.role.toLowerCase() !== 'admin') {
      throw new CompanyOperationNotAllowed('Permitido o cadastro de empresa somente pelo perfil ADMIN');
    }

    const qrcode = await this.qrcode.fromText(companyData.cnpj);

    let companyId: number | null = null;
    try {
      const company = await this.companies.create({
        name: companyData.name,
        cnpj: companyData.cnpj,
        active: companyData.active,
        carpayment: Boolean(companyData.carpayment),
        qrcode,
        peopleForContact: companyData.peopleForContact,
        phone: companyData.phone,
        email: companyData.email,
      });
      companyId = company.id;

      await this.users.createOwner(
        {
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
          companyId: company.id as number,
          role: user.role,
        },
        token,
      );

      return { company: company.id, message: 'Empresa criada com sucesso' };
    } catch (error) {
      if (companyId) await this.companies.delete(companyId).catch(() => undefined);
      await this.users.deleteAuthUser(user.email).catch(() => undefined);
      throw error;
    }
  }
}
