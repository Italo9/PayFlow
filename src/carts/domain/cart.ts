export class Cart {
  constructor(
    public readonly id: number | null,
    public sessionId: string,
    public readonly companyId: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}

export class CartNotFound extends Error {
  constructor(reference: string | number) {
    super(`Carrinho ${reference} nao encontrado`);
    this.name = 'CartNotFound';
  }
}

export class CartCompanyNotFound extends Error {
  constructor() {
    super('Empresa nao encontrada');
    this.name = 'CartCompanyNotFound';
  }
}
