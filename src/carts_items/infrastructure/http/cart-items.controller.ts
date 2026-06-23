import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { GetCartUseCase } from '../../application/get-cart.usecase';
import { AddToCartUseCase } from '../../application/add-to-cart.usecase';
import { RemoveFromCartUseCase } from '../../application/remove-from-cart.usecase';
import { ClearCartUseCase } from '../../application/clear-cart.usecase';
import { PrepaymentUseCase } from '../../application/prepayment.usecase';

@ApiTags('Carrinho')
@Controller('cart')
export class CartItemsController {
  constructor(
    private readonly getCart: GetCartUseCase,
    private readonly addToCart: AddToCartUseCase,
    private readonly removeFromCart: RemoveFromCartUseCase,
    private readonly clearCart: ClearCartUseCase,
    private readonly prepayment: PrepaymentUseCase,
  ) {}

  @Post('register_payment')
  @ApiOperation({ summary: 'Finalizar compra do carrinho' })
  @ApiQuery({ name: 'sessionId', description: 'ID da sessao', required: true })
  @ApiResponse({ status: 200, description: 'Checkout realizado com sucesso' })
  @ApiResponse({ status: 400, description: 'ID da sessao nao fornecido' })
  async registerPayment(@Body() body: { sessionId: string; companyId: number }) {
    if (!body.sessionId) {
      throw new BadRequestException('Session ID is required for checkout.');
    }
    return this.prepayment.execute(body);
  }

  @Post('add')
  @ApiOperation({ summary: 'Adicionar produto ao carrinho' })
  @ApiQuery({ name: 'sessionId', description: 'ID da sessao', required: true })
  @ApiBody({
    schema: {
      properties: {
        productId: { type: 'string', example: '1' },
        quantity: { type: 'number', example: 1 },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Produto adicionado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados invalidos' })
  async add(
    @Query('sessionId') sessionId: string,
    @Body() body: { productId: string; quantity: number; companyId: number },
  ) {
    if (!body.productId || !body.quantity) {
      throw new BadRequestException('Product ID and quantity must be provided.');
    }
    const result = await this.addToCart.execute(sessionId, body.productId, body.quantity, body.companyId);
    return { message: 'Produto adicionado ao carrinho', result };
  }

  @Delete('remove')
  @ApiOperation({ summary: 'Remover produto do carrinho' })
  @ApiQuery({ name: 'sessionId', description: 'ID da sessao', required: true })
  @ApiQuery({ name: 'productId', description: 'ID do produto', required: true })
  @ApiResponse({ status: 200, description: 'Produto removido com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados invalidos' })
  async remove(
    @Query('sessionId') sessionId: string,
    @Query('productId') productId: string,
  ) {
    if (!productId) {
      throw new BadRequestException('Product ID must be provided.');
    }
    return this.removeFromCart.execute(sessionId, productId);
  }

  @Get()
  @ApiOperation({ summary: 'Obter carrinho' })
  @ApiQuery({ name: 'sessionId', description: 'ID da sessao', required: true })
  @ApiResponse({ status: 200, description: 'Carrinho obtido com sucesso' })
  async find(@Query('sessionId') sessionId: string) {
    return this.getCart.execute(sessionId);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Limpar carrinho' })
  @ApiQuery({ name: 'sessionId', description: 'ID da sessao', required: true })
  @ApiResponse({ status: 200, description: 'Carrinho esvaziado com sucesso' })
  async clear(@Query('sessionId') sessionId: string) {
    await this.clearCart.execute(sessionId);
    return { message: 'Carrinho esvaziado' };
  }
}
