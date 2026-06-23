import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Cart } from '../domain/cart';
import { CART_REPOSITORY, CartRepository } from '../domain/ports/cart.repository';
import { COMPANY_GATEWAY, CompanyGateway } from '../domain/ports/company-gateway';

export interface CreateCartInput {
  sessionId: string;
  companyId: number;
}

@Injectable()
export class CreateCartUseCase {
  constructor(
    @Inject(CART_REPOSITORY) private readonly carts: CartRepository,
    @Inject(COMPANY_GATEWAY) private readonly companies: CompanyGateway,
  ) {}

  async execute(input: CreateCartInput): Promise<Cart> {
    try {
      const exists = await this.companies.exists(input.companyId);
      if (!exists) {
        throw new NotFoundException('Empresa nao encontrada');
      }
      return await this.carts.create(input.sessionId, input.companyId);
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error);
      throw new InternalServerErrorException('Erro ao salvar carrinho.');
    }
  }
}
