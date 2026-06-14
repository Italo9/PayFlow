import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsEmail, Length } from 'class-validator';

export class UpdateCompanyDto {
  @ApiProperty({ description: 'Nome da empresa', example: 'Empresa UPDATE', required: false })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  name?: string;

  @ApiProperty({ description: 'CNPJ da empresa', example: '12345678901200', required: false })
  @IsString()
  @IsOptional()
  @Length(14, 14)
  cnpj?: string;

  @ApiProperty({ description: 'Código QR da empresa', example: 'abc123xyz000', required: false })
  @IsString()
  @IsOptional()
  qrcode?: string;

  @ApiProperty({ description: 'Status de atividade da empresa', example: true, required: false })
  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @ApiProperty({ description: 'Se a empresa tem carrinho de compras habilitado', example: false, required: false })
  @IsBoolean()
  @IsOptional()
  carpayment?: boolean;

  @ApiProperty({ description: 'Pessoa para contato', example: 'João Silva UPDATE', required: false })
  @IsOptional()
  @IsString()
  peopleForContact?: string;

  @ApiProperty({ description: 'Telefone da empresa', example: '(11) 98765-4300', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Email da empresa', example: 'contato@update.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;
}
