export const WELCOME_MAILER = Symbol('WELCOME_MAILER');

export interface WelcomeMailer {
  sendWelcome(email: string, password: string, platformLink: string): Promise<void>;
}
