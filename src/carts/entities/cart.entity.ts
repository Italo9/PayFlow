import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Company } from './../../company/entities/company.entity';
import { CartItem } from '../../carts_items/entities/cart-items.entity';

@Entity('carts')
export class Cart {
  @ApiProperty({ description: 'ID único do carrinho', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID da sessão', example: 'abc123xyz' })
  @Column({ name: 'session_id', type: 'varchar', length: 255 })
  sessionId: string;

  @ApiProperty({
    description: 'Empresa associada ao carrinho',
    type: () => Company,
  })
  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ApiProperty({ description: 'Itens do carrinho', type: () => [CartItem] })
  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  cartItems: CartItem[];

  @ApiProperty({
    description: 'Data de criação',
    example: '2023-01-01T00:00:00Z',
  })
  @CreateDateColumn({ type: 'timestamptz', default: () => 'now()' })
  created_at: Date;

  @ApiProperty({
    description: 'Data de atualização',
    example: '2023-01-01T00:00:00Z',
  })
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'now()' })
  updated_at: Date;
}
