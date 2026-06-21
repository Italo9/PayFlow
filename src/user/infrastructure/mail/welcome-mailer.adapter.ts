import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { WelcomeMailer } from '../../domain/ports/welcome-mailer';

@Injectable()
export class WelcomeMailerAdapter implements WelcomeMailer {
  constructor(private readonly mailer: MailerService) {}

  async sendWelcome(email: string, password: string, platformLink: string): Promise<void> {
    await this.mailer.sendMail({
      to: email,
      subject: 'Seja bem vindo!',
      template: 'welcome',
      context: { user: email, password, platformLink },
    });
  }
}
