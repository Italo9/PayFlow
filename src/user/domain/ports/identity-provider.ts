export const IDENTITY_PROVIDER = Symbol('IDENTITY_PROVIDER');

export interface ExternalUserInput {
  name: string;
  lastName: string;
  email: string;
  password: string;
  companyId: number;
  loggedUserEmail?: string;
  token?: string;
}

export interface IdentityProvider {
  createUser(input: ExternalUserInput): Promise<{ id: string | null }>;
  deleteUser(idOrEmail: string): Promise<void>;
  getByToken(token: string): Promise<{ email: string } | null>;
}
