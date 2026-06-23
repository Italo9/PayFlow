import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { CART_ITEM_REPOSITORY, CartItemRepository } from '../domain/ports/cart-item.repository';
import { GetCartUseCase } from './get-cart.usecase';
import { CreateCartUseCase } from '../../carts/application/create-cart.usecase';

export interface PrepaymentInput {
  sessionId: string;
  companyId?: number;
}

@Injectable()
export class PrepaymentUseCase {
  constructor(
    @Inject(CART_ITEM_REPOSITORY) private readonly items: CartItemRepository,
    private readonly getCart: GetCartUseCase,
    private readonly createCart: CreateCartUseCase,
  ) {}

  async execute(data: PrepaymentInput) {
    const cart = await this.getCart.execute(data.sessionId);

    if (!cart.result.items || cart.result.items.length === 0) {
      throw new BadRequestException('Carrinho esta vazio.');
    }

    const persistentCart = await this.createCart.execute({
      sessionId: data.sessionId,
      companyId: data.companyId as number,
    });

    const toSave = cart.result.items.map((item) => {
      const productId = Number(item.cart_productId);
      const quantity = Number(item.quantity);

      if (isNaN(productId) || isNaN(quantity)) {
        throw new BadRequestException(
          `Produto ou quantidade invalida: ProdutoID=${item.cart_productId}, Quantidade=${item.quantity}`,
        );
      }

      return { cartId: persistentCart.id as number, productId, quantity };
    });

    await this.items.saveMany(toSave);

    return {
      message: 'Cadastro de produtos para compra iniciado com sucesso',
      sessionId: persistentCart.sessionId,
    };
  }
}
