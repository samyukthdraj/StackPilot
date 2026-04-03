import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Query,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: any;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: AuthenticatedRequest): any {
    return req.user;
  }

  // --- Real OAuth Routes ---

  // Google
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Request() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    const { access_token } = await this.authService.findOrCreateOAuthUser(
      req.user,
      'google',
    );
    return res.redirect(
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/oauth-callback?token=${access_token}`,
    );
  }

  // GitHub
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(
    @Request() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    const { access_token } = await this.authService.findOrCreateOAuthUser(
      req.user,
      'github',
    );
    return res.redirect(
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/oauth-callback?token=${access_token}`,
    );
  }

  // Microsoft
  @Get('microsoft')
  @UseGuards(AuthGuard('microsoft'))
  async microsoftAuth() {}

  @Get('microsoft/callback')
  @UseGuards(AuthGuard('microsoft'))
  async microsoftAuthRedirect(
    @Request() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    const { access_token } = await this.authService.findOrCreateOAuthUser(
      req.user,
      'microsoft',
    );
    return res.redirect(
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/oauth-callback?token=${access_token}`,
    );
  }

  // Keeping mock for backward compatibility or testing until real keys are provided
  @Get('oauth/mock')
  async mockOAuth(
    @Query('provider') provider: 'google' | 'github' | 'microsoft',
    @Query('frontendUrl') frontendUrl: string,
    @Res() res: Response,
  ) {
    if (!['google', 'github', 'microsoft'].includes(provider)) {
      return res.status(400).json({ message: 'Invalid provider' });
    }
    const { access_token } = await this.authService.simulateOAuth(provider);
    return res.redirect(
      `${frontendUrl || 'http://localhost:3000'}/oauth-callback?token=${access_token}`,
    );
  }
}
