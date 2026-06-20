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
import { Product } from '../../products/entities/product.entity';
import { Cart } from '../../carts/entities/cart.entity'; 

@Entity('cart_items')
export class CartItem {
  @ApiProperty({ description: 'ID único do item do carrinho', example: 1 })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: 'Carrinho associado ao item', type: () => Cart })
  @ManyToOne(() => Cart, (cart) => cart.cartItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @ApiProperty({ description: 'Produto associado ao item', type: () => Product })
  @ManyToOne(() => Product, (product) => product.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ApiProperty({ description: 'Quantidade do produto', example: 2 })
  @Column({ type: 'int', default: 1 })
  quantity: number;

  @ApiProperty({ description: 'Data de criação', example: '2023-01-01T00:00:00Z' })
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ApiProperty({ description: 'Data de atualização', example: '2023-01-01T00:00:00Z' })
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
