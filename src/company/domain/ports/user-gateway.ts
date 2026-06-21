export const USER_GATEWAY = Symbol('USER_GATEWAY');

export interface GatewayUser {
  role: string;
  companyId: number | null;
}

export interface CreateOwnerInput {
  name: string;
  lastName: string;
  email: string;
  password: string;
  companyId: number;
  role: string;
}

export interface UserGateway {
  findByEmail(email: string): Promise<{ role: string } | null>;
  getByToken(token: string): Promise<GatewayUser | null>;
  createOwner(input: CreateOwnerInput, token: string): Promise<{ id: string | number }>;
  removeUser(id: string, token: string): Promise<void>;
  deleteAuthUser(email: string): Promise<void>;
  removeUsersByCompany(companyId: number): Promise<void>;
}
