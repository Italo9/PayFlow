import { Injectable } from '@nestjs/common';
import { Requester, RequesterGateway } from '../../domain/ports/requester-gateway';
import { GetAuthenticatedUserUseCase } from '../../../user/application/get-authenticated-user.usecase';

@Injectable()
export class RequesterGatewayAdapter implements RequesterGateway {
  constructor(private readonly getAuthenticatedUser: GetAuthenticatedUserUseCase) {}

  async getByToken(token: string): Promise<Requester> {
    const user = await this.getAuthenticatedUser.execute(token);
    return { role: user.role, companyId: user.companyId };
  }
}
