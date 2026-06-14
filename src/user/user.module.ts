import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { CompanyModule } from '../company/company.module';
import { StackAuthAdapter } from '../auth/adapters/stack-auth.adapter';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { config } from 'dotenv';

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
  providers: [UserService, StackAuthAdapter],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
