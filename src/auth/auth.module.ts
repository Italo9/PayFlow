import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { AuthUseCase } from './use-cases/auth.use-case';
import { StackAuthAdapter } from './adapters/stack-auth.adapter';
import { AuthGuard } from './guards/auth.guard';
import { SessionService } from './session.service';
import { AuthGatewayService } from './auth-gateway.service';
import { Session } from './entities/session.entity';
import { USER_GATEWAY } from './ports/user-gateway';
import { UserGatewayAdapter } from './infrastructure/user/user.gateway.adapter';
import { UserModule } from '../user/user.module';
import { CompanyModule } from '../company/company.module';
import { CompanySettingModule } from '../company-setting/company-setting.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => CompanyModule),
    forwardRef(() => CompanySettingModule),
    TypeOrmModule.forFeature([Session]),
    ConfigModule.forRoot(),
  ],
  controllers: [AuthController],
  providers: [
    AuthGuard,
    { provide: 'AuthService', useClass: StackAuthAdapter },
    { provide: USER_GATEWAY, useClass: UserGatewayAdapter },
    AuthUseCase,
    SessionService,
    StackAuthAdapter,
    AuthGatewayService,
  ],
  exports: [
    'AuthService',
    AuthUseCase,
    SessionService,
    StackAuthAdapter,
    AuthGatewayService,
    AuthGuard,
    TypeOrmModule,
  ],
})
export class AuthModule {}
