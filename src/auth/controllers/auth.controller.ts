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
import { GetCompanyUseCase } from '../../company/application/get-company.usecase';
import { Company } from '../../company/entities/company.entity';
import * as jwt from 'jsonwebtoken';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';
import { ValidateTokenDto } from '../dto/validate-token.dto';

@ApiTags('Autenticacao')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authUseCase: AuthUseCase,
    private readonly sessionService: SessionService,
    private readonly getCompany: GetCompanyUseCase,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Autenticar usuario e obter token JWT' })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    schema: {
      properties: {
        accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        companyId: { type: 'number', example: 1 },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciais invalidas' })
  async login(@Body() body: LoginDto) {
    const { email, password } = body;

    const { accessToken, companyId } = await this.authUseCase.login(email, password);
    const existingSession = await this.sessionService.findByEmail(email);

    const decodedToken = jwt.decode(accessToken, { complete: true }) as {
      header: { kid: string };
      payload: { exp: number };
    } | null;

    if (!decodedToken) {
      throw new UnauthorizedException('Token invalido');
    }

    const expirationDate = new Date(decodedToken.payload.exp * 1000);

    try {
      await this.getCompany.execute(Number(companyId));
    } catch {
      throw new NotFoundException('Empresa nao encontrada');
    }

    const companyRef = { id: Number(companyId) } as Company;

    if (existingSession) {
      if (existingSession.token !== accessToken) {
        await this.sessionService.updateStatus(String(existingSession.id), false);
        await this.sessionService.create({
          email,
          token: accessToken,
          status: true,
          expiredAt: expirationDate,
          company: companyRef,
        });
      }
    } else {
      await this.sessionService.create({
        email,
        token: accessToken,
        status: true,
        expiredAt: expirationDate,
        company: companyRef,
      });
    }

    return { accessToken, companyId };
  }

  @Post('validate')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validar token JWT' })
  @ApiResponse({ status: 200, description: 'Token valido', schema: { properties: { isValid: { type: 'boolean', example: true } } } })
  @ApiResponse({ status: 401, description: 'Token invalido ou expirado' })
  async validate(@Body() body: ValidateTokenDto) {
    const isValid = await this.authUseCase.validateToken(body.token);
    return { isValid };
  }
}
