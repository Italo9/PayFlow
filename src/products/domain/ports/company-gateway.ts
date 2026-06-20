export const COMPANY_GATEWAY = Symbol('COMPANY_GATEWAY');

export interface CompanyView {
  id: number;
  carpayment: boolean;
}

export interface CompanyGateway {
  findById(companyId: number): Promise<CompanyView | null>;
}
