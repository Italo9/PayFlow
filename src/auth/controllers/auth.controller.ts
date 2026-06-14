import {
  Controller,
  Post,
  Body,
  UseGuards,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { AuthUseCase } from '../use-cases/auth.use-case';
import { AuthGuard } from '../guards/auth.guard';
import { SessionService } from '../session.service';
import { CompanyService } from '../../company/company.service';
import * as jwt from 'jsonwebtoken';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';
import { ValidateTokenDto } from '../dto/validate-token.dto';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authUseCase: AuthUseCase,
    private readonly sessionService: SessionService,
    private readonly companyService: CompanyService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Autenticar usuário e obter token JWT' })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    schema: {
      properties: {
        accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        companyId: { type: 'number', example: 1 }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() body: LoginDto) {
    const { email, password } = body;

    const { accessToken, companyId } = await this.authUseCase.login(
      email,
      password,
    );
    const existingSession = await this.sessionService.findByEmail(email);

    const decodedToken = jwt.decode(accessToken, { complete: true }) as {
      header: { kid: string };
      payload: { exp: number };
    } | null;

    if (!decodedToken) {
      throw new UnauthorizedException('Token inválido');
    }

    const expirationDate = new Date(decodedToken.payload.exp * 1000);
    const companyEntity = await this.companyService.findOne(String(companyId));

    if (!companyEntity) {
      throw new NotFoundException('Empresa não encontrada');
    }

    if (existingSession) {
      if (existingSession.token !== accessToken) {
        await this.sessionService.updateStatus(
          String(existingSession.id),
          false,
        );
        await this.sessionService.create({
          email,
          token: accessToken,
          status: true,
          expiredAt: expirationDate,
          company: companyEntity,
        });
      }
    } else {
      await this.sessionService.create({
        email,
        token: accessToken,
        status: true,
        expiredAt: expirationDate,
        company: companyEntity,
      });
    }

    return { accessToken, companyId };
  }

  @Post('validate')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validar token JWT' })
  @ApiResponse({ status: 200, description: 'Token válido', schema: { properties: { isValid: { type: 'boolean', example: true } } } })
  @ApiResponse({ status: 401, description: 'Token inválido ou expirado' })
  async validate(@Body() body: ValidateTokenDto) {
    const isValid = await this.authUseCase.validateToken(body.token);
    return { isValid };
  }
}
