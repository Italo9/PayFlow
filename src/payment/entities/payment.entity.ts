import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('payment_webhooks')
export class Payment {
  @ApiProperty({ description: 'ID único do pagamento', example: 1 })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'company_id' })
  companyId: number;

  @Column()
  status: string;

  @Column({ name: 'received_data', type: 'jsonb', nullable: true })
  receivData: any;

  @ApiProperty({
    description: 'Data de criação',
    example: '2023-01-01T00:00:00Z',
  })
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ApiProperty({
    description: 'Data de atualização',
    example: '2023-01-01T00:00:00Z',
  })
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
