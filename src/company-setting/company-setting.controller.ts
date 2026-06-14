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
import { CompanySettingService } from './company-setting.service';
import { CreateCompanySettingDto } from './dto/create-company-setting.dto';
import { UpdateCompanySettingDto } from './dto/update-company-setting.dto';
import { AuthGuard, AuthRequest } from '../auth/guards/auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { CompanySetting } from './entities/company-setting.entity';

@ApiTags('Configurações da Empresa')
@Controller('company-settings')
export class CompanySettingController {
  constructor(private readonly companySettingService: CompanySettingService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar uma nova configuração de empresa' })
  @ApiResponse({
    status: 201,
    description: 'Configuração criada com sucesso',
    type: CompanySetting,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(
    @Body() createCompanySettingDto: CreateCompanySettingDto,
    @Req() request: AuthRequest,
  ) {
    const authHeader = request.headers['authorization'];
    return this.companySettingService.create(
      createCompanySettingDto,
      authHeader as string,
    );
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todas as configurações de empresas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de configurações retornada com sucesso',
    type: [CompanySetting],
  })
  findAll() {
    return this.companySettingService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar uma configuração de empresa pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da configuração', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Configuração encontrada com sucesso',
    type: CompanySetting,
  })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.companySettingService.findOneCompanyId(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar uma configuração de empresa pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da configuração', type: 'number' })
  @ApiBody({
    type: UpdateCompanySettingDto,
    description: 'Dados da configuração a serem atualizados',
    examples: {
      exemplo1: {
        value: {
          ValueHour: 10,
          ValueFractionHour: 5,
          autorecharge: true,
          timeTolerance: '00:15',
          pixExpirationTime: 15,
          companyId: 1,
          gateway: {
            PAYCO_CLIENT_ID:
              'establishments.e0716838-d040-4aab-a6bc-a36dbe2acffe',
            PAYCO_CLIENT_SECRET: 'seu-payco-client-secret',
          },
        },
        summary: 'Exemplo de atualização de configurações da empresa',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Configuração atualizada com sucesso',
    type: CompanySetting,
  })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompanySettingDto: UpdateCompanySettingDto,
    @Req() request: AuthRequest,
  ) {
    const authHeader = request.headers['authorization'];
    return this.companySettingService.update(
      id,
      updateCompanySettingDto,
      authHeader as string,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover uma configuração de empresa pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da configuração', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Configuração removida com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Configuração não encontrada' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() request: AuthRequest) {
    const authHeader = request.headers['authorization'];
    return this.companySettingService.remove(id, authHeader as string);
  }
}
