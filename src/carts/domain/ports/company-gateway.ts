export const COMPANY_GATEWAY = Symbol('CART_COMPANY_GATEWAY');

export interface CompanyGateway {
  exists(companyId: number): Promise<boolean>;
}
