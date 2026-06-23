import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { CartStore, CartPayment, StoredCartItem } from '../../domain/ports/cart-store';

@Injectable()
export class RedisCartStore implements CartStore {
  private readonly client: Redis;

  constructor() {
    this.client = new Redis();
  }

  async listItems(sessionId: string): Promise<StoredCartItem[]> {
    const productIds = await this.client.hkeys(sessionId);
    const items: StoredCartItem[] = [];
    for (const productId of productIds) {
      const item = await this.client.hgetall(`cart_info:${sessionId}:${productId}`);
      if (Object.keys(item).length > 0) {
        items.push({
          ...item,
          cart_productId: isNaN(Number(item.cart_productId))
            ? item.cart_productId
            : Number(item.cart_productId),
        } as StoredCartItem);
      }
    }
    return items;
  }

  async getQuantity(sessionId: string, productId: string): Promise<number> {
    const value = await this.client.hget(sessionId, productId);
    return value ? parseInt(value) : 0;
  }

  async itemCount(sessionId: string): Promise<number> {
    const keys = await this.client.hkeys(sessionId);
    return keys.length;
  }

  async getCompanyId(sessionId: string): Promise<number | null> {
    const value = await this.client.get(`cart_company:${sessionId}`);
    return value ? Number(value) : null;
  }

  async getCartPayment(sessionId: string): Promise<CartPayment | null> {
    const value = await this.client.get(`cart_payment:${sessionId}`);
    return value ? (JSON.parse(value) as CartPayment) : null;
  }

  async addItem(sessionId: string, productId: string, companyId: number, quantity: number): Promise<void> {
    await this.client.hset(sessionId, productId, quantity.toString());
    await this.client.set(`cart_company:${sessionId}`, companyId.toString());
    await this.client.hset(`cart_info:${sessionId}:${productId}`, {
      cart_sessionId: sessionId,
      cart_productId: productId,
      cart_companyId: companyId.toString(),
      quantity: quantity.toString(),
    });
  }

  async removeItem(sessionId: string, productId: string): Promise<boolean> {
    const removed = await this.client.hdel(sessionId, productId);
    await this.client.del(`cart_info:${sessionId}:${productId}`);
    return removed > 0;
  }

  async clear(sessionId: string): Promise<void> {
    await this.client.del(sessionId);
    await this.client.del(`cart_company:${sessionId}`);
  }
}
