import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Checkout } from '../../domain/checkout';
import { CheckoutRepository, SaveCheckoutData } from '../../domain/ports/checkout.repository';
import { Checkout as CheckoutOrm } from '../../entities/checkout.entity';
import { CheckoutMapper } from './checkout.mapper';

@Injectable()
export class TypeOrmCheckoutRepository implements CheckoutRepository {
  constructor(
    @InjectRepository(CheckoutOrm)
    private readonly repo: Repository<CheckoutOrm>,
  ) {}

  async save(data: SaveCheckoutData): Promise<Checkout> {
    const entity = this.repo.create({
      qrcode: data.qrcode,
      total: data.total,
      paymentStatus: data.paymentStatus,
      companyId: data.companyId,
      cartId: data.cartId,
    });
    const saved = await this.repo.save(entity);
    return CheckoutMapper.toDomain(saved);
  }

  async findByCartId(cartId: number): Promise<Checkout | null> {
    const row = await this.repo.findOne({ where: { cartId }, relations: ['cart'] });
    return row ? CheckoutMapper.toDomain(row) : null;
  }

  async updateStatus(id: number, status: string): Promise<void> {
    await this.repo.update(id, { paymentStatus: status });
  }
}
