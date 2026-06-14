import {
  IsString,
  IsBoolean,
  IsOptional,
  IsEmail,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from './../../user/dto/create-user.dto';

export class CreateCompanyDto {
  @ApiProperty({ description: 'Nome da empresa', example: 'Empresa A' })
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiProperty({ description: 'CNPJ da empresa', example: '12345678901234' })
  @IsString()
  @Length(14, 14)
  cnpj: string;

  @ApiProperty({ description: 'Status de atividade da empresa', example: true })
  @IsBoolean()
  active: boolean;

  @ApiPropertyOptional({ description: 'Pessoa para contato', example: 'João Silva' })
  @IsOptional()
  @IsString()
  peopleForContact?: string;

  @ApiPropertyOptional({ description: 'Telefone da empresa', example: '(11) 98765-4321' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Email da empresa', example: 'contato@empresa.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Se a empresa tem carrinho de compras habilitado', example: false })
  @IsBoolean()
  carpayment?: boolean;

  @ApiProperty({ description: 'Dados do usuário administrador da empresa', type: () => CreateUserDto })
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;
}
