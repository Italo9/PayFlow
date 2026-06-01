import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';
import { CheckoutModule } from './checkout/checkout.module';
import { PaymentModule } from './payment/payment.module';
import { CompanySettingModule } from './company-setting/company-setting.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: Number(config.get<string>('DB_PORT') ?? 5432),
        username: config.get<string>('DB_USER', 'postgres'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME', 'payckout'),
        synchronize: false,
        autoLoadEntities: true,
        migrationsTableName: 'migrations',
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        migrationsRun: true,
      }),
    }),
    UserModule,
    CompanyModule,
    CheckoutModule,
    PaymentModule,
    CompanySettingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
