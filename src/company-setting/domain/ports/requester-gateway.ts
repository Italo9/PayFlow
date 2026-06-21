export const REQUESTER_GATEWAY = Symbol('COMPANY_SETTING_REQUESTER_GATEWAY');

export interface Requester {
  role: string;
  companyId: number | null;
}

export interface RequesterGateway {
  getByToken(token: string): Promise<Requester>;
}
