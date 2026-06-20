import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ProcessPaymentDto {
    @ApiProperty({ description: 'ID da transação', example: 'txn_123456789' })
    @IsString()
    @IsNotEmpty()
    transactionId: string;
  }
  