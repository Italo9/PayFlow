import { Inject, Injectable } from '@nestjs/common';
import { UserForbidden, UserNotFound } from '../domain/user';
import { USER_REPOSITORY, UserRepository } from '../domain/ports/user.repository';
import { GetRequesterUseCase } from './get-requester.usecase';

@Injectable()
export class RemoveUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    private readonly getRequester: GetRequesterUseCase,
  ) {}

  async execute(id: number, token: string) {
    const requester = await this.getRequester.execute(token);
    const user = await this.users.findById(id);
    if (!user) throw new UserNotFound();

    if (requester.isManager() && user.companyId !== requester.companyId) {
      throw new UserForbidden('Voce nao tem permissao para deletar este usuario');
    }

    await this.users.delete(id);
    return { message: 'Usuario removido com sucesso' };
  }
}
