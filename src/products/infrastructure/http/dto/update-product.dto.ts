import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({ description: 'Nome do produto', example: 'Produto AB', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Preco do produto', example: 31.99, required: false })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;
}
