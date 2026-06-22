export const USER_GATEWAY = Symbol('AUTH_USER_GATEWAY');

export interface GatewayUser {
  id: number;
  email: string;
  role: string;
  companyId: number | null;
}

export interface UserGateway {
  findByEmail(email: string): Promise<GatewayUser | null>;
}
