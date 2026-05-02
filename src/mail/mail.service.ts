import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST', 'smtp.gmail.com'),
      port: this.configService.get('MAIL_PORT', 587),
      secure: false,
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
    });
  }

  async sendApplicationEmail(applicationData: any): Promise<void> {
    const schoolEmail = this.configService.get('SCHOOL_EMAIL');
    
    // Split emails by comma and trim whitespace
    const recipients = schoolEmail.split(',').map((email: string) => email.trim());
    
    const mailOptions = {
      from: `"School Registration" <${this.configService.get('MAIL_USER')}>`,
      to: recipients, // Nodemailer accepts an array of emails
      subject: `New Student Application - ${applicationData.studentName}`,
      html: this.generateEmailTemplate(applicationData),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Application email sent to ${recipients.join(', ')}`);
    } catch (error: any) {
      this.logger.error('Failed to send application email', error.stack);
      throw new Error('Failed to send application email');
    }
  }

  private generateEmailTemplate(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; border: 1px solid #ddd; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #333; }
          .value { margin-top: 5px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Student Application</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Student Name:</div>
              <div class="value">${data.studentName}</div>
            </div>
            <div class="field">
              <div class="label">Date of Birth:</div>
              <div class="value">${data.dateOfBirth}</div>
            </div>
            <div class="field">
              <div class="label">Grade Applying For:</div>
              <div class="value">${data.grade}</div>
            </div>
            <div class="field">
              <div class="label">Parent/Guardian Name:</div>
              <div class="value">${data.parentName}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value">${data.email}</div>
            </div>
            <div class="field">
              <div class="label">Phone:</div>
              <div class="value">${data.phone}</div>
            </div>
            <div class="field">
              <div class="label">Address:</div>
              <div class="value">${data.address}</div>
            </div>
            ${data.previousSchool ? `
            <div class="field">
              <div class="label">Previous School:</div>
              <div class="value">${data.previousSchool}</div>
            </div>
            ` : ''}
            ${data.additionalInfo ? `
            <div class="field">
              <div class="label">Additional Information:</div>
              <div class="value">${data.additionalInfo}</div>
            </div>
            ` : ''}
          </div>
        </div>
      </body>
      </html>
    `;
  }
}