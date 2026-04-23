import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Query,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { User } from '../users/user.entity';

interface AuthenticatedRequest extends Request {
  user: User;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
  })
  @ApiResponse({
    status: 400,
    description: 'Email already exists or invalid data',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({
    status: 200,
    description: 'Returns access token and user info',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request a password reset link' })
  @ApiResponse({ status: 200, description: 'Reset link sent' })
  @ApiResponse({ status: 400, description: 'Email not registered or using OAuth' })
  async forgotPassword(@Body('email') email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using token' })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async resetPassword(@Body() body: any) {
    const { token, newPassword } = body;
    if (!token || !newPassword) {
      throw new BadRequestException('Token and new password are required');
    }
    return this.authService.resetPassword(token, newPassword);
  }

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns user profile' })
  getProfile(@Request() req: AuthenticatedRequest): User {
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
