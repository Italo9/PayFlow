import { Injectable } from '@nestjs/common';
import { GatewayUser, UserGateway } from '../../ports/user-gateway';
import { GetUserByEmailUseCase } from '../../../user/application/get-user-by-email.usecase';

@Injectable()
export class UserGatewayAdapter implements UserGateway {
  constructor(private readonly getUserByEmail: GetUserByEmailUseCase) {}

  async findByEmail(email: string): Promise<GatewayUser | null> {
    const user = await this.getUserByEmail.execute(email);
    if (!user) return null;
    return {
      id: user.id as number,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    };
  }
}
