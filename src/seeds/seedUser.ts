import { AppDataSource } from '../../src/data-source';
import { User } from '../user/entities/user.entity';
import { Company } from '../company/entities/company.entity';
import * as bcrypt from 'bcrypt';
import * as QRCode from 'qrcode';

async function seedUser() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('Conectado ao banco de dados.');
    }

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const companyRepository = queryRunner.manager.getRepository(Company);
    const userRepository = queryRunner.manager.getRepository(User);

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
    await userRepository.save(newUser);

    await queryRunner.commitTransaction();
    console.log('Usuario criado com sucesso.');
  } catch (error) {
    console.error('Erro ao criar usuario:', error);
  } finally {
    await AppDataSource.destroy();
    console.log('Conexao encerrada.');
  }
}

seedUser();
