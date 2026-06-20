export class Product {
  constructor(
    public readonly id: number | null,
    public name: string,
    public price: number,
    public readonly companyId: number,
    public qrcode: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  rename(name: string) {
    this.name = name;
  }

  reprice(price: number) {
    if (price <= 0) throw new InvalidProductPrice(price);
    this.price = price;
  }
}

export class InvalidProductPrice extends Error {
  constructor(price: number) {
    super(`Preco invalido: ${price}`);
    this.name = 'InvalidProductPrice';
  }
}

export class ProductNotFound extends Error {
  constructor(id: number | string) {
    super(`Produto ${id} nao encontrado`);
    this.name = 'ProductNotFound';
  }
}

export class CompanyNotFound extends Error {
  constructor(companyId: number) {
    super(`Empresa ${companyId} nao encontrada`);
    this.name = 'CompanyNotFound';
  }
}
