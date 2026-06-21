import { Inject, Injectable } from '@nestjs/common';
import { User, UserForbidden, UserNotFound } from '../domain/user';
import { USER_REPOSITORY, UserRepository, UserPatch } from '../domain/ports/user.repository';
import { GetRequesterUseCase } from './get-requester.usecase';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    private readonly getRequester: GetRequesterUseCase,
  ) {}

  async execute(id: number, patch: UserPatch, token: string): Promise<User | null> {
    const requester = await this.getRequester.execute(token);
    const user = await this.users.findById(id);
    if (!user) throw new UserNotFound();

    if (requester.isManager() && user.companyId !== requester.companyId) {
      throw new UserForbidden('Voce nao tem permissao para editar este usuario');
    }

    await this.users.update(id, patch);
    return this.users.findById(id);
  }
}
