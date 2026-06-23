export class Payment {
  constructor(
    public readonly id: number | null,
    public readonly companyId: number,
    public status: string,
    public readonly receivData: unknown,
  ) {}
}

export class PaymentNotFound extends Error {
  constructor() {
    super('Pagamento nao encontrado');
    this.name = 'PaymentNotFound';
  }
}
