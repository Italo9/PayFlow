import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/user';
import {
  UserRepository,
  CreateUserData,
  UpdateUserPatch,
} from '../../domain/ports/user.repository';
import { User as UserOrm } from '../../entities/user.entity';
import { UserMapper } from './user.mapper';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserOrm)
    private readonly repo: Repository<UserOrm>,
  ) {}

  async create(data: CreateUserData): Promise<User> {
    const entity = this.repo.create({
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      password: data.passwordHash,
      role: data.role,
      company: { id: data.companyId },
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

  async update(id: number, patch: UpdateUserPatch): Promise<void> {
    await this.repo.update(id, patch);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async deleteByCompany(companyId: number): Promise<void> {
    await this.repo.delete({ company: { id: companyId } });
  }
}
