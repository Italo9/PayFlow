export class Company {
  constructor(
    public readonly id: number | null,
    public name: string,
    public cnpj: string,
    public active: boolean,
    public carpayment: boolean,
    public qrcode: string | null,
    public peopleForContact: string | null,
    public phone: string | null,
    public email: string | null,
  ) {}
}

export class CompanyNotFound extends Error {
  constructor(id: number | string) {
    super(`Empresa com ID ${id} nao encontrada.`);
    this.name = 'CompanyNotFound';
  }
}

export class CompanyAlreadyExists extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CompanyAlreadyExists';
  }
}

export class CompanyOperationNotAllowed extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CompanyOperationNotAllowed';
  }
}
