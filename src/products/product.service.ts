import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CompanyService } from '../company/company.service';
import * as QRCode from 'qrcode'; 

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private readonly companyService: CompanyService,
  ) {}
  async findByQrCode(qrcode: string): Promise<Product | null> {
    return this.productRepository.findOne({ where: { qrcode } });
  }
  async generateQrCode(product: CreateProductDto): Promise<string> {
    const qrData = `Produto: ${product.name}, Preço: ${product.price}, Empresa: ${product.companyId}`;
    return QRCode.toDataURL(qrData);
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const company = await this.companyService.findOne(
      String(createProductDto.companyId),
    );

    if (!company) {
      throw new Error('Company not found');
    }

    const qrcode = await this.generateQrCode(createProductDto); 

    const product = this.productRepository.create({
      ...createProductDto,
      company,
      qrcode,
    });

    return this.productRepository.save(product);
  }

  findAll() {
    return this.productRepository.find({ relations: ['company'] });
  }

  findOne(id: number) {
    return this.productRepository.findOne({
      where: { id },
      relations: ['company'],
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) return null;

    return this.productRepository.save({ ...product, ...updateProductDto });
  }

  remove(id: number) {
    return this.productRepository.delete(id);
  }
}
