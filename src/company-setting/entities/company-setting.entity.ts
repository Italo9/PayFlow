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

@Entity('company_settings')
export class CompanySetting {
  @ApiProperty({ description: 'ID único da configuração', example: 1 })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: 'Limite de produtos no checkout', example: 10, required: false })
  @Column({ type: 'integer', name: 'limit_products_checkout', nullable: true })
  limitProductsCheckout: number;

  @ApiProperty({ description: 'Se a empresa tem pagamento por cartão', example: true, required: false })
  @Column({ type: 'boolean', name: 'carpayment', nullable: true })
  carpayment: boolean;

  @ApiProperty({ description: 'Empresa associada à configuração', type: () => Company })
  @ManyToOne(() => Company, (company) => company.companySetting, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @ApiProperty({
    description: 'Configuração do gateway de pagamento',
    example: {
      PAYCO_CLIENT_ID: "establishments.e0716838-d040-4aab-a6bc-a36dbe2acffe",
      PAYCO_CLIENT_SECRET: "seu-payco-client-secret"
    }
  })
  @Column({ type: 'jsonb', nullable: true })
  gateway: any;

  @ApiProperty({ description: 'Data de criação', example: '2023-01-01T00:00:00Z' })
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ApiProperty({ description: 'Data de atualização', example: '2023-01-01T00:00:00Z' })
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @Column({ type: 'bigint', name: 'companyId' })
  companyId: number;
}
