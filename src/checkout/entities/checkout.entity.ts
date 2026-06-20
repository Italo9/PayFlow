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
import { Cart } from '../../carts/entities/cart.entity';

@Entity('checkouts')
export class Checkout {
  @ApiProperty({ description: 'ID único do checkout', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Status do pagamento', example: 'pendente' })
  @Column({ name: 'payment_status', type: 'varchar', nullable: false})
  paymentStatus: string;

  @ApiProperty({ description: 'Valor total do checkout', example: 100 })
  @Column({ type: 'bigint' })
  total: number;

  @ApiProperty({ description: 'Código QR para pagamento', example: 'abc123xyz', required: false })
  @Column({ nullable: true })
  qrcode: string;

  @ApiProperty({ description: 'ID da empresa', example: 1 })
  @Column({ name: 'companyId' })
  companyId: number;
  @ManyToOne(() => Cart, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;
  @Column({ name: 'cart_id' })
  cartId: number;
  @ApiProperty({ description: 'Data de criação', example: '2023-01-01T00:00:00Z' })
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ApiProperty({ description: 'Data de atualização', example: '2023-01-01T00:00:00Z' })
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
