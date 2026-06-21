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
import { CreateCompanySettingDto } from '../../dto/create-company-setting.dto';
import { UpdateCompanySettingDto } from '../../dto/update-company-setting.dto';
import { CreateCompanySettingUseCase } from '../../application/create-company-setting.usecase';
import { ListCompanySettingsUseCase } from '../../application/list-company-settings.usecase';
import { GetCompanySettingByCompanyUseCase } from '../../application/get-company-setting-by-company.usecase';
import { UpdateCompanySettingUseCase } from '../../application/update-company-setting.usecase';
import { RemoveCompanySettingUseCase } from '../../application/remove-company-setting.usecase';

@ApiTags('Configuracoes da Empresa')
@Controller('company-settings')
export class CompanySettingController {
  constructor(
    private readonly createSetting: CreateCompanySettingUseCase,
    private readonly listSettings: ListCompanySettingsUseCase,
    private readonly getSetting: GetCompanySettingByCompanyUseCase,
    private readonly updateSetting: UpdateCompanySettingUseCase,
    private readonly removeSetting: RemoveCompanySettingUseCase,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar uma nova configuracao de empresa' })
  @ApiResponse({ status: 201, description: 'Configuracao criada com sucesso' })
  create(@Body() dto: CreateCompanySettingDto, @Req() request: AuthRequest) {
    return this.createSetting.execute(dto, request.headers.authorization as string);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todas as configuracoes de empresas' })
  findAll() {
    return this.listSettings.execute();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar a configuracao de uma empresa pelo ID da empresa' })
  @ApiParam({ name: 'id', type: 'number' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getSetting.execute(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar uma configuracao de empresa pelo ID' })
  @ApiParam({ name: 'id', type: 'number' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCompanySettingDto,
    @Req() request: AuthRequest,
  ) {
    return this.updateSetting.execute(id, dto, request.headers.authorization as string);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover a configuracao de uma empresa pelo ID da empresa' })
  @ApiParam({ name: 'id', type: 'number' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() request: AuthRequest) {
    return this.removeSetting.execute(id, request.headers.authorization as string);
  }
}
