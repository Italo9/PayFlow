export const SETTINGS_GATEWAY = Symbol('CART_ITEMS_SETTINGS_GATEWAY');

export interface SettingsGateway {
  isCarPaymentActive(companyId: number): Promise<boolean>;
}
