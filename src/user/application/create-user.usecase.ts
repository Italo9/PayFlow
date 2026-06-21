import { Inject, Injectable } from '@nestjs/common';
import {
  User,
  CompanyNotFound,
  UserOperationNotAllowed,
  ExternalUserCreationFailed,
} from '../domain/user';
import { USER_REPOSITORY, UserRepository } from '../domain/ports/user.repository';
import { IDENTITY_PROVIDER, IdentityProvider } from '../domain/ports/identity-provider';
import { PASSWORD_HASHER, PasswordHasher } from '../domain/ports/password-hasher';
import { MAILER, Mailer } from '../domain/ports/mailer';
import { COMPANY_GATEWAY, CompanyGateway } from '../domain/ports/company-gateway';
import { GetAuthenticatedUserUseCase } from './get-authenticated-user.usecase';

export interface CreateUserInput {
  name: string;
  lastName: string;
  email: string;
  password: string;
  companyId: number;
  role: string;
  token?: string;
  loggedUserEmail?: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(IDENTITY_PROVIDER) private readonly identity: IdentityProvider,
    @Inject(PASSWORD_HASHER) private readonly hasher: PasswordHasher,
    @Inject(MAILER) private readonly mailer: Mailer,
    @Inject(COMPANY_GATEWAY) private readonly companies: CompanyGateway,
    private readonly getAuthenticatedUser: GetAuthenticatedUserUseCase,
  ) {}

  async execute(input: CreateUserInput, token: string): Promise<User> {
    const acting = await this.getAuthenticatedUser.execute(token);

    const company = await this.companies.findById(input.companyId);
    if (!company) throw new CompanyNotFound();

    if (!acting.isAdmin() && acting.companyId !== input.companyId) {
      throw new UserOperationNotAllowed('Voce nao tem permissao para criar usuarios nesta empresa');
    }

    const external = await this.identity.createExternal({
      display_name: `${input.name} ${input.lastName}`,
      primary_email: input.email,
      password: input.password,
      client_metadata: {
        companyId: input.companyId,
        loggedUserEmail: input.loggedUserEmail ?? null,
      },
      server_metadata: { token: input.token ?? null },
      primary_email_verified: true,
      primary_email_auth_enabled: true,
    });

    if (!external) throw new ExternalUserCreationFailed();

    try {
      const passwordHash = await this.hasher.hash(input.password);
      const user = await this.users.create({
        name: input.name,
        lastName: input.lastName,
        email: input.email,
        passwordHash,
        role: input.role,
        companyId: input.companyId,
      });

      await this.mailer.sendWelcome(user.email, input.password, 'www.teste.com.br');
      return user;
    } catch (error) {
      if (external.id) await this.identity.deleteExternal(external.id);
      throw error;
    }
  }
}
