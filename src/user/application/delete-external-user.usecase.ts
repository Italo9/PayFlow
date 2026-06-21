import { Inject, Injectable } from '@nestjs/common';
import { IDENTITY_PROVIDER, IdentityProvider } from '../domain/ports/identity-provider';

@Injectable()
export class DeleteExternalUserUseCase {
  constructor(@Inject(IDENTITY_PROVIDER) private readonly identity: IdentityProvider) {}

  async execute(idOrEmail: string): Promise<void> {
    await this.identity.deleteUser(idOrEmail);
  }
}
