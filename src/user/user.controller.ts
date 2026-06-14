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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { AuthRequest } from '../auth/guards/auth.guard';

@ApiTags('Usuários')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo usuário' })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createUserDto: CreateUserDto, @Req() request: AuthRequest) {
    return this.userService.create(
      createUserDto,
      request.headers.authorization as string,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
    type: [User],
  })
  findAll(@Req() request: AuthRequest) {
    return this.userService.findAll(request.headers.authorization as string);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um usuário pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado com sucesso',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  findOne(@Param('id') id: string, @Req() request: AuthRequest) {
    return this.userService.findOne(
      String(id),
      request.headers.authorization as string,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um usuário pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Dados do usuário a serem atualizados',
    examples: {
      exemplo1: {
        value: {
          name: 'João',
          lastName: 'Silva',
          email: 'joao.silva@example.com',
          password: 'senha_hasheada',
          companyId: 1,
          role: 'manager',
        },
        summary: 'Exemplo de atualização de usuário',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: Request,
  ) {
    const authHeader = request.headers['authorization'];
    return this.userService.update(
      String(id),
      updateUserDto,
      authHeader as string,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um usuário pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  remove(@Param('id') id: string, @Req() request: Request) {
    const authHeader = request.headers['authorization'];
    return this.userService.remove(String(id), authHeader as string);
  }
}
