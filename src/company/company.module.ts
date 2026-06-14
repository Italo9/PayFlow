import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { Company } from './entities/company.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { UserService } from '../user/user.service';
import { ProductModule } from '../products/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, User]),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => ProductModule),
  ],
  controllers: [CompanyController],
  providers: [CompanyService, UserService],
  exports: [
    TypeOrmModule.forFeature([Company]),
    TypeOrmModule,
    CompanyService,
    TypeOrmModule,
  ],
})
export class CompanyModule {}
