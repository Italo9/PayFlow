import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../domain/product';
import { ProductRepository } from '../../domain/ports/product.repository';
import { ProductOrmEntity } from './product.orm-entity';
import { ProductMapper } from './product.mapper';

@Injectable()
export class TypeOrmProductRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repo: Repository<ProductOrmEntity>,
  ) {}

  async save(product: Product): Promise<Product> {
    const saved = await this.repo.save(ProductMapper.toPersistence(product));
    return ProductMapper.toDomain(saved as ProductOrmEntity);
  }

  async findById(id: number): Promise<Product | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? ProductMapper.toDomain(row) : null;
  }

  async findByQrCode(qrcode: string): Promise<Product | null> {
    const row = await this.repo.findOne({ where: { qrcode } });
    return row ? ProductMapper.toDomain(row) : null;
  }

  async findAll(): Promise<Product[]> {
    const rows = await this.repo.find();
    return rows.map(ProductMapper.toDomain);
  }

  async update(product: Product): Promise<Product> {
    const saved = await this.repo.save(ProductMapper.toPersistence(product));
    return ProductMapper.toDomain(saved as ProductOrmEntity);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
