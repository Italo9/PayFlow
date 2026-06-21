export interface GatewayConfig {
  PAYCO_CLIENT_ID?: string;
  PAYCO_CLIENT_SECRET?: string;
  [key: string]: unknown;
}

export class CompanySetting {
  constructor(
    public readonly id: number | null,
    public readonly companyId: number,
    public carpayment: boolean | null,
    public limitProductsCheckout: number | null,
    public gateway: GatewayConfig | null,
  ) {}
}

export class CompanySettingNotFound extends Error {
  constructor() {
    super('Configuracao da empresa nao encontrada.');
    this.name = 'CompanySettingNotFound';
  }
}

export class CompanyNotFound extends Error {
  constructor() {
    super('Empresa nao encontrada');
    this.name = 'CompanyNotFound';
  }
}

export class SettingOperationNotAllowed extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SettingOperationNotAllowed';
  }
}
