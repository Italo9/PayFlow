import { Inject, Injectable } from '@nestjs/common';
import { User, UserNotFound, UserOperationNotAllowed } from '../domain/user';
import { USER_REPOSITORY, UserRepository } from '../domain/ports/user.repository';
import { GetAuthenticatedUserUseCase } from './get-authenticated-user.usecase';

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    private readonly getAuthenticatedUser: GetAuthenticatedUserUseCase,
  ) {}

  async execute(id: number, token: string): Promise<User> {
    const user = await this.users.findById(id);
    if (!user) throw new UserNotFound();

    const acting = await this.getAuthenticatedUser.execute(token);
    if (acting.isManager() && user.companyId !== acting.companyId) {
      throw new UserOperationNotAllowed('Voce nao tem permissao para acessar este usuario');
    }

    return user;
  }
}
