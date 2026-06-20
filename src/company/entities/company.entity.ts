import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './../../user/entities/user.entity';
import { Session } from '../../auth/entities/session.entity';
import { CompanySetting } from '../../company-setting/entities/company-setting.entity';
import { ProductOrmEntity } from '../../products/infrastructure/persistence/product.orm-entity';

@Entity('companies')
export class Company {
  @ApiProperty({ description: 'ID unico da empresa', example: 1 })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: 'Nome da empresa', example: 'Empresa A' })
  @Column({ length: 255 })
  name: string;

  @ApiProperty({ description: 'CNPJ da empresa', example: '12345678901234' })
  @Column({ length: 14 })
  cnpj: string;

  @ApiProperty({ description: 'Codigo QR da empresa', example: 'abc123xyz', required: false })
  @Column({ nullable: true })
  qrcode: string;

  @ApiProperty({ description: 'Status de atividade da empresa', example: true })
  @Column({ type: 'boolean' })
  active: boolean;

  @ApiProperty({ description: 'Se a empresa tem pagamento por cartao', example: false })
  @Column({ type: 'boolean', default: false })
  carpayment: boolean;

  @ApiProperty({ description: 'Pessoa para contato', example: 'Joao Silva', required: false })
  @Column({ length: 255, nullable: true, name: 'peopleForContact' })
  peopleForContact?: string;

  @ApiProperty({ description: 'Telefone da empresa', example: '(11) 98765-4321', required: false })
  @Column({ type: 'varchar', nullable: true })
  phone?: string;

  @ApiProperty({ description: 'Email da empresa', example: 'contato@empresa.com', required: false })
  @Column({ nullable: true })
  email?: string;

  @ApiProperty({ description: 'Usuarios da empresa', type: () => [User] })
  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @ApiProperty({ description: 'Sessoes da empresa', type: () => [Session] })
  @OneToMany(() => Session, (session) => session.company, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
  })
  sessions: Session[];

  @ApiProperty({ description: 'Configuracoes da empresa', type: () => CompanySetting })
  @OneToOne(() => CompanySetting, (companySetting) => companySetting.company, {
    cascade: true,
  })
  @JoinColumn({ name: 'id' })
  companySetting: CompanySetting;

  @OneToMany(() => ProductOrmEntity, (product) => product.company)
  products: ProductOrmEntity[];

  @ApiProperty({ description: 'Data de criacao', example: '2023-01-01T00:00:00Z' })
  @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
  created_at: Date;

  @ApiProperty({ description: 'Data de atualizacao', example: '2023-01-01T00:00:00Z' })
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'now()' })
  updated_at: Date;
}
