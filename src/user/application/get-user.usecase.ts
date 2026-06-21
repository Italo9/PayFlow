import { Inject, Injectable } from '@nestjs/common';
import { User, UserForbidden, UserNotFound } from '../domain/user';
import { USER_REPOSITORY, UserRepository } from '../domain/ports/user.repository';
import { GetRequesterUseCase } from './get-requester.usecase';

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    private readonly getRequester: GetRequesterUseCase,
  ) {}

  async execute(id: number, token: string): Promise<User> {
    const user = await this.users.findById(id);
    if (!user) throw new UserNotFound();

    const requester = await this.getRequester.execute(token);
    if (requester.isManager() && user.companyId !== requester.companyId) {
      throw new UserForbidden('Voce nao tem permissao para acessar este usuario');
    }
    return user;
  }
}
