import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanySetting } from '../../domain/company-setting';
import {
  CompanySettingRepository,
  CreateSettingData,
  SettingPatch,
} from '../../domain/ports/company-setting.repository';
import { CompanySetting as CompanySettingOrm } from '../../entities/company-setting.entity';
import { CompanySettingMapper } from './company-setting.mapper';

@Injectable()
export class TypeOrmCompanySettingRepository implements CompanySettingRepository {
  constructor(
    @InjectRepository(CompanySettingOrm)
    private readonly repo: Repository<CompanySettingOrm>,
  ) {}

  async create(data: CreateSettingData): Promise<CompanySetting> {
    const entity = this.repo.create({
      companyId: data.companyId,
      company: { id: data.companyId },
      carpayment: data.carpayment,
      limitProductsCheckout: data.limitProductsCheckout,
      gateway: data.gateway,
    });
    const saved = await this.repo.save(entity);
    return CompanySettingMapper.toDomain(saved);
  }

  async findById(id: number): Promise<CompanySetting | null> {
    const row = await this.repo.findOne({ where: { id }, relations: ['company'] });
    return row ? CompanySettingMapper.toDomain(row) : null;
  }

  async findByCompanyId(companyId: number): Promise<CompanySetting | null> {
    const row = await this.repo.findOne({ where: { companyId }, relations: ['company'] });
    return row ? CompanySettingMapper.toDomain(row) : null;
  }

  async findAll(): Promise<CompanySetting[]> {
    const rows = await this.repo.find({ relations: ['company'] });
    return rows.map(CompanySettingMapper.toDomain);
  }

  async update(id: number, patch: SettingPatch): Promise<CompanySetting | null> {
    const fields: Partial<CompanySettingOrm> = {};
    if (patch.carpayment !== undefined) fields.carpayment = patch.carpayment;
    if (patch.limitProductsCheckout !== undefined) fields.limitProductsCheckout = patch.limitProductsCheckout;
    if (patch.gateway !== undefined) fields.gateway = patch.gateway;

    if (Object.keys(fields).length > 0) {
      await this.repo.update(id, fields);
    }
    return this.findById(id);
  }
}
