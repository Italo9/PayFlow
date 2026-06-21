import { Injectable } from '@nestjs/common';
import {
  UserGateway,
  GatewayUser,
  CreateOwnerInput,
} from '../../domain/ports/user-gateway';
import { UserService } from '../../../user/user.service';
import { Company } from '../../entities/company.entity';

@Injectable()
export class UserGatewayAdapter implements UserGateway {
  constructor(private readonly userService: UserService) {}

  async findByEmail(email: string): Promise<{ role: string } | null> {
    const user = await this.userService.findByEmail(email);
    return user ? { role: user.role } : null;
  }

  async getByToken(token: string): Promise<GatewayUser | null> {
    const user = await this.userService.getUserByToken(token);
    return { role: user.role, companyId: user.company?.id ?? null };
  }

  async createOwner(input: CreateOwnerInput, token: string): Promise<{ id: string | number }> {
    const user = await this.userService.create(
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
    return { id: user.id };
  }

  async removeUser(id: string, token: string): Promise<void> {
    await this.userService.remove(id, token);
  }

  async deleteAuthUser(email: string): Promise<void> {
    await this.userService.deleteUser(email);
  }

  async removeUsersByCompany(companyId: number): Promise<void> {
    await this.userService.removeByCompanyId({ id: companyId } as Company);
  }
}
