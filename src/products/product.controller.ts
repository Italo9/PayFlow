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
  NotFoundException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CompanyService } from '../company/company.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Product } from './entities/product.entity';

@ApiTags('Produtos')
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly companyService: CompanyService,
  ) {}

  @Get('scan')
  @ApiOperation({ summary: 'Buscar produto pelo código QR' })
  @ApiQuery({ name: 'qrcode', description: 'Código QR do produto', required: true })
  @ApiQuery({ name: 'sessionId', description: 'ID da sessão', required: true })
  @ApiResponse({ 
    status: 200,
    description: 'Produto encontrado com sucesso',
    schema: {
      properties: {
        redirectToCheckout: { type: 'boolean', example: false },
        product: { $ref: '#/components/schemas/Product' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async getProductByQrCode(
    @Query('qrcode') qrcode: string,
    @Query('sessionId') sessionId: string,
  ) {
    const product = await this.productService.findByQrCode(qrcode);
    if (!product) throw new NotFoundException('Produto não encontrado');

    const company = await this.companyService.findOne(
      String(product.company.id),
    );

    if (!company || !company.carpayment) {
      return { redirectToCheckout: true, product };
    }

    return { redirectToCheckout: false, product };
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar um novo produto' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso', type: Product })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os produtos' })
  @ApiResponse({ status: 200, description: 'Lista de produtos retornada com sucesso', type: [Product] })
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar um produto pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do produto', type: 'number' })
  @ApiResponse({ status: 200, description: 'Produto encontrado com sucesso', type: Product })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar um produto pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do produto', type: 'number' })
  @ApiBody({ 
    type: UpdateProductDto,
    description: 'Dados do produto a serem atualizados',
    examples: {
      exemplo1: {
        value: {
          name: "Produto AB",
          price: 31.99
        },
        summary: 'Exemplo de atualização de produto'
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso', type: Product })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover um produto pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do produto', type: 'number' })
  @ApiResponse({ status: 200, description: 'Produto removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
