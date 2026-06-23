export const PIX_GATEWAY = Symbol('PIX_GATEWAY');

export interface PixChargeItem {
  name: string;
  quantity: string;
  amount: number;
  code: string;
}

export interface PixChargeRequest {
  items: PixChargeItem[];
  customer: unknown;
  callbackUrl: string;
}

export interface PixChargeResult {
  pixCode: string;
  finalAmount: number;
  status: string;
  raw: unknown;
}

export interface PixGateway {
  createCharge(companyId: number, request: PixChargeRequest): Promise<PixChargeResult>;
}
