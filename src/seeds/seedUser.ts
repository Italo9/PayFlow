import { AppDataSource } from '../../src/data-source';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../src/app.module';
import { CreateUserStackDto } from '../auth/dto/users.use-case';
import { User } from '../user/entities/user.entity';
import { Company } from '../company/entities/company.entity';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import * as QRCode from 'qrcode';

async function seedUser() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✅ Conectado ao banco de dados!');
    }

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UserService);

    const userRepository = queryRunner.manager.getRepository(User);
    const companyRepository = queryRunner.manager.getRepository(Company);

    const newCompany = companyRepository.create({
      name: 'ADMIN',
      cnpj: '11111111111111',
      active: true,
      carpayment: true,
      qrcode: await QRCode.toDataURL('11111111111111'),
      peopleForContact: 'Default Contact',
      phone: '0000000000',
      email: 'admin.company@example.com',
    });
    await companyRepository.save(newCompany);

    const hashedPassword = await bcrypt.hash('123456', 10);
    const newUser = userRepository.create({
      name: 'Admin',
      lastName: 'User',
      email: 'default.user@example.com',
      password: hashedPassword,
      company: newCompany,
      role: 'admin',
    });

    const userStackDto: CreateUserStackDto = {
      display_name: newUser.name,
      primary_email: newUser.email,
      primary_email_verified: true,
      primary_email_auth_enabled: true,
      password: '123456',
    };

    await usersService.createUser(userStackDto);
    await userRepository.save(newUser);

    await queryRunner.commitTransaction();
    console.log('✅ Usuário criado com sucesso!');

  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error);
  } finally {
    await AppDataSource.destroy();
    console.log('🔻 Conexão encerrada.');
  }
}

seedUser();
