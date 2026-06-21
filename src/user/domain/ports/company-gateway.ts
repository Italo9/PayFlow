export const COMPANY_GATEWAY = Symbol('USER_COMPANY_GATEWAY');

export interface CompanyGateway {
  findById(companyId: number): Promise<{ id: number } | null>;
}
