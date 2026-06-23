import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../../domain/cart';
import { CartRepository } from '../../domain/ports/cart.repository';
import { Cart as CartOrm } from '../../entities/cart.entity';
import { CartMapper } from './cart.mapper';

@Injectable()
export class TypeOrmCartRepository implements CartRepository {
  constructor(
    @InjectRepository(CartOrm)
    private readonly repo: Repository<CartOrm>,
  ) {}

  async create(sessionId: string, companyId: number): Promise<Cart> {
    const entity = this.repo.create({ sessionId, company: { id: companyId } });
    const saved = await this.repo.save(entity);
    return CartMapper.toDomain(saved);
  }

  async findById(id: number): Promise<Cart | null> {
    const row = await this.repo.findOne({ where: { id }, relations: ['company'] });
    return row ? CartMapper.toDomain(row) : null;
  }

  async findBySessionId(sessionId: string): Promise<Cart | null> {
    const row = await this.repo.findOne({ where: { sessionId }, relations: ['company'] });
    return row ? CartMapper.toDomain(row) : null;
  }
}
