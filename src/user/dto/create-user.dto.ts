import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Nome do usuário' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Sobrenome do usuário' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Email do usuário' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha do usuário' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ description: 'ID da empresa' })
  @IsOptional()
  @IsNumber()
  companyId: number;

  @ApiProperty({ description: 'Papel/função do usuário' })
  @IsNotEmpty()
  @IsString()
  role: string;

  @ApiPropertyOptional({ description: 'Token de autenticação' })
  @IsOptional()
  @IsString()
  token?: string;

  @ApiPropertyOptional({ description: 'Email do usuário logado' })
  @IsOptional()
  @IsString()
  loggedUserEmail?: string;
}
