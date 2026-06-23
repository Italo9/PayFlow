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
import { ProductOrmEntity } from '../../products/infrastructure/persistence/product.orm-entity';
import { Cart } from '../../carts/entities/cart.entity';

@Entity('cart_items')
export class CartItem {
  @ApiProperty({ description: 'ID unico do item do carrinho', example: 1 })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: 'Carrinho associado ao item', type: () => Cart })
  @ManyToOne(() => Cart, (cart) => cart.cartItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @ApiProperty({ description: 'Produto associado ao item', type: () => ProductOrmEntity })
  @ManyToOne(() => ProductOrmEntity, (product) => product.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: ProductOrmEntity;

  @ApiProperty({ description: 'Quantidade do produto', example: 2 })
  @Column({ type: 'int', default: 1 })
  quantity: number;

  @ApiProperty({ description: 'Data de criacao', example: '2023-01-01T00:00:00Z' })
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ApiProperty({ description: 'Data de atualizacao', example: '2023-01-01T00:00:00Z' })
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
