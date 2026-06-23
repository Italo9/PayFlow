export class Checkout {
  constructor(
    public readonly id: number | null,
    public paymentStatus: string,
    public readonly total: number,
    public readonly qrcode: string,
    public readonly companyId: number,
    public readonly cartId: number,
  ) {}
}

export class CheckoutNotFound extends Error {
  constructor(reference: string | number) {
    super(`Checkout para ${reference} nao encontrado`);
    this.name = 'CheckoutNotFound';
  }
}

export class CheckoutCartNotFound extends Error {
  constructor(sessionId: string) {
    super(`Carrinho com sessionId ${sessionId} nao encontrado`);
    this.name = 'CheckoutCartNotFound';
  }
}

export class CheckoutProductNotFound extends Error {
  constructor(productId: number) {
    super(`Produto com ID ${productId} nao encontrado`);
    this.name = 'CheckoutProductNotFound';
  }
}
