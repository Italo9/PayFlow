import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-cart-items.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
