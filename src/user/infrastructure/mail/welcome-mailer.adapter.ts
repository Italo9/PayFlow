import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Mailer } from '../../domain/ports/mailer';

@Injectable()
export class WelcomeMailerAdapter implements Mailer {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcome(email: string, password: string, platformLink: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Seja bem vindo!',
      template: 'welcome',
      context: { user: email, password, platformLink },
    });
  }
}
