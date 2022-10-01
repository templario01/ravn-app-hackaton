import { Injectable } from '@nestjs/common';
import { MailService } from '@sendgrid/mail';

export interface mailBody {
  email: string;
  subject?: string;
  text?: string;
  html?: string;
}

@Injectable()
export class MailerService {
  private readonly senderEmail: string;
  private readonly apiKey: string;
  constructor() {
    this.senderEmail = process.env.SENDER_EMAIL;
    this.apiKey = process.env.SENDGRID_API_KEY;
  }

  async sendMail({ email, subject, text, html }: mailBody) {
    console.log(this.sendMail, this.apiKey);
    const msg = {
      to: email,
      from: this.senderEmail,
      subject,
      text,
      html,
    };
    const mailService = new MailService();
    mailService.setApiKey(this.apiKey);
    mailService
      .send(msg)
      .then((response) => {
        // eslint-disable-next-line no-console
        console.log(response[0].statusCode);
        // eslint-disable-next-line no-console
        console.log(response[0].headers);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });
  }
}
