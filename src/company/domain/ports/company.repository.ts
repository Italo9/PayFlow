import { Company } from '../company';

export const COMPANY_REPOSITORY = Symbol('COMPANY_REPOSITORY');

export interface ProductSummary {
  id: number;
  name: string;
  price: number;
  qrcode: string;
}

export interface CompanyData {
  name: string;
  cnpj: string;
  active: boolean;
  carpayment: boolean;
  qrcode: string;
  peopleForContact?: string;
  phone?: string;
  email?: string;
}

export interface CompanyPatch {
  name?: string;
  cnpj?: string;
  qrcode?: string;
  active?: boolean;
  carpayment?: boolean;
  peopleForContact?: string;
  phone?: string;
  email?: string;
}

export interface CompanyRepository {
  create(data: CompanyData): Promise<Company>;
  update(id: number, patch: CompanyPatch): Promise<void>;
  findById(id: number): Promise<Company | null>;
  findByEmail(email: string): Promise<Company | null>;
  findByCnpj(cnpj: string): Promise<Company | null>;
  findAll(): Promise<Company[]>;
  delete(id: number): Promise<void>;
  listProducts(companyId: number): Promise<ProductSummary[] | null>;
  listUserEmails(companyId: number): Promise<string[]>;
}
