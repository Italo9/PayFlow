import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AuthGuard, AuthRequest } from '../auth/guards/auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { Company } from './entities/company.entity';
import { Product } from '../products/entities/product.entity';

@ApiTags('Empresas')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar uma nova empresa' })
  @ApiResponse({
    status: 201,
    description: 'Empresa criada com sucesso',
    type: Company,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @Req() request: AuthRequest,
  ) {
    return this.companyService.create(
      createCompanyDto,
      request.headers.authorization as string,
    );
  }

  @Get('all')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todas as empresas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de empresas retornada com sucesso',
    type: [Company],
  })
  findAll(@Req() request: AuthRequest) {
    const authHeader = request.headers['authorization'];
    return this.companyService.findAll(authHeader as string);
  }

  @Get(':id/products')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os produtos de uma empresa' })
  @ApiParam({ name: 'id', description: 'ID da empresa' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos retornada com sucesso',
    type: [Product],
  })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  findAllProducts(@Param('id') id: string) {
    return this.companyService.findAllProducts(id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar uma empresa pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da empresa' })
  @ApiResponse({
    status: 200,
    description: 'Empresa encontrada com sucesso',
    type: Company,
  })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar uma empresa pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da empresa' })
  @ApiBody({
    type: UpdateCompanyDto,
    description: 'Dados da empresa a serem atualizados',
    examples: {
      exemplo1: {
        value: {
          name: 'Empresa UPDATE',
          cnpj: '12345678901200',
          qrcode: 'abc123xyz000',
          active: true,
          carpayment: false,
          peopleForContact: 'João Silva UPDATE',
          phone: '(11) 98765-4300',
          email: 'contato@update.com',
        },
        summary: 'Exemplo de atualização de empresa',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Empresa atualizada com sucesso',
    type: Company,
  })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Req() request: AuthRequest,
  ) {
    const authHeader = request.headers['authorization'];
    return this.companyService.update(
      id,
      updateCompanyDto,
      authHeader as string,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover uma empresa pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da empresa' })
  @ApiResponse({ status: 200, description: 'Empresa removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  remove(@Param('id') id: string, @Req() request: AuthRequest) {
    const authHeader = request.headers['authorization'];
    return this.companyService.remove(id, authHeader as string);
  }
}
