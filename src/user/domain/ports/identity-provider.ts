export const IDENTITY_PROVIDER = Symbol('IDENTITY_PROVIDER');

export interface ExternalUserInput {
  display_name: string;
  primary_email: string;
  password: string;
  client_metadata?: Record<string, unknown>;
  server_metadata?: Record<string, unknown>;
  primary_email_verified?: boolean;
  primary_email_auth_enabled?: boolean;
}

export interface IdentityProvider {
  createExternal(input: ExternalUserInput): Promise<{ id?: string }>;
  getByAccessToken(accessToken: string): Promise<{ primary_email: string }>;
  deleteExternal(idOrEmail: string): Promise<void>;
}
