import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from '../../entities/cart-items.entity';
import {
  CartItemRepository,
  CartItemToSave,
  CartItemView,
} from '../../domain/ports/cart-item.repository';
import { CartItemMapper } from './cart-item.mapper';

@Injectable()
export class TypeOrmCartItemRepository implements CartItemRepository {
  constructor(
    @InjectRepository(CartItem)
    private readonly repo: Repository<CartItem>,
  ) {}

  async saveMany(items: CartItemToSave[]): Promise<void> {
    const rows = items.map((item) => ({
      cart: { id: item.cartId },
      product: { id: item.productId },
      quantity: item.quantity,
    }));
    await this.repo.save(rows);
  }

  async findByCart(cartId: number): Promise<CartItemView[]> {
    const rows = await this.repo.find({
      where: { cart: { id: cartId } },
      relations: ['cart', 'product'],
    });
    return rows.map(CartItemMapper.toView);
  }
}
