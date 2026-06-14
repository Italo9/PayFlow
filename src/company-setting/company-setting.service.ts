import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanySetting } from './entities/company-setting.entity';
import { CreateCompanySettingDto } from './dto/create-company-setting.dto';
import { UpdateCompanySettingDto } from './dto/update-company-setting.dto';
import { CompanyService } from '../company/company.service';
import { UserService } from '../user/user.service';

@Injectable()
export class CompanySettingService {
  constructor(
    @InjectRepository(CompanySetting)
    private companySettingRepository: Repository<CompanySetting>,
    private readonly companyService: CompanyService,
    private readonly userService: UserService,
  ) {}

  async create(companysettingDto: CreateCompanySettingDto, token) {
    await this.checkPermission(companysettingDto.companyId, token); 
    const companySetting = this.companySettingRepository.create({
      ...companysettingDto,
      company: { id: companysettingDto.companyId }, 
    });
    return this.companySettingRepository.save(companySetting);
  }

  findAll() {
    return this.companySettingRepository.find({ relations: ['company'] });
  }

  findOne(id: number) {
    return this.companySettingRepository.findOne({
      where: { id },
      relations: ['company'],
    });
  }

  findOneCompanyId(companyId: number) {
    return this.companySettingRepository.findOne({
      where: { companyId },
      relations: ['company'],
    });
  }
  

  async update(
    id: number,
    updateCompanySettingDto: UpdateCompanySettingDto,
    token,
  ) {
    await this.checkPermission(
      Number(updateCompanySettingDto.companyId), 
      token,
    );
    const existing = await this.companySettingRepository.findOne({
      where: { id },
    });
    if (!existing) return null;

    return this.companySettingRepository.save({
      ...existing,
      ...updateCompanySettingDto,
    });
  }

  async findOneByCompanyId(companyId: number) {
    return this.companySettingRepository.findOne({
      where: { company: { id: companyId } }, 
      relations: ['company'],
    });
  }

  async remove(companyId: number, token: string) {
    const existingSetting = await this.findOneByCompanyId(companyId);

    if (!existingSetting) {
      throw new NotFoundException('Configuração da empresa não encontrada.');
    }
    const userByToken = await this.userService.getUserByToken(token);
    const company = await this.companyService.findOne(String(companyId));
    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }
  }

  async isCarPaymentActive(companyId: number): Promise<boolean> {
    const companySetting = await this.companySettingRepository.findOne({
      where: { company: { id: companyId } }, 
    });
    return companySetting ? companySetting.carpayment : false;
  }

  async checkPermission(companyId: number, token: string): Promise<void> {
    const userByToken = await this.userService.getUserByToken(token);
    const company = await this.companyService.findOne(String(companyId));
    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }
    if (
      !(userByToken.role.toLowerCase() === 'admin') ||
      !(userByToken.company.id === company.id)
    ) {
      throw new BadRequestException(
        'Você não tem permissão para atualizar esta empresa',
      );
    }
  }
}
