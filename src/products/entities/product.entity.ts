import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../../company/entities/company.entity';

@Entity('products')
export class Product {
  @ApiProperty({ description: 'ID único do produto', example: 1 })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: 'Nome do produto', example: 'Produto A' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ description: 'Preço do produto', example: 29.99 })
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ description: 'Código QR do produto', example: 'abc123xyz' })
  @Column({ type: 'text', name: 'qr_code' })
  qrcode: string;

  @ApiProperty({ description: 'Empresa associada ao produto', type: () => Company })
  @ManyToOne(() => Company, (company) => company.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ApiProperty({ description: 'Data de criação', example: '2023-01-01T00:00:00Z' })
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ApiProperty({ description: 'Data de atualização', example: '2023-01-01T00:00:00Z' })
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
