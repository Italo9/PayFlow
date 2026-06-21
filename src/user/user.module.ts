import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { config } from 'dotenv';
import { User } from './entities/user.entity';
import { CompanyModule } from '../company/company.module';
import { AuthModule } from '../auth/auth.module';
import { StackAuthAdapter } from '../auth/adapters/stack-auth.adapter';
import { UserController } from './infrastructure/http/user.controller';
import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm-user.repository';
import { StackAuthIdentityAdapter } from './infrastructure/identity/stack-auth.identity.adapter';
import { BcryptPasswordHasher } from './infrastructure/security/bcrypt-password-hasher';
import { WelcomeMailerAdapter } from './infrastructure/mail/welcome-mailer.adapter';
import { CompanyGatewayAdapter } from './infrastructure/company/company.gateway.adapter';
import { USER_REPOSITORY } from './domain/ports/user.repository';
import { IDENTITY_PROVIDER } from './domain/ports/identity-provider';
import { PASSWORD_HASHER } from './domain/ports/password-hasher';
import { WELCOME_MAILER } from './domain/ports/welcome-mailer';
import { COMPANY_GATEWAY } from './domain/ports/company-gateway';
import { GetRequesterUseCase } from './application/get-requester.usecase';
import { CreateUserUseCase } from './application/create-user.usecase';
import { ListUsersUseCase } from './application/list-users.usecase';
import { GetUserUseCase } from './application/get-user.usecase';
import { GetUserForCheckoutUseCase } from './application/get-user-for-checkout.usecase';
import { GetUserByEmailUseCase } from './application/get-user-by-email.usecase';
import { UpdateUserUseCase } from './application/update-user.usecase';
import { RemoveUserUseCase } from './application/remove-user.usecase';
import { RemoveUsersByCompanyUseCase } from './application/remove-users-by-company.usecase';
import { DeleteExternalUserUseCase } from './application/delete-external-user.usecase';

config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => CompanyModule),
    forwardRef(() => AuthModule),
    ConfigModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      defaults: {
        from: process.env.SMTP_FROM,
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [UserController],
  providers: [
    { provide: USER_REPOSITORY, useClass: TypeOrmUserRepository },
    { provide: IDENTITY_PROVIDER, useClass: StackAuthIdentityAdapter },
    { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher },
    { provide: WELCOME_MAILER, useClass: WelcomeMailerAdapter },
    { provide: COMPANY_GATEWAY, useClass: CompanyGatewayAdapter },
    StackAuthAdapter,
    GetRequesterUseCase,
    CreateUserUseCase,
    ListUsersUseCase,
    GetUserUseCase,
    GetUserForCheckoutUseCase,
    GetUserByEmailUseCase,
    UpdateUserUseCase,
    RemoveUserUseCase,
    RemoveUsersByCompanyUseCase,
    DeleteExternalUserUseCase,
  ],
  exports: [
    GetRequesterUseCase,
    GetUserByEmailUseCase,
    GetUserForCheckoutUseCase,
    CreateUserUseCase,
    RemoveUserUseCase,
    RemoveUsersByCompanyUseCase,
    DeleteExternalUserUseCase,
    TypeOrmModule,
  ],
})
export class UserModule {}
