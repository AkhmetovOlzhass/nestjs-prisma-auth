// src/modules/auth/email/email.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendConfirmationEmail(email: string, link: string) {
    console.log(link);

    await this.transporter.sendMail({
      from: '"Bot World" <noreply@botworld.com>',
      to: email,
      subject: 'Confirm your email',
      html: `<p>Welcome! Click <a href="${link}">here</a> to confirm your email.</p>`,
    });
  }
}
