import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { AuthService } from '../ports/auth-service.interface';
import { UserService } from '../../user/user.service';

@Injectable()
export class AuthUseCase {
  constructor(
    @Inject('AuthService') private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async login(
    username: string,
    password: string,
  ): Promise<{ accessToken: string; companyId: string | null }> {
    const user = await this.userService.findByEmail(username);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const accessToken = await this.authService.authenticate(username, password);

    return {
      accessToken,
      companyId: String(user.company?.id) || null,
    };
  }

  async validateToken(token: string): Promise<boolean> {
    return this.authService.validateToken(token);
  }
}
