import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class ApplicationService {
  private readonly logger = new Logger(ApplicationService.name);
  
  // In-memory storage (replace with database in production)
  private applications: any[] = [];

  constructor(private mailService: MailService) {}

  async submitApplication(createApplicationDto: CreateApplicationDto) {
    // Validate date format
    this.validateDate(createApplicationDto.dateOfBirth);

    // Add timestamp and application ID
    const application = {
      id: this.generateApplicationId(),
      ...createApplicationDto,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
    };

    try {
      // Store application (in production, save to database)
      this.applications.push(application);
      this.logger.log(`Application ${application.id} stored successfully`);

      // Send email notification
      await this.mailService.sendApplicationEmail(application);

      return {
        success: true,
        message: 'Application submitted successfully',
        applicationId: application.id,
        submittedAt: application.submittedAt,
      };
    } catch (error:any) {
      this.logger.error(`Failed to process application: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to process application. Please try again.');
    }
  }

  async getAllApplications() {
    return {
      success: true,
      total: this.applications.length,
      applications: this.applications,
    };
  }

  async getApplicationById(id: string) {
    const application = this.applications.find(app => app.id === id);
    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }
    return {
      success: true,
      application,
    };
  }

  private generateApplicationId(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `APP-${timestamp}-${random}`;
  }

  private validateDate(dateString: string): void {
    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    
    if (
      date.getDate() !== day ||
      date.getMonth() !== month - 1 ||
      date.getFullYear() !== year ||
      year < 1900 ||
      year > new Date().getFullYear()
    ) {
      throw new BadRequestException('Invalid date of birth');
    }
  }
}