import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../../domain/payment';
import { PaymentRepository, CreatePaymentData } from '../../domain/ports/payment.repository';
import { Payment as PaymentOrm } from '../../entities/payment.entity';
import { PaymentMapper } from './payment.mapper';

@Injectable()
export class TypeOrmPaymentRepository implements PaymentRepository {
  constructor(
    @InjectRepository(PaymentOrm)
    private readonly repo: Repository<PaymentOrm>,
  ) {}

  async create(data: CreatePaymentData): Promise<Payment> {
    const entity = this.repo.create({
      companyId: data.companyId,
      status: data.status,
      receivData: data.receivData,
    });
    const saved = await this.repo.save(entity);
    return PaymentMapper.toDomain(saved);
  }

  async findAll(): Promise<Payment[]> {
    const rows = await this.repo.find();
    return rows.map(PaymentMapper.toDomain);
  }

  async updateStatus(id: number, status: string): Promise<Payment> {
    await this.repo.update(id, { status });
    const row = await this.repo.findOne({ where: { id } });
    return PaymentMapper.toDomain(row as PaymentOrm);
  }
}
