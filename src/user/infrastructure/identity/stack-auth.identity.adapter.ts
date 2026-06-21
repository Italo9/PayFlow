import { Injectable } from '@nestjs/common';
import { ExternalUserInput, IdentityProvider } from '../../domain/ports/identity-provider';
import { StackAuthAdapter } from '../../../auth/adapters/stack-auth.adapter';
import { CreateUserStackDto } from '../../../auth/dto/users.use-case';

@Injectable()
export class StackAuthIdentityAdapter implements IdentityProvider {
  constructor(private readonly stackAuth: StackAuthAdapter) {}

  async createUser(input: ExternalUserInput): Promise<{ id: string | null }> {
    const dto: CreateUserStackDto = {
      display_name: `${input.name} ${input.lastName}`,
      primary_email: input.email,
      password: input.password,
      client_metadata: {
        companyId: input.companyId,
        loggedUserEmail: input.loggedUserEmail || null,
      },
      server_metadata: {
        token: input.token || null,
      },
      primary_email_verified: true,
      primary_email_auth_enabled: true,
    };
    const response = await this.stackAuth.createUser(dto);
    return { id: response?.data?.id ?? null };
  }

  async deleteUser(idOrEmail: string): Promise<void> {
    await this.stackAuth.deleteUser(idOrEmail);
  }

  async getByToken(token: string): Promise<{ email: string } | null> {
    const data = await this.stackAuth.getUserByToken(token);
    return data ? { email: data.primary_email } : null;
  }
}
