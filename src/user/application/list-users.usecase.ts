import { Inject, Injectable } from '@nestjs/common';
import { User } from '../domain/user';
import { USER_REPOSITORY, UserRepository } from '../domain/ports/user.repository';
import { GetRequesterUseCase } from './get-requester.usecase';

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    private readonly getRequester: GetRequesterUseCase,
  ) {}

  async execute(token: string): Promise<User[]> {
    const requester = await this.getRequester.execute(token);
    return this.users.findByCompany(requester.companyId as number);
  }
}
