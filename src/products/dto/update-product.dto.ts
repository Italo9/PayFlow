import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({ description: 'Nome do produto', example: 'Produto AB', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Preço do produto', example: 31.99, required: false })
  @IsNumber()
  @IsOptional()
  price?: number;
}
