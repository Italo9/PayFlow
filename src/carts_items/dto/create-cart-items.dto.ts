import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'ID do produto', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  @ApiProperty({ description: 'ID do carrinho', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  cart: number;

  @ApiProperty({ description: 'Quantidade do produto', example: 2 })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
