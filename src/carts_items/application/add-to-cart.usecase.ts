import { Inject, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CART_STORE, CartStore } from '../domain/ports/cart-store';
import { PRODUCT_GATEWAY, ProductGateway } from '../domain/ports/product-gateway';
import { SETTINGS_GATEWAY, SettingsGateway } from '../domain/ports/settings-gateway';
import { PrepaymentUseCase } from './prepayment.usecase';

@Injectable()
export class AddToCartUseCase {
  constructor(
    @Inject(CART_STORE) private readonly store: CartStore,
    @Inject(PRODUCT_GATEWAY) private readonly products: ProductGateway,
    @Inject(SETTINGS_GATEWAY) private readonly settings: SettingsGateway,
    private readonly prepayment: PrepaymentUseCase,
  ) {}

  async execute(sessionId: string, productId: string, quantity: number, companyId: number) {
    if (isNaN(Number(productId)) || isNaN(quantity) || isNaN(companyId)) {
      throw new BadRequestException('Product ID, quantity, and company ID must be valid numbers.');
    }

    if (!sessionId) {
      sessionId = randomUUID();
    }

    const product = await this.products.getById(Number(productId));
    if (!product) {
      throw new NotFoundException('Produto nao encontrado.');
    }

    if (product.companyId !== companyId) {
      throw new BadRequestException('O produto informado nao pertence a empresa fornecida.');
    }

    const existingCompanyId = await this.store.getCompanyId(sessionId);
    if (existingCompanyId !== null && existingCompanyId !== companyId) {
      throw new BadRequestException('Nao e permitido adicionar produtos de empresas diferentes no mesmo carrinho.');
    }

    const carPaymentActive = await this.settings.isCarPaymentActive(companyId);
    if (!carPaymentActive) {
      return this.prepayment.execute({ sessionId, companyId });
    }

    const cartPayment = await this.store.getCartPayment(sessionId);
    const allowMultiple = cartPayment ? cartPayment.allowMultiple : true;
    const count = await this.store.itemCount(sessionId);

    if (!allowMultiple && count > 0) {
      throw new BadRequestException('Only one item is allowed in the cart.');
    }

    const existing = await this.store.getQuantity(sessionId, String(productId));
    const newQuantity = existing + quantity;

    await this.store.addItem(sessionId, String(productId), companyId, newQuantity);
    const items = await this.store.listItems(sessionId);

    return {
      message: 'Produto adicionado ao carrinho',
      result: { sessionId, items },
    };
  }
}
