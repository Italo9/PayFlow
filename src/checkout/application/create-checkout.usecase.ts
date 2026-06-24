import {
  Inject,
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { CHECKOUT_REPOSITORY, CheckoutRepository } from '../domain/ports/checkout.repository';
import { CART_GATEWAY, CartGateway } from '../domain/ports/cart-gateway';
import { CART_ITEMS_GATEWAY, CartItemsGateway } from '../domain/ports/cart-items-gateway';
import { PRODUCT_GATEWAY, ProductGateway } from '../domain/ports/product-gateway';
import { PIX_GATEWAY, PixGateway, PixChargeItem } from '../domain/ports/pix-gateway';
import { QRCODE_GENERATOR, QrCodeGenerator } from '../domain/ports/qrcode-generator';
import { ProcessPaymentUseCase } from '../../payment/application/process-payment.usecase';

export interface CreateCheckoutInput {
  sessionId: string;
  customer: unknown;
  callback_url: string;
}

@Injectable()
export class CreateCheckoutUseCase {
  constructor(
    @Inject(CHECKOUT_REPOSITORY) private readonly checkouts: CheckoutRepository,
    @Inject(CART_GATEWAY) private readonly carts: CartGateway,
    @Inject(CART_ITEMS_GATEWAY) private readonly cartItems: CartItemsGateway,
    @Inject(PRODUCT_GATEWAY) private readonly products: ProductGateway,
    @Inject(PIX_GATEWAY) private readonly pix: PixGateway,
    @Inject(QRCODE_GENERATOR) private readonly qrcode: QrCodeGenerator,
    private readonly processPayment: ProcessPaymentUseCase,
  ) {}

  async execute(
    input: CreateCheckoutInput,
    companyId: number,
  ): Promise<{ qrCodePix: string; pixUrl: string }> {
    const cart = await this.carts.getBySessionId(input.sessionId);
    if (!cart) {
      throw new NotFoundException(`Carrinho com sessionId ${input.sessionId} nao encontrado`);
    }

    const cartItems = await this.cartItems.getItems(cart.id);
    if (cartItems.length === 0) {
      throw new NotFoundException(`Carrinho ${cart.id} nao possui itens`);
    }

    const items: PixChargeItem[] = await Promise.all(
      cartItems.map(async (item) => {
        const product = await this.products.getById(item.productId);
        if (!product) {
          throw new NotFoundException(`Produto com ID ${item.productId} nao encontrado`);
        }
        return {
          name: product.name,
          quantity: String(item.quantity),
          amount: Number(product.price),
          code: input.sessionId,
        };
      }),
    );

    try {
      const charge = await this.pix.createCharge(companyId, {
        items,
        customer: input.customer,
        callbackUrl: input.callback_url,
      });

      const qrCodePix = await this.qrcode.fromText(charge.pixCode);

      await this.checkouts.save({
        qrcode: qrCodePix,
        total: Number(charge.finalAmount),
        paymentStatus: charge.status,
        companyId,
        cartId: cartItems[0].cartId,
      });

      await this.processPayment.execute({
        companyId,
        status: charge.status,
        receivData: charge.raw,
      });

      return { qrCodePix, pixUrl: charge.pixCode };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Erro no pagamento:', error);
      throw new HttpException('Erro no gateway de pagamento.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
