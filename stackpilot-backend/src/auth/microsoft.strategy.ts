// @ts-expect-error missing types
import { Strategy } from 'passport-microsoft';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface MicrosoftProfile {
  id: string;
  displayName: string;
  emails?: { value: string }[];
}

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(private configService: ConfigService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      clientID: configService.get<string>('MICROSOFT_CLIENT_ID') || 'dummy',
      clientSecret:
        configService.get<string>('MICROSOFT_CLIENT_SECRET') || 'dummy',
      callbackURL:
        configService.get<string>('MICROSOFT_CALLBACK_URL') ||
        'http://localhost:8080/auth/microsoft/callback',
      scope: ['user.read'],
      tenant: 'common',
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: MicrosoftProfile,
    done: (err: any, user: any) => void,
  ): any {
    const { displayName, emails } = profile;
    const user = {
      email:
        emails && emails[0] ? emails[0].value : `${profile.id}@microsoft.com`,
      name: displayName,
      accessToken,
    };
    done(null, user);
  }
}
