import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  HttpCode, 
  HttpStatus, 
  ValidationPipe,
  UsePipes,
  BadRequestException 
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post('submit')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ 
    transform: true, 
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) => {
      const messages = errors.map(error => ({
        field: error.property,
        constraints: error.constraints,
      }));
      return new BadRequestException({
        message: 'Validation failed',
        errors: messages,
      });
    }
  }))
  async submitApplication(
    @Body() createApplicationDto: CreateApplicationDto,
  ) {
    return this.applicationService.submitApplication(createApplicationDto);
  }

  @Get()
  async getAllApplications() {
    return this.applicationService.getAllApplications();
  }

  @Get(':id')
  async getApplicationById(@Param('id') id: string) {
    return this.applicationService.getApplicationById(id);
  }
}