import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Company } from '../company/entities/company.entity';
import * as bcrypt from 'bcrypt';
import {
  CreateUserStackDto,
  UpdateUserStackDto,
} from '../auth/dto/users.use-case';
import { MailerService } from '@nestjs-modules/mailer';
import { StackAuthAdapter } from '../auth/adapters/stack-auth.adapter';
import { UserStackAuth } from '../auth/entities/user.entity';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly mailerService: MailerService,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private stackAuthAdapter: StackAuthAdapter,
  ) {}

  async createUser(userDto: CreateUserStackDto): Promise<UserStackAuth> {
    return await this.stackAuthAdapter.createUser(userDto);
  }

  async deleteUser(id: string): Promise<void> {
    return this.stackAuthAdapter.deleteUser(id);
  }
  async sendWelcomeEmail(
    userEmail: string,
    password: string,
    platformLink: string,
  ) {
    await this.mailerService.sendMail({
      to: userEmail,
      subject: 'Seja bem vindo!',
      template: 'welcome',
      context: {
        user: userEmail,
        password: password,
        platformLink: platformLink,
      },
    });
  }

  async create(createUserDto: CreateUserDto, token: string) {
    const userByToken = await this.getUserByToken(token);

    const company = await this.companyRepository.findOne({
      where: { id: createUserDto.companyId },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }

    if (
      userByToken.role.toLowerCase() !== 'admin' &&
      userByToken.company.id !== createUserDto.companyId
    ) {
      throw new BadRequestException(
        'Você não tem permissão para criar usuários nesta empresa',
      );
    }

    const formattedUser: CreateUserStackDto = {
      display_name: `${createUserDto.name} ${createUserDto.lastName}`,
      primary_email: createUserDto.email,
      password: createUserDto.password,
      client_metadata: {
        companyId: createUserDto.companyId,
        loggedUserEmail: createUserDto.loggedUserEmail || null,
      },
      server_metadata: {
        token: createUserDto.token || null,
      },
      primary_email_verified: true,
      primary_email_auth_enabled: true,
    };

    const response = await this.stackAuthAdapter.createUser(formattedUser);

    if (!response) {
      throw new BadRequestException(
        'Falha ao criar usuário no serviço externo',
      );
    }

    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
        company,
      });
      const result = await this.userRepository.save(user);

      await this.sendWelcomeEmail(
        result.email,
        createUserDto.password,
        'www.teste.com.br',
      );

      return result;
    } catch (error) {
      if (response?.data?.id) {
        await this.stackAuthAdapter.deleteUser(response.data.id);
      } else {
        console.warn('Não foi possível deletar usuário, ID indefinido.');
      }
      throw error;
    }
  }

  async findAll(token: string) {
    const userByToken = await this.getUserByToken(token);

    return this.userRepository.find({
      where: { company: { id: userByToken.company.id } },
      relations: ['company'],
    });
  }

  async findOne(id: string, token: string) {
    const user = await this.userRepository.findOne({
      where: { id: Number(id) },
      relations: ['company'],
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    
    const userByToken = await this.getUserByToken(token);
   
    if (
      userByToken.role.toLowerCase() === 'manager' &&
      user.company.id !== userByToken.company.id
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este usuário',
      );
    }

    return user;
  }

  async findOneCheckout(id: string) {
    const user = await this.userRepository.findOne({
      where: { id: Number(id) },
      relations: ['company'],
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['company'],
    });
    return user;
  }
  async update(id: string, updateUserDto: UpdateUserDto, token: string) {
    const userByToken = await this.getUserByToken(token);

    const user = await this.userRepository.findOne({
      where: { id: Number(id) },
      relations: ['company'],
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (
      userByToken.role.toLowerCase() === 'manager' &&
      user.company.id !== userByToken.company.id
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para editar este usuário',
      );
    }

    await this.userRepository.update(id, updateUserDto);

    return this.userRepository.findOne({ where: { id: Number(id) } });
  }

  async remove(id: string, token: string) {
    const userByToken = await this.getUserByToken(token);

    const user = await this.userRepository.findOne({
      where: { id: Number(id) },
      relations: ['company'],
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (
      userByToken.role.toLowerCase() === 'manager' &&
      user.company.id !== userByToken.company.id
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para deletar este usuário',
      );
    }

    await this.userRepository.remove(user);

    return { message: 'Usuário removido com sucesso' };
  }

  async getUserByToken(token: string) {
    if (!token || !token.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token inválido');
    }

    token = token.replace('Bearer ', '');
    const userData = await this.stackAuthAdapter.getUserByToken(token);

    const loggedUser = await this.userRepository.findOne({
      where: { email: userData.primary_email },
      relations: ['company'],
    });

    if (!loggedUser) {
      throw new UnauthorizedException('Usuário logado não encontrado');
    }

    return loggedUser;
  }
  async removeByCompanyId(company: Company) {
    await this.userRepository.delete({ company: { id: company.id } });
  }
}
