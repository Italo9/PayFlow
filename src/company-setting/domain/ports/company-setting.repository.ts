import { CompanySetting, GatewayConfig } from '../company-setting';

export const COMPANY_SETTING_REPOSITORY = Symbol('COMPANY_SETTING_REPOSITORY');

export interface CreateSettingData {
  companyId: number;
  carpayment?: boolean;
  limitProductsCheckout?: number;
  gateway?: GatewayConfig;
}

export interface SettingPatch {
  carpayment?: boolean;
  limitProductsCheckout?: number;
  gateway?: GatewayConfig;
}

export interface CompanySettingRepository {
  create(data: CreateSettingData): Promise<CompanySetting>;
  findById(id: number): Promise<CompanySetting | null>;
  findByCompanyId(companyId: number): Promise<CompanySetting | null>;
  findAll(): Promise<CompanySetting[]>;
  update(id: number, patch: SettingPatch): Promise<CompanySetting | null>;
  delete(id: number): Promise<void>;
}
