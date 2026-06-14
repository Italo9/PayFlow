import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanySettingDto } from './create-company-setting.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsObject, IsString } from 'class-validator';

export class UpdateCompanySettingDto {
  @ApiProperty({ description: 'Valor da hora', example: 10, required: false })
  @IsNumber()
  @IsOptional()
  ValueHour?: number;

  @ApiProperty({ description: 'Valor da fração de hora', example: 5, required: false })
  @IsNumber()
  @IsOptional()
  ValueFractionHour?: number;

  @ApiProperty({ description: 'Recarga automática', example: true, required: false })
  @IsBoolean()
  @IsOptional()
  autorecharge?: boolean;

  @ApiProperty({ description: 'Tolerância de tempo', example: '00:15', required: false })
  @IsString()
  @IsOptional()
  timeTolerance?: string;

  @ApiProperty({ description: 'Tempo de expiração do PIX (em minutos)', example: 15, required: false })
  @IsNumber()
  @IsOptional()
  pixExpirationTime?: number;

  @ApiProperty({ description: 'Limite de produtos no checkout', example: 10, required: false })
  @IsNumber()
  @IsOptional()
  limitProductsCheckout?: number;

  @ApiProperty({ description: 'Se a empresa tem pagamento por cartão', example: true, required: false })
  @IsBoolean()
  @IsOptional()
  carpayment?: boolean;

  @ApiProperty({ description: 'ID da empresa', example: 1, required: false })
  @IsNumber()
  @IsOptional()
  companyId?: number;

  @ApiProperty({
    description: 'Configuração do gateway de pagamento',
    example: {
      PAYCO_CLIENT_ID: "establishments.e0716838-d040-4aab-a6bc-a36dbe2acffe",
      PAYCO_CLIENT_SECRET: "seu-payco-client-secret"
    },
    required: false
  })
  @IsObject()
  @IsOptional()
  gateway?: any;
}
