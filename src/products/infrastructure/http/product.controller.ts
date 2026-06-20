import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductPresenter } from './product.presenter';
import { CreateProductUseCase } from '../../application/create-product.usecase';
import { ListProductsUseCase } from '../../application/list-products.usecase';
import { GetProductUseCase } from '../../application/get-product.usecase';
import { UpdateProductUseCase } from '../../application/update-product.usecase';
import { DeleteProductUseCase } from '../../application/delete-product.usecase';
import { ScanProductUseCase } from '../../application/scan-product.usecase';

@ApiTags('Produtos')
@Controller('products')
export class ProductController {
  constructor(
    private readonly createProduct: CreateProductUseCase,
    private readonly listProducts: ListProductsUseCase,
    private readonly getProduct: GetProductUseCase,
    private readonly updateProduct: UpdateProductUseCase,
    private readonly deleteProduct: DeleteProductUseCase,
    private readonly scanProduct: ScanProductUseCase,
  ) {}

  @Get('scan')
  @ApiOperation({ summary: 'Buscar produto pelo codigo QR' })
  @ApiQuery({ name: 'qrcode', required: true })
  @ApiQuery({ name: 'sessionId', required: false })
  async scan(@Query('qrcode') qrcode: string) {
    const result = await this.scanProduct.execute(qrcode);
    return { redirectToCheckout: result.redirectToCheckout, product: ProductPresenter.toHttp(result.product) };
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar um novo produto' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
  async create(@Body() dto: CreateProductDto) {
    const product = await this.createProduct.execute(dto);
    return ProductPresenter.toHttp(product);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os produtos' })
  async findAll() {
    const products = await this.listProducts.execute();
    return products.map(ProductPresenter.toHttp);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar um produto pelo ID' })
  @ApiParam({ name: 'id', type: 'number' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const product = await this.getProduct.execute(id);
    return ProductPresenter.toHttp(product);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar um produto pelo ID' })
  @ApiParam({ name: 'id', type: 'number' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    const product = await this.updateProduct.execute(id, dto);
    return ProductPresenter.toHttp(product);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover um produto pelo ID' })
  @ApiParam({ name: 'id', type: 'number' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.deleteProduct.execute(id);
    return { message: 'Produto removido com sucesso' };
  }
}
