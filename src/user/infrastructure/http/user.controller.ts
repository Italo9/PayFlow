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
  create(@Body() dto: CreateUserDto, @Req() request: AuthRequest) {
    return this.createUser.execute(
      {
        name: dto.name,
        lastName: dto.lastName,
        email: dto.email,
        password: dto.password,
        companyId: dto.companyId,
        role: dto.role,
        loggedUserEmail: dto.loggedUserEmail,
        token: dto.token,
      },
      request.headers.authorization as string,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuarios' })
  findAll(@Req() request: AuthRequest) {
    return this.listUsers.execute(request.headers.authorization as string);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um usuario pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do usuario' })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() request: AuthRequest) {
    return this.getUser.execute(id, request.headers.authorization as string);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um usuario pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do usuario' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @Req() request: AuthRequest,
  ) {
    return this.updateUser.execute(
      id,
      {
        name: dto.name,
        lastName: dto.lastName,
        email: dto.email,
        password: dto.password,
        role: dto.role,
        companyId: dto.companyId,
      },
      request.headers.authorization as string,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um usuario pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do usuario' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() request: AuthRequest) {
    return this.removeUser.execute(id, request.headers.authorization as string);
  }
}
