import { IsBoolean, IsNumber, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCompanySettingDto {
  @ApiProperty({ description: 'Limite de produtos no checkout', example: 10, required: false })
  @IsNumber()
  @IsOptional()
  limitProductsCheckout?: number;

  @ApiProperty({ description: 'Se a empresa tem pagamento por cartão', example: true, required: false })
  @IsBoolean()
  @IsOptional()
  carpayment?: boolean;

  @ApiProperty({
    description: 'Configuração do gateway de pagamento',
    example: {
      PAYCO_CLIENT_ID: "establishments.e0716838-d040-4aab-a6bc-a36dbe2acffe",
      PAYCO_CLIENT_SECRET: "seu-payco-client-secret"
    }
  })
  @IsObject()
  gateway: any;

  @ApiProperty({ description: 'ID da empresa', example: 1 })
  @IsNumber()
  companyId: number;
}
