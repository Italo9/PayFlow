import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ItemDto {
  @ApiProperty({ description: 'Nome do item', example: 'Produto A' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Quantidade do item', example: '1' })
  @IsString()
  @IsNotEmpty()
  quantity: string;

  @ApiProperty({ description: 'Valor do item', example: 29.99 })
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ description: 'Código do item', example: 'PROD-001' })
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class DocumentDto {
  @ApiProperty({ description: 'Tipo de documento', example: 'CPF' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Número do documento', example: '12345678901' })
  @IsString()
  @IsNotEmpty()
  number: string;
}

export class AddressDto {
  @ApiProperty({ description: 'Rua', example: 'Rua Exemplo' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ description: 'Número', example: '123' })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiPropertyOptional({ description: 'Complemento', example: 'Apto 101' })
  @IsString()
  @IsOptional()
  complement?: string;

  @ApiProperty({ description: 'Bairro', example: 'Centro' })
  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @ApiProperty({ description: 'Cidade', example: 'São Paulo' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'Estado', example: 'SP' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ description: 'CEP', example: '12345-678' })
  @IsString()
  @IsNotEmpty()
  zip_code: string;
}

export class CustomerDto {
  @ApiProperty({ description: 'Nome do cliente', example: 'João Silva' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Documento do cliente', type: DocumentDto })
  @ValidateNested()
  @Type(() => DocumentDto)
  document: DocumentDto;

  @ApiProperty({ description: 'Email do cliente', example: 'joao@example.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Telefone do cliente', example: '(11) 98765-4321' })
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({ description: 'Endereço do cliente', type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}

export class ShippingDto {
  @ApiProperty({ description: 'Nome do destinatário', example: 'João Silva' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Rua', example: 'Rua Exemplo' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ description: 'Número', example: '123' })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiPropertyOptional({ description: 'Complemento', example: 'Apto 101' })
  @IsString()
  @IsOptional()
  complement?: string;

  @ApiProperty({ description: 'Bairro', example: 'Centro' })
  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @ApiProperty({ description: 'Cidade', example: 'São Paulo' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'Estado', example: 'SP' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ description: 'CEP', example: '12345-678' })
  @IsString()
  @IsNotEmpty()
  zip_code: string;
}

export class DiscountDto {
  @ApiProperty({ description: 'Método de pagamento', example: 'pix' })
  @IsString()
  @IsNotEmpty()
  method: string;

  @ApiProperty({ description: 'Tipo de desconto', example: 'percentage' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Valor do desconto', example: 10 })
  @IsNotEmpty()
  value: number;
}

export class CreatePaymentDto {
  @ApiProperty({ description: 'Itens do checkout', type: [ItemDto] })
  items?: ItemDto[];

  @ApiProperty({ description: 'Dados do cliente', type: CustomerDto })
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @ApiProperty({ description: 'Dados de entrega', type: ShippingDto })
  @Type(() => ShippingDto)
  shipping: ShippingDto;

  @ApiProperty({ description: 'Métodos de pagamento permitidos', example: ['pix', 'credit_card'] })
  allowed_methods: string[];

  @ApiPropertyOptional({ description: 'Descontos aplicados', type: [DiscountDto] })
  @IsOptional()
  @IsArray()
  @Type(() => DiscountDto)
  discounts?: DiscountDto[];

  @ApiProperty({ description: 'URL de callback', example: 'https://example.com/callback' })
  @IsString()
  @IsNotEmpty()
  callback_url: string;
  sessionId?: string;
  companyId?: number;
}
