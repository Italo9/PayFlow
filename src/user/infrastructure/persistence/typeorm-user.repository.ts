import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/user';
import { NewUserData, UserPatch, UserRepository } from '../../domain/ports/user.repository';
import { User as UserOrm } from '../../entities/user.entity';
import { Company } from '../../../company/entities/company.entity';
import { UserMapper } from './user.mapper';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserOrm)
    private readonly repo: Repository<UserOrm>,
  ) {}

  async create(data: NewUserData): Promise<User> {
    const entity = this.repo.create({
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      role: data.role,
      company: { id: data.companyId } as Company,
    });
    const saved = await this.repo.save(entity);
    return UserMapper.toDomain(saved);
  }

  async findById(id: number): Promise<User | null> {
    const row = await this.repo.findOne({ where: { id }, relations: ['company'] });
    return row ? UserMapper.toDomain(row) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.repo.findOne({ where: { email }, relations: ['company'] });
    return row ? UserMapper.toDomain(row) : null;
  }

  async findByCompany(companyId: number): Promise<User[]> {
    const rows = await this.repo.find({
      where: { company: { id: companyId } },
      relations: ['company'],
    });
    return rows.map(UserMapper.toDomain);
  }

  async update(id: number, patch: UserPatch): Promise<void> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) return;
    if (patch.name !== undefined) entity.name = patch.name;
    if (patch.lastName !== undefined) entity.lastName = patch.lastName;
    if (patch.email !== undefined) entity.email = patch.email;
    if (patch.password !== undefined) entity.password = patch.password;
    if (patch.role !== undefined) entity.role = patch.role;
    if (patch.companyId !== undefined) entity.company = { id: patch.companyId } as Company;
    await this.repo.save(entity);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async deleteByCompany(companyId: number): Promise<void> {
    await this.repo.delete({ company: { id: companyId } });
  }
}
