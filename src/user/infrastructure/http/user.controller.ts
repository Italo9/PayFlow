import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { AuthRequest } from '../../../auth/guards/auth.guard';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { UserPresenter } from './user.presenter';
import { CreateUserUseCase } from '../../application/create-user.usecase';
import { ListUsersUseCase } from '../../application/list-users.usecase';
import { GetUserUseCase } from '../../application/get-user.usecase';
import { UpdateUserUseCase } from '../../application/update-user.usecase';
import { RemoveUserUseCase } from '../../application/remove-user.usecase';

@ApiTags('Usuarios')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly listUsers: ListUsersUseCase,
    private readonly getUser: GetUserUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly removeUser: RemoveUserUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario criado com sucesso' })
  async create(@Body() dto: CreateUserDto, @Req() request: AuthRequest) {
    const user = await this.createUser.execute(dto, request.headers.authorization as string);
    return UserPresenter.toHttp(user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuarios' })
  async findAll(@Req() request: AuthRequest) {
    const users = await this.listUsers.execute(request.headers.authorization as string);
    return users.map(UserPresenter.toHttp);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um usuario pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do usuario' })
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() request: AuthRequest) {
    const user = await this.getUser.execute(id, request.headers.authorization as string);
    return UserPresenter.toHttp(user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um usuario pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do usuario' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @Req() request: AuthRequest,
  ) {
    const user = await this.updateUser.execute(
      id,
      {
        name: dto.name,
        lastName: dto.lastName,
        email: dto.email,
        password: dto.password,
        role: dto.role,
      },
      request.headers.authorization as string,
    );
    return user ? UserPresenter.toHttp(user) : null;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um usuario pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do usuario' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() request: AuthRequest) {
    return this.removeUser.execute(id, request.headers.authorization as string);
  }
}
