import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { CompanyService } from '../company/company.service';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    forwardRef(() => CompanyModule),
  ],
  controllers: [ProductController],
  providers: [ProductService, CompanyService],
  exports: [ProductService, TypeOrmModule],
})
export class ProductModule {}
