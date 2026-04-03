import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface GithubProfile {
  username: string;
  displayName: string;
  emails?: { value: string }[];
  photos?: { value: string }[];
}

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID') || 'dummy',
      clientSecret:
        configService.get<string>('GITHUB_CLIENT_SECRET') || 'dummy',
      callbackURL:
        configService.get<string>('GITHUB_CALLBACK_URL') ||
        'http://localhost:8080/auth/github/callback',
      scope: ['user:email'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: GithubProfile,
    done: (err: any, user: any) => void,
  ): any {
    const { username, emails, photos, displayName } = profile;
    const user = {
      email: emails && emails[0] ? emails[0].value : `${username}@github.com`,
      name: displayName || username,
      picture: photos && photos[0] ? photos[0].value : null,
      accessToken,
    };
    done(null, user);
  }
}
