import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'ID da empresa associada ao produto', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  @ApiProperty({ description: 'Nome do produto', example: 'Produto A' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Preço do produto', example: 29.99 })
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
