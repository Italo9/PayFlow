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
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard, AuthRequest } from '../../../auth/guards/auth.guard';
import { CreateCompanyDto } from '../../dto/create-company.dto';
import { UpdateCompanyDto } from '../../dto/update-company.dto';
import { CreateCompanyUseCase } from '../../application/create-company.usecase';
import { ListCompaniesUseCase } from '../../application/list-companies.usecase';
import { GetCompanyUseCase } from '../../application/get-company.usecase';
import { ListCompanyProductsUseCase } from '../../application/list-company-products.usecase';
import { UpdateCompanyUseCase } from '../../application/update-company.usecase';
import { RemoveCompanyUseCase } from '../../application/remove-company.usecase';

@ApiTags('Empresas')
@Controller('company')
export class CompanyController {
  constructor(
    private readonly createCompany: CreateCompanyUseCase,
    private readonly listCompanies: ListCompaniesUseCase,
    private readonly getCompany: GetCompanyUseCase,
    private readonly listCompanyProducts: ListCompanyProductsUseCase,
    private readonly updateCompany: UpdateCompanyUseCase,
    private readonly removeCompany: RemoveCompanyUseCase,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar uma nova empresa' })
  @ApiResponse({ status: 201, description: 'Empresa criada com sucesso' })
  create(@Body() dto: CreateCompanyDto, @Req() request: AuthRequest) {
    return this.createCompany.execute(dto, request.headers.authorization as string);
  }

  @Get('all')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todas as empresas' })
  findAll(@Req() request: AuthRequest) {
    return this.listCompanies.execute(request.headers.authorization as string);
  }

  @Get(':id/products')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os produtos de uma empresa' })
  @ApiParam({ name: 'id', description: 'ID da empresa' })
  findAllProducts(@Param('id', ParseIntPipe) id: number) {
    return this.listCompanyProducts.execute(id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar uma empresa pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da empresa' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getCompany.execute(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar uma empresa pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da empresa' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCompanyDto,
    @Req() request: AuthRequest,
  ) {
    return this.updateCompany.execute(id, dto, request.headers.authorization as string);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover uma empresa pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da empresa' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() request: AuthRequest) {
    return this.removeCompany.execute(id, request.headers.authorization as string);
  }
}
