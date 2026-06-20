import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Redis } from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { CartItem } from './entities/cart-items.entity';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { CartService } from '../carts/cart.service';
import { CompanySettingService } from '../company-setting/company-setting.service';
@Injectable()
export class CartItemsService {
  private redisClient: Redis;

  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private readonly cartService: CartService,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private readonly companySettingService: CompanySettingService,
  ) {
    this.redisClient = new Redis();
  }

  async getCart(sessionId: string) {
    if (!sessionId) {
      throw new BadRequestException('Session ID é obrigatório.');
    }

    const productIds = await this.redisClient.hkeys(sessionId);

    if (productIds.length === 0) {
      return {
        message: 'Carrinho está vazio',
        result: {
          sessionId,
          items: [],
        },
      };
    }

    const items: any[] = [];

    for (const productId of productIds) {
      const item = await this.redisClient.hgetall(
        `cart_info:${sessionId}:${productId}`,
      );

      if (Object.keys(item).length > 0) {
        items.push({
          ...item,
          cart_productId: isNaN(Number(item.cart_productId))
            ? item.cart_productId
            : Number(item.cart_productId),
        });
      }
    }

    return {
      message: 'Carrinho recuperado com sucesso',
      result: {
        sessionId,
        items,
      },
    };
  }
  async prepayment(data) {
    const cartItems = await this.getCart(data.sessionId);
    console.log('Itens do carrinho:', cartItems.result.items);

    if (
      !cartItems ||
      !cartItems.result.items ||
      cartItems.result.items.length === 0
    ) {
      throw new BadRequestException('Carrinho está vazio.');
    }

    const cart = await this.cartService.create(data);
    console.log('deu bom', cart);

    const cartItemsToSave = cartItems.result.items.map((item) => {
      const validProductId = Number(item.cart_productId);
      const validQuantity = Number(item.quantity);

      if (isNaN(validProductId) || isNaN(validQuantity)) {
        throw new BadRequestException(
          `Produto ou quantidade inválida: ProdutoID=${item.cart_productId}, Quantidade=${item.quantity}`,
        );
      }

      return {
        cart,
        product: { id: validProductId },
        quantity: validQuantity,
      };
    });

    await this.cartItemRepository.save(cartItemsToSave);

    return {
      message: 'Cadastro de produtos para compra iniciado com sucesso',
      sessionId: cart.sessionId,
    };
  }
  async getCartItems(cartId: number): Promise<CartItem[]> {
    return await this.cartItemRepository.find({
      where: {
        cart: {
          id: cartId,
        },
      },
      relations: ['cart', 'product'],
    });
  }

  async addToCart(
    sessionId: string,
    productId: string,
    quantity: number,
    companyId: number,
  ) {
    if (isNaN(Number(productId)) || isNaN(quantity) || isNaN(companyId)) {
      throw new BadRequestException(
        'Product ID, quantity, and company ID must be valid numbers.',
      );
    }

    if (!sessionId) {
      sessionId = uuidv4();
      console.log(`Novo sessionId gerado: ${sessionId}`);
    }

    const cartCompanyKey = `cart_company:${sessionId}`;

    const cartItems = await this.redisClient.hgetall(sessionId);
    const existingCompanyId = await this.redisClient.get(cartCompanyKey);

    const product = await this.productRepository.findOne({
      where: { id: Number(productId) },
      relations: ['company'],
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }

    if (product.company?.id !== companyId) {
      throw new BadRequestException(
        'O produto informado não pertence à empresa fornecida.',
      );
    }

    if (existingCompanyId && Number(existingCompanyId) !== companyId) {
      throw new BadRequestException(
        'Não é permitido adicionar produtos de empresas diferentes no mesmo carrinho.',
      );
    }

    const isCarPaymentActive = await this.companySettingService.isCarPaymentActive(companyId);

    if (!isCarPaymentActive) {
      console.log('Pagamento de carrinho desativado, redirecionando para o prepayment...');
      return this.prepayment({ sessionId });
    }

    const cartPayment = await this.redisClient.get(`cart_payment:${sessionId}`);
    const allowMultipleItems = cartPayment
      ? JSON.parse(cartPayment).allowMultiple
      : true;

    if (!allowMultipleItems && Object.keys(cartItems).length > 0) {
      throw new BadRequestException('Only one item is allowed in the cart.');
    }

    const existingQuantity = cartItems[productId]
      ? parseInt(cartItems[productId])
      : 0;
    const newQuantity = existingQuantity + quantity;

    await this.redisClient.hset(sessionId, productId, newQuantity.toString());
    await this.redisClient.set(cartCompanyKey, companyId.toString());

    await this.redisClient.hset(`cart_info:${sessionId}:${productId}`, {
      cart_sessionId: sessionId,
      cart_productId: productId,
      cart_companyId: companyId.toString(),
      quantity: newQuantity.toString(),
    });

    const allProducts: any[] = [];
    const allProductIds = await this.redisClient.hkeys(sessionId);
    for (const pid of allProductIds) {
      const item = await this.redisClient.hgetall(`cart_info:${sessionId}:${pid}`);
      allProducts.push({
        ...item,
        cart_productId: isNaN(Number(item.cart_productId))
          ? item.cart_productId
          : Number(item.cart_productId),
      });
    }

    return {
      message: 'Produto adicionado ao carrinho',
      result: {
        sessionId,
        items: allProducts,
      },
    };
  }

  async removeFromCart(sessionId: string, productId: string) {
    if (isNaN(Number(productId))) {
      throw new BadRequestException('Product ID must be a valid number.');
    }

    const cartInfoKey = `cart_info:${sessionId}:${productId}`;

    const cartBefore = await this.redisClient.hgetall(sessionId);
    console.log(`📦 Carrinho antes da remoção:`, cartBefore);

    const removed = await this.redisClient.hdel(sessionId, productId);

    await this.redisClient.del(cartInfoKey);

    const remainingProductIds = await this.redisClient.hkeys(sessionId);

    const allProducts: any[] = [];

    for (const pid of remainingProductIds) {
      const item = await this.redisClient.hgetall(
        `cart_info:${sessionId}:${pid}`,
      );

      if (Object.keys(item).length > 0) {
        allProducts.push({
          ...item,
          cart_productId: isNaN(Number(item.cart_productId))
            ? item.cart_productId
            : Number(item.cart_productId),
        });
      }
    }

    const cartAfter = await this.redisClient.hgetall(sessionId);
    console.log(`🛒 Carrinho após a remoção:`, cartAfter);

    return {
      message: removed
        ? 'Produto removido do carrinho'
        : 'Produto não encontrado no carrinho',
      result: {
        sessionId,
        items: allProducts,
      },
    };
  }

  async clearCart(sessionId: string) {
    const cartCompanyKey = `cart_company:${sessionId}`;
    await this.redisClient.del(sessionId);
    await this.redisClient.del(cartCompanyKey);
  }

 
}
