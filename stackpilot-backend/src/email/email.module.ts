import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('EMAIL_HOST', 'smtp.gmail.com');
        const portStr = configService.get<string>('EMAIL_PORT', '587');
        const user = configService.get<string>('EMAIL_USER');
        const pass = configService.get<string>('EMAIL_PASSWORD');
        const from = configService.get<string>(
          'EMAIL_FROM',
          'noreply@stackpilot.com',
        );

        const port = parseInt(portStr, 10);

        const transport: Record<string, any> = {
          host,
          port,
          secure: false,
        };

        if (user && pass) {
          transport.auth = { user, pass };
        }

        return {
          transport,
          defaults: {
            from: `"StackPilot" <${from}>`,
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
