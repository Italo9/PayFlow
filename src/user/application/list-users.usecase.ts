import { Inject, Injectable } from '@nestjs/common';
import { User } from '../domain/user';
import { USER_REPOSITORY, UserRepository } from '../domain/ports/user.repository';
import { GetAuthenticatedUserUseCase } from './get-authenticated-user.usecase';

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    private readonly getAuthenticatedUser: GetAuthenticatedUserUseCase,
  ) {}

  async execute(token: string): Promise<User[]> {
    const acting = await this.getAuthenticatedUser.execute(token);
    return this.users.findByCompany(acting.companyId as number);
  }
}
