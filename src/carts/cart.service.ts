import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CompanyService } from '../company/company.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    private readonly companyService: CompanyService,
  ) {}

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    try {
      const { sessionId, companyId } = createCartDto;

      const company = await this.companyService.findOne(String(companyId));

      if (!company) {
        throw new NotFoundException('Empresa não encontrada');
      }

      const cart = this.cartRepository.create({
        sessionId,
        company,
      });

      return await this.cartRepository.save(cart);
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error);
      throw new InternalServerErrorException('Erro ao salvar carrinho.');
    }
  }

  async findOneSessionId(sessionId: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({ where: { sessionId } });

    if (!cart) {
      throw new NotFoundException(
        `Carrinho com sessionId ${sessionId} não encontrado`,
      );
    }

    return cart;
  }

  async findAll(): Promise<Cart[]> {
    return await this.cartRepository.find();
  }

  async findOne(id: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({ where: { id } });
    if (!cart) {
      throw new NotFoundException(`Carrinho com ID ${id} não encontrado`);
    }
    return cart;
  }

  async update(id: number, updateCartDto: UpdateCartDto): Promise<Cart> {
    const cart = await this.cartRepository.findOne({ where: { id } });
    if (!cart) {
      throw new NotFoundException(`Carrinho com ID ${id} não encontrado`);
    }
    Object.assign(cart, updateCartDto);
    return await this.cartRepository.save(cart);
  }

  async getSession(id: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({ where: { id } });
    if (!cart) {
      throw new NotFoundException(
        `Sessão de carrinho com ID ${id} não encontrada`,
      );
    }
    return cart;
  }

  async remove(id: number): Promise<void> {
    const cart = await this.cartRepository.findOne({ where: { id } });
    if (!cart) {
      throw new NotFoundException(`Carrinho com ID ${id} não encontrado`);
    }
    await this.cartRepository.remove(cart);
  }
  async findBySessionId(sessionId: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { sessionId },
    });

    if (!cart) {
      throw new NotFoundException(
        `Cart com sessionId ${sessionId} não encontrado`,
      );
    }
    return cart;
  }
}
