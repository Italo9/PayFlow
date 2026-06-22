import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../ports/auth-service.interface';
import { SessionService } from '../session.service';
import { USER_GATEWAY, UserGateway } from '../ports/user-gateway';

export interface AuthenticatedUser {
  id: number;
  email: string;
  role: string;
  companyId: number | null;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
  company?: { id: number } | null;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AuthService') private authService: AuthService,
    private readonly sessionService: SessionService,
    @Inject(USER_GATEWAY) private readonly users: UserGateway,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthRequest = context
      .switchToHttp()
      .getRequest<AuthRequest>();
    const authHeader: string = request.headers.authorization as string;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token nao fornecido');
    }

    const token: string = authHeader.split(' ')[1];
    const isValid: boolean = await this.authService.validateToken(token);

    if (!isValid) {
      throw new UnauthorizedException('Token invalido ou expirado');
    }

    const session = await this.sessionService.findByToken(token);
    if (!session) {
      throw new UnauthorizedException('Sessao nao encontrada');
    }

    const user = await this.users.findByEmail(session.email);
    if (!user) {
      throw new UnauthorizedException('Usuario logado nao encontrado');
    }

    request.user = user;
    request.company = user.companyId !== null ? { id: user.companyId } : null;

    return true;
  }
}
