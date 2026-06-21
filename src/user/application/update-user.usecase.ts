import { Inject, Injectable } from '@nestjs/common';
import { User, UserNotFound, UserOperationNotAllowed } from '../domain/user';
import { USER_REPOSITORY, UserRepository, UpdateUserPatch } from '../domain/ports/user.repository';
import { GetAuthenticatedUserUseCase } from './get-authenticated-user.usecase';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    private readonly getAuthenticatedUser: GetAuthenticatedUserUseCase,
  ) {}

  async execute(id: number, patch: UpdateUserPatch, token: string): Promise<User | null> {
    const acting = await this.getAuthenticatedUser.execute(token);

    const user = await this.users.findById(id);
    if (!user) throw new UserNotFound();

    if (acting.isManager() && user.companyId !== acting.companyId) {
      throw new UserOperationNotAllowed('Voce nao tem permissao para editar este usuario');
    }

    await this.users.update(id, patch);
    return this.users.findById(id);
  }
}
