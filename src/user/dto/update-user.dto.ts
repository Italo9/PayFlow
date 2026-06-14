import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsDate, IsNumber } from 'class-validator';
import { Company } from '../../company/entities/company.entity';

export class UpdateUserDto {
  @ApiProperty({ description: 'Nome do usuário', example: 'João', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Sobrenome do usuário', example: 'Silva', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ description: 'Email do usuário', example: 'joao.silva@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Senha do usuário', example: 'senha_hasheada', required: false })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ description: 'ID da empresa', example: 1, required: false })
  @IsOptional()
  @IsNumber()
  companyId?: number;

  @ApiProperty({ description: 'Papel/função do usuário', example: 'manager', required: false })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiProperty({ description: 'Data de criação', example: '2023-01-01T00:00:00Z', required: false })
  @IsOptional()
  created_at?: Date;

  @ApiProperty({ description: 'Data de atualização', example: '2023-01-01T00:00:00Z', required: false })
  @IsOptional()
  updated_at?: Date;

  @ApiProperty({ description: 'Usuário logado que está realizando a atualização', required: false })
  @IsOptional()
  @IsString()
  loggedUserEmail?: string;
}
