import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Company } from './../../company/entities/company.entity';

@Entity('users')
export class User {
  @ApiProperty({ description: 'ID único do usuário', example: 1 })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ApiProperty({ description: 'Nome do usuário', example: 'João' })
  @Column({ length: 255 })
  name: string;

  @ApiProperty({ description: 'Sobrenome do usuário', example: 'Silva' })
  @Column({ length: 255, nullable: true, name: 'lastName' })
  lastName: string;

  @ApiProperty({ description: 'Email do usuário', example: 'joao.silva@example.com' })
  @Column({ length: 255, unique: true })
  email: string;

  @ApiProperty({ description: 'Senha do usuário (hash)', example: 'senha_hasheada' })
  @Column({ length: 255 })
  password: string;

  @ApiProperty({ description: 'Empresa do usuário', type: () => Company })
  @ManyToOne(() => Company, (company) => company.users, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @ApiProperty({ description: 'Papel/função do usuário', example: 'admin' })
  @Column({ length: 255 })
  role: string;

  @ApiProperty({ description: 'Data de criação', example: '2023-01-01T00:00:00Z' })
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({ description: 'Data de atualização', example: '2023-01-01T00:00:00Z' })
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
