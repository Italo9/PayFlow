import { Injectable } from '@nestjs/common';
import {
  UserGateway,
  GatewayUser,
  CreateOwnerInput,
} from '../../domain/ports/user-gateway';
import { GetUserByEmailUseCase } from '../../../user/application/get-user-by-email.usecase';
import { GetRequesterUseCase } from '../../../user/application/get-requester.usecase';
import { CreateUserUseCase } from '../../../user/application/create-user.usecase';
import { RemoveUserUseCase } from '../../../user/application/remove-user.usecase';
import { RemoveUsersByCompanyUseCase } from '../../../user/application/remove-users-by-company.usecase';
import { DeleteExternalUserUseCase } from '../../../user/application/delete-external-user.usecase';

@Injectable()
export class UserGatewayAdapter implements UserGateway {
  constructor(
    private readonly getUserByEmail: GetUserByEmailUseCase,
    private readonly getRequester: GetRequesterUseCase,
    private readonly createUser: CreateUserUseCase,
    private readonly removeUserUseCase: RemoveUserUseCase,
    private readonly removeUsersByCompanyUseCase: RemoveUsersByCompanyUseCase,
    private readonly deleteExternalUser: DeleteExternalUserUseCase,
  ) {}

  async findByEmail(email: string): Promise<{ role: string } | null> {
    const user = await this.getUserByEmail.execute(email);
    return user ? { role: user.role } : null;
  }

  async getByToken(token: string): Promise<GatewayUser | null> {
    const user = await this.getRequester.execute(token);
    return { role: user.role, companyId: user.companyId };
  }

  async createOwner(input: CreateOwnerInput, token: string): Promise<{ id: string | number }> {
    const user = await this.createUser.execute(
      {
        name: input.name,
        lastName: input.lastName,
        email: input.email,
        password: input.password,
        companyId: input.companyId,
        role: input.role,
      },
      token,
    );
    return { id: user.id as number };
  }

  async removeUser(id: string, token: string): Promise<void> {
    await this.removeUserUseCase.execute(Number(id), token);
  }

  async deleteAuthUser(email: string): Promise<void> {
    await this.deleteExternalUser.execute(email);
  }

  async removeUsersByCompany(companyId: number): Promise<void> {
    await this.removeUsersByCompanyUseCase.execute(companyId);
  }
}
