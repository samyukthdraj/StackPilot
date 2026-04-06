import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { EmailService } from './email.service';

export class ContactDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}

@Controller('contact')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  async sendContactMessage(@Body() body: ContactDto) {
    if (!body.name || !body.email || !body.message) {
      throw new HttpException('Missing required fields', HttpStatus.BAD_REQUEST);
    }
    await this.emailService.sendContactEmail(body);
    return { success: true, message: 'Message sent successfully' };
  }
}
