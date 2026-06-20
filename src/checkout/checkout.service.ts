import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-checkout.dto';
import { AuthGatewayService } from '../auth/auth-gateway.service';
import * as QRCode from 'qrcode';
import { Checkout } from './entities/checkout.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItemsService } from '../carts_items/cart-items.service';
import { Cart } from '../carts/entities/cart.entity';
import { CartService } from '../carts/cart.service';
import { ProductService } from '../products/product.service';
import { ItemDto } from './dto/create-checkout.dto';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class CheckoutService {
  private readonly gatewayUrl: string = process.env.PAYCO_URL as string;
  private readonly webhookUrl: string = process.env.PAYCO_WEBHOOK_URL as string;

  constructor(
    @InjectRepository(Checkout)
    private readonly checkoutRepository: Repository<Checkout>,
    private readonly authService: AuthGatewayService,
    private readonly cartService: CartService,
    private readonly cartItemsService: CartItemsService,
    private readonly productService: ProductService,
    private readonly paymentService: PaymentService,
  ) {}

  async createPayment(
    createPaymentDto: CreatePaymentDto,
    companyId: number,
  ): Promise<{ qrCodePix: string; pixUrl: string }> {
    try {
      const { sessionId } = createPaymentDto;

      const cart: Cart = await this.cartService.findOneSessionId(
        sessionId as string,
      );
      if (!cart) {
        throw new NotFoundException(
          `Carrinho com sessionId ${sessionId} não encontrado`,
        );
      }
      const cartItems = await this.cartItemsService.getCartItems(cart.id);
      console.log('cartItems', cartItems);

      const items = (await Promise.all(
        cartItems.map(async (item) => {
          const product = await this.productService.findOne(item.product.id);
          if (!product) {
            throw new NotFoundException(
              `Produto com ID ${item.product.id} não encontrado`,
            );
          }

          return {
            name: product.name,
            quantity: String(item.quantity),
            amount: Number(product.price),
            code: sessionId,
          };
        }),
      )) as ItemDto[];
      console.log('arrayyy', items);

      const accessToken = await this.authService.getAccessToken(companyId);

      const paymentData: CreatePaymentDto = {
        items,
        customer: createPaymentDto.customer,
        shipping: {
          name: 'Nome do Destinatário',
          street: 'Rua Exemplo',
          number: '456',
          complement: '',
          neighborhood: 'Bairro Exemplo',
          city: 'Cidade Exemplo',
          state: 'SP',
          zip_code: '01020000',
        },
        allowed_methods: ['PIX'],
        discounts: [
          {
            method: 'CARD',
            type: 'PERCENTAGE',
            value: 10,
          },
        ],
        callback_url: createPaymentDto.callback_url,
      };
      const response = await fetch(
        `${this.gatewayUrl}/public-api/api/v1/checkout`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentData),
          redirect: 'follow',
        },
      );
      console.log('response', response);
      const responseText = await response.text();
      console.log('responseText', responseText);
      const result = JSON.parse(responseText);

      console.log('Dados do pagamento:', result);
      const now = new Date();
      const expirationDate = new Date(now.getTime() + 100 * 60 * 1000);
      const isoExpirationDate = expirationDate.toISOString();

      const responsePix = await fetch(
        `${this.gatewayUrl}/public-api/api/v1/checkout/${result.id}/payments/pix`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ expiration_date: isoExpirationDate }),
        },
      );

      const responseTextPix = await responsePix.text();
      const resultPix = JSON.parse(responseTextPix);
      console.log('resultPix resultPix:', resultPix);
      const pixUrl = resultPix.payment_methods.pix.qr_code;
      console.log('Código PIX:', pixUrl);

      const qrCodePix = await QRCode.toDataURL(pixUrl);

      const valor = resultPix.payment_methods.pix.final_amount;
      const paymentStatus = resultPix.payment_methods.pix.status as string;
      const cartId = cartItems[0].cart.id;
      console.log('tentando salvar', {
        qrcode: qrCodePix,
        total: Number(valor),
        paymentStatus,
        companyId,
        cartId,
      });
      await this.checkoutRepository.save({
        qrcode: qrCodePix,
        total: Number(valor),
        paymentStatus,
        companyId,
        cartId,
      });
      const paymentDetails = {
        companyId,
        status: paymentStatus,
        receivData: result,
      };

      await this.paymentService.processPayment(paymentDetails);
      return { qrCodePix, pixUrl };
    } catch (error) {
      console.error('Erro no pagamento:', error);

      if (error instanceof HttpException) {
        const errorResponse = error.getResponse();
        throw new HttpException(
          `Erro ao autenticar com o Payco: ${errorResponse['response']}`,
          error.getStatus(),
        );
      }

      throw new HttpException(
        'Erro no gateway de pagamento.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findCheckoutBySessionId(sessionId: number): Promise<Checkout | null> {
    try {
      const sessionResult = (await this.cartService.getSession(
        Number(sessionId),
      )) as Cart;
      return await this.checkoutRepository.findOne({
        where: { cartId: sessionResult.id },
        relations: ['carts'],
      });
    } catch (error) {
      console.error('Erro ao buscar checkout pelo SessionID:', error);
      throw new HttpException(
        'Erro ao buscar checkout',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findById(id: number): Promise<Checkout> {
    const checkout = await this.checkoutRepository.findOne({ where: { id } });

    if (!checkout) {
      throw new NotFoundException(`Checkout com ID ${id} não encontrado`);
    }

    return checkout;
  }

  async findBySessionId(sessionId: string): Promise<Checkout> {
    const cart = await this.cartService.findBySessionId(sessionId);

    const checkout = await this.checkoutRepository.findOne({
      where: { cart: { id: cart.id } },
      relations: ['cart'],
    });

    if (!checkout) {
      throw new NotFoundException(
        `Checkout para o cart ${cart.id} não encontrado`,
      );
    }

    return checkout;
  }

  async updateCheckoutStatus(
    sessionId: string,
    newStatus: string,
  ): Promise<void> {
    try {
      const checkout = await this.findBySessionId(sessionId);

      if (!checkout) {
        throw new HttpException(
          'Checkout não encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      checkout.paymentStatus = newStatus;
      await this.checkoutRepository.save(checkout);
    } catch (error) {
      console.error('Erro ao atualizar status do checkout:', error);
      throw new HttpException(
        'Erro ao atualizar status do checkout',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
