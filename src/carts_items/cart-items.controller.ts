import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Carrinho')
@Controller('cart')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Post('register_payment')
  @ApiOperation({ summary: 'Finalizar compra do carrinho' })
  @ApiQuery({ name: 'sessionId', description: 'ID da sessão', required: true })
  @ApiResponse({ status: 200, description: 'Checkout realizado com sucesso' })
  @ApiResponse({ status: 400, description: 'ID da sessão não fornecido' })
  async prepayment(@Body() body: { sessionId: string; companyId: number }) {
    if (!body.sessionId) {
      throw new BadRequestException('Session ID is required for checkout.');
    }

    return await this.cartItemsService.prepayment(body);
  }

  @Post('add')
  @ApiOperation({ summary: 'Adicionar produto ao carrinho' })
  @ApiQuery({ name: 'sessionId', description: 'ID da sessão', required: true })
  @ApiBody({
    schema: {
      properties: {
        productId: { type: 'string', example: '1' },
        quantity: { type: 'number', example: 1 },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Produto adicionado com sucesso',
    schema: {
      properties: {
        message: { type: 'string', example: 'Produto adicionado ao carrinho' },
        sessionId: { type: 'string', example: 'abc123' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async addToCart(
    @Query('sessionId') sessionId: string,
    @Body() body: { productId: string; quantity: number; companyId: number },
  ) {
    if (!body.productId || !body.quantity) {
      throw new BadRequestException(
        'Product ID and quantity must be provided.',
      );
    }

    const result = await this.cartItemsService.addToCart(
      sessionId,
      body.productId,
      body.quantity,
      body.companyId,
    );

    return {
      message: 'Produto adicionado ao carrinho',
      result,
    };
  }

  @Delete('remove')
  @ApiOperation({ summary: 'Remover produto do carrinho' })
  @ApiQuery({ name: 'sessionId', description: 'ID da sessão', required: true })
  @ApiQuery({ name: 'productId', description: 'ID do produto', required: true })
  @ApiResponse({
    status: 200,
    description: 'Produto removido com sucesso',
    schema: {
      properties: {
        message: { type: 'string', example: 'Produto removido do carrinho' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async removeFromCart(
    @Query('sessionId') sessionId: string,
    @Query('productId') productId: string,
  ) {
    if (!productId) {
      throw new BadRequestException('Product ID must be provided.');
    }

    const result = await this.cartItemsService.removeFromCart(
      sessionId,
      productId,
    );
    return result;
  }

  @Get()
  @ApiOperation({ summary: 'Obter carrinho' })
  @ApiQuery({ name: 'sessionId', description: 'ID da sessão', required: true })
  @ApiResponse({ status: 200, description: 'Carrinho obtido com sucesso' })
  async getCart(@Query('sessionId') sessionId: string) {
    return this.cartItemsService.getCart(sessionId);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Limpar carrinho' })
  @ApiQuery({ name: 'sessionId', description: 'ID da sessão', required: true })
  @ApiResponse({
    status: 200,
    description: 'Carrinho esvaziado com sucesso',
    schema: {
      properties: {
        message: { type: 'string', example: 'Carrinho esvaziado' },
      },
    },
  })
  async clearCart(@Query('sessionId') sessionId: string) {
    await this.cartItemsService.clearCart(sessionId);
    return { message: 'Carrinho esvaziado' };
  }
}
