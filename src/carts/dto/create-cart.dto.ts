import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCartDto {
  @ApiProperty({ description: 'ID da sessão', example: 'abc123xyz' })
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @ApiProperty({ description: 'ID da empresa', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  companyId: number;
}
