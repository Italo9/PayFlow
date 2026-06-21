import { Inject, Injectable } from '@nestjs/common';
import { User, UserUnauthorized } from '../domain/user';
import { USER_REPOSITORY, UserRepository } from '../domain/ports/user.repository';
import { IDENTITY_PROVIDER, IdentityProvider } from '../domain/ports/identity-provider';

@Injectable()
export class GetRequesterUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(IDENTITY_PROVIDER) private readonly identity: IdentityProvider,
  ) {}

  async execute(token: string): Promise<User> {
    if (!token || !token.startsWith('Bearer ')) {
      throw new UserUnauthorized('Token invalido');
    }
    const raw = token.replace('Bearer ', '');
    const external = await this.identity.getByToken(raw);
    if (!external) throw new UserUnauthorized('Token invalido');

    const user = await this.users.findByEmail(external.email);
    if (!user) throw new UserUnauthorized('Usuario logado nao encontrado');
    return user;
  }
}
