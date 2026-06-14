import {
  Injectable,
  BadRequestException,
  Inject,
  forwardRef,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreateUserStackDto } from '../auth/dto/users.use-case';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UserService } from '../user/user.service';
import * as QRCode from 'qrcode';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    private readonly dataSource: DataSource,
  ) {}

  async generateQrCode(data: string): Promise<string> {
    return QRCode.toDataURL(data);
  }

  async create(createCompanyDto: CreateCompanyDto, token: string) {
    const { user, ...companyData } = createCompanyDto;

    const existingCompany = await this.companyRepository.findOne({
      where: { email: companyData.email },
    });

    if (existingCompany) {
      throw new BadRequestException(
        'Já existe uma empresa cadastrada com este e-mail.',
      );
    }
    const existingCompanyCNPJ = await this.companyRepository.findOne({
      where: { cnpj: createCompanyDto.cnpj },
    });

    if (existingCompanyCNPJ) {
      throw new BadRequestException('Já existe uma empresa com este CNPJ');
    }
    const loggedUser = await this.userService.findByEmail(
      createCompanyDto.user.loggedUserEmail as string,
    );
    if (loggedUser?.role.toLocaleLowerCase() !== 'admin') {
      throw new BadRequestException(
        'Permitido o cadastro de empresa somente pelo perfil ADMIN',
      );
    }

    let response;
    let userCreate;
    let company;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (
        response?.response ===
        'O e-mail informado já está cadastrado no stack-auth.'
      ) {
        throw new BadRequestException(response.response);
      }

      const qrcode = await this.generateQrCode(companyData.cnpj);
      const company = this.companyRepository.create({
        ...companyData,
        qrcode,
      });

      try {
        await this.companyRepository.save(company);
      } catch (error) {
        console.error('Erro ao salvar empresa:', error);

        await this.userService.deleteUser(user.email).catch(console.error);
        throw new BadRequestException('Erro ao criar empresa', error.message);
      }

      if (company.id) {
        userCreate = await this.userService.create(
          {
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            companyId: company.id,
            role: user.role,
          },
          token,
        );
        await queryRunner.commitTransaction();
        return {
          "company": company.id,
          "message": "Empresa criada com sucesso"
        }
  
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Erro durante a criação:', error);

      if (company?.id) {
        const companyEntity = await this.companyRepository.findOne({
          where: { id: company.id },
        });
        if (companyEntity) {
          await this.companyRepository.remove(companyEntity);
          console.log(`Empresa ${company.id} removida devido a erro`);
        }
      }

      if (userCreate?.id) {
        await this.userService.remove(userCreate.id, token);
        console.log(`Usuário ${userCreate.id} removido do banco devido a erro`);
      }

      if (response?.id) {
        try {
          await this.userService.deleteUser(response.id);
          console.log(
            `Usuário ${response.id} removido do Stack Auth devido a erro`,
          );
        } catch (stackAuthError) {
          console.error(
            'Erro ao remover usuário do Stack Auth:',
            stackAuthError,
          );
        }
      }

      if (error.code === '23505') {
        throw new BadRequestException(
          'Já existe uma empresa cadastrada com este CNPJ.',
        );
      }
      if (error.code === '23502' && error.column === 'role') {
        throw new BadRequestException(
          'O campo "role" é obrigatório e não pode ser nulo.',
        );
      }
      throw error;
    }
  }

  async findAllProducts(companyId: string) {
    const company = await this.companyRepository.findOne({
      where: { id: Number(companyId) },
      relations: ['products'],
    });

    if (!company) {
      throw new BadRequestException('Empresa não encontrada');
    }

    return company.products;
  }

  async findAll(token) {
    const loggedUser = await this.userService.getUserByToken(token);

    if (!loggedUser || loggedUser.role != 'admin') {
      throw new BadRequestException(
        'Você não tem permissão para acessar esta página',
      );
    }

    const companies = await this.companyRepository.find();
    return companies;
  }

  async findAllByCompany(id: number) {
    return this.companyRepository.find({
      where: { id },
      relations: ['users'],
    });
  }

  async findOne(id: string) {
    const company = await this.companyRepository.findOne({
      where: { id: Number(id) },
      relations: ['users'],
    });

    if (!company) {
      throw new NotFoundException(`Empresa com ID ${id} não encontrada.`);
    }

    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, token: string) {
    const userByToken = await this.userService.getUserByToken(token);
    const company = await this.companyRepository.findOne({
      where: { id: Number(id) },
    });
    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }

    if (
      userByToken.role.toLowerCase() === 'admin' ||
      userByToken.company.id === company.id
    ) {
      await this.companyRepository.update(id, updateCompanyDto);
      return this.findOne(id);
    } else {
      throw new BadRequestException(
        'Você não tem permissão para atualizar esta empresa',
      );
    }
  }

  async remove(id: string, token: string) {
    const userByToken = await this.userService.getUserByToken(token);
    const company = await this.companyRepository.findOne({
      where: { id: Number(id) },
      relations: ['users'],
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }

    if (
      userByToken.role.toLowerCase() !== 'admin' &&
      userByToken.company.id !== company.id
    ) {
      throw new BadRequestException(
        'Você não tem permissão para deletar esta empresa',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const user of company.users) {
        try {
          await this.userService.deleteUser(user.email);
          console.log(`Usuário ${user.email} removido do Stack Auth.`);
        } catch (error) {
          console.error(
            `Erro ao remover usuário ${user.email} do Stack Auth:`,
            error,
          );
        }
      }

      await this.userService.removeByCompanyId(company);
      console.log(`Usuários da empresa ${company.id} removidos do banco.`);

      await this.companyRepository.delete(company.id);
      await queryRunner.commitTransaction();

      console.log(`Empresa ${company.id} deletada com sucesso.`);
      return { message: 'Empresa e usuários deletados com sucesso' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Erro ao deletar empresa e usuários:', error);
      throw new BadRequestException('Erro ao deletar empresa');
    } finally {
      await queryRunner.release();
    }
  }
}
