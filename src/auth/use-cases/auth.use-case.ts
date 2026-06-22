import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { AuthService } from '../ports/auth-service.interface';
import { USER_GATEWAY, UserGateway } from '../ports/user-gateway';

@Injectable()
export class AuthUseCase {
  constructor(
    @Inject('AuthService') private readonly authService: AuthService,
    @Inject(USER_GATEWAY) private readonly users: UserGateway,
  ) {}

  async login(
    username: string,
    password: string,
  ): Promise<{ accessToken: string; companyId: string | null }> {
    const user = await this.users.findByEmail(username);

    if (!user) {
      throw new NotFoundException('Usuario nao encontrado');
    }

    const accessToken = await this.authService.authenticate(username, password);

    return {
      accessToken,
      companyId: user.companyId !== null ? String(user.companyId) : null,
    };
  }

  async validateToken(token: string): Promise<boolean> {
    return this.authService.validateToken(token);
  }
}
