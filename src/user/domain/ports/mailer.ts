export const MAILER = Symbol('MAILER');

export interface Mailer {
  sendWelcome(email: string, password: string, platformLink: string): Promise<void>;
}
