import { Inject, Injectable } from '@nestjs/common';
import { User, InvalidToken, AuthenticatedUserNotFound } from '../domain/user';
import { USER_REPOSITORY, UserRepository } from '../domain/ports/user.repository';
import { IDENTITY_PROVIDER, IdentityProvider } from '../domain/ports/identity-provider';

@Injectable()
export class GetAuthenticatedUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(IDENTITY_PROVIDER) private readonly identity: IdentityProvider,
  ) {}

  async execute(token: string): Promise<User> {
    if (!token || !token.startsWith('Bearer ')) {
      throw new InvalidToken();
    }

    const accessToken = token.replace('Bearer ', '');
    const external = await this.identity.getByAccessToken(accessToken);

    const user = await this.users.findByEmail(external.primary_email);
    if (!user) throw new AuthenticatedUserNotFound();

    return user;
  }
}
