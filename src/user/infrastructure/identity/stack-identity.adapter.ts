import { Injectable } from '@nestjs/common';
import { IdentityProvider, ExternalUserInput } from '../../domain/ports/identity-provider';
import { StackAuthAdapter } from '../../../auth/adapters/stack-auth.adapter';
import { CreateUserStackDto } from '../../../auth/dto/users.use-case';

@Injectable()
export class StackIdentityAdapter implements IdentityProvider {
  constructor(private readonly stackAuth: StackAuthAdapter) {}

  async createExternal(input: ExternalUserInput): Promise<{ id?: string }> {
    const response = await this.stackAuth.createUser(input as CreateUserStackDto);
    return { id: response?.data?.id };
  }

  async getByAccessToken(accessToken: string): Promise<{ primary_email: string }> {
    const data = await this.stackAuth.getUserByToken(accessToken);
    return { primary_email: data.primary_email };
  }

  async deleteExternal(idOrEmail: string): Promise<void> {
    await this.stackAuth.deleteUser(idOrEmail);
  }
}
