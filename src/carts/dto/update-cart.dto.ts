import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartDto extends PartialType(CreateCartDto) {}
