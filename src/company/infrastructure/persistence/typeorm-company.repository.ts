import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../../domain/company';
import {
  CompanyRepository,
  CompanyData,
  CompanyPatch,
  ProductSummary,
} from '../../domain/ports/company.repository';
import { Company as CompanyOrm } from '../../entities/company.entity';
import { CompanyMapper } from './company.mapper';

@Injectable()
export class TypeOrmCompanyRepository implements CompanyRepository {
  constructor(
    @InjectRepository(CompanyOrm)
    private readonly repo: Repository<CompanyOrm>,
  ) {}

  async create(data: CompanyData): Promise<Company> {
    const entity = this.repo.create(data);
    const saved = await this.repo.save(entity);
    return CompanyMapper.toDomain(saved);
  }

  async update(id: number, patch: CompanyPatch): Promise<void> {
    await this.repo.update(id, patch);
  }

  async findById(id: number): Promise<Company | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? CompanyMapper.toDomain(row) : null;
  }

  async findByEmail(email: string): Promise<Company | null> {
    const row = await this.repo.findOne({ where: { email } });
    return row ? CompanyMapper.toDomain(row) : null;
  }

  async findByCnpj(cnpj: string): Promise<Company | null> {
    const row = await this.repo.findOne({ where: { cnpj } });
    return row ? CompanyMapper.toDomain(row) : null;
  }

  async findAll(): Promise<Company[]> {
    const rows = await this.repo.find();
    return rows.map(CompanyMapper.toDomain);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async listProducts(companyId: number): Promise<ProductSummary[] | null> {
    const row = await this.repo.findOne({ where: { id: companyId }, relations: ['products'] });
    if (!row) return null;
    return (row.products ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      qrcode: p.qrcode,
    }));
  }

  async listUserEmails(companyId: number): Promise<string[]> {
    const row = await this.repo.findOne({ where: { id: companyId }, relations: ['users'] });
    if (!row || !row.users) return [];
    return row.users.map((u) => u.email);
  }
}
