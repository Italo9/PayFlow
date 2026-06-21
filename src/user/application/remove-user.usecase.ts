import { Inject, Injectable } from '@nestjs/common';
import { UserNotFound, UserOperationNotAllowed } from '../domain/user';
import { USER_REPOSITORY, UserRepository } from '../domain/ports/user.repository';
import { GetAuthenticatedUserUseCase } from './get-authenticated-user.usecase';

@Injectable()
export class RemoveUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    private readonly getAuthenticatedUser: GetAuthenticatedUserUseCase,
  ) {}

  async execute(id: number, token: string) {
    const acting = await this.getAuthenticatedUser.execute(token);

    const user = await this.users.findById(id);
    if (!user) throw new UserNotFound();

    if (acting.isManager() && user.companyId !== acting.companyId) {
      throw new UserOperationNotAllowed('Voce nao tem permissao para deletar este usuario');
    }

    await this.users.delete(id);
    return { message: 'Usuario removido com sucesso' };
  }
}
