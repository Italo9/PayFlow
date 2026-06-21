import { Inject, Injectable } from '@nestjs/common';
import { User, UserBadRequest, UserCompanyNotFound } from '../domain/user';
import { USER_REPOSITORY, UserRepository } from '../domain/ports/user.repository';
import { IDENTITY_PROVIDER, IdentityProvider } from '../domain/ports/identity-provider';
import { PASSWORD_HASHER, PasswordHasher } from '../domain/ports/password-hasher';
import { WELCOME_MAILER, WelcomeMailer } from '../domain/ports/welcome-mailer';
import { COMPANY_GATEWAY, CompanyGateway } from '../domain/ports/company-gateway';
import { GetRequesterUseCase } from './get-requester.usecase';

export interface CreateUserInput {
  name: string;
  lastName: string;
  email: string;
  password: string;
  companyId: number;
  role: string;
  loggedUserEmail?: string;
  token?: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(IDENTITY_PROVIDER) private readonly identity: IdentityProvider,
    @Inject(PASSWORD_HASHER) private readonly hasher: PasswordHasher,
    @Inject(WELCOME_MAILER) private readonly mailer: WelcomeMailer,
    @Inject(COMPANY_GATEWAY) private readonly companies: CompanyGateway,
    private readonly getRequester: GetRequesterUseCase,
  ) {}

  async execute(input: CreateUserInput, token: string): Promise<User> {
    const requester = await this.getRequester.execute(token);

    const company = await this.companies.findById(input.companyId);
    if (!company) throw new UserCompanyNotFound();

    if (!requester.isAdmin() && requester.companyId !== input.companyId) {
      throw new UserBadRequest('Voce nao tem permissao para criar usuarios nesta empresa');
    }

    const external = await this.identity.createUser({
      name: input.name,
      lastName: input.lastName,
      email: input.email,
      password: input.password,
      companyId: input.companyId,
      loggedUserEmail: input.loggedUserEmail,
      token: input.token,
    });

    try {
      const hashed = await this.hasher.hash(input.password);
      const user = await this.users.create({
        name: input.name,
        lastName: input.lastName,
        email: input.email,
        password: hashed,
        role: input.role,
        companyId: input.companyId,
      });
      await this.mailer.sendWelcome(user.email, input.password, 'www.teste.com.br');
      return user;
    } catch (error) {
      if (external.id) await this.identity.deleteUser(external.id);
      throw error;
    }
  }
}
