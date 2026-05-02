import { IsString, IsEmail, IsNotEmpty, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  studentName!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, { 
    message: 'Date must be in DD/MM/YYYY format' 
  })
  dateOfBirth!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  grade!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  parentName!: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[\d\s-]{10,}$/, { 
    message: 'Invalid phone number format. Must be at least 10 digits' 
  })
  phone!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(200)
  address!: string;

  @IsString()
  @IsOptional()
  previousSchool?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  additionalInfo?: string;
}