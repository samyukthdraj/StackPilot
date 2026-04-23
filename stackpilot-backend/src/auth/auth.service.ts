import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRegisteredEvent } from './events/user-registered.event';
import { UserForgotPasswordEvent } from './events/user-forgot-password.event';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      authProvider: 'local',
    });

    await this.userRepository.save(user);

    // Emit welcome event
    this.eventEmitter.emit(
      'user.registered',
      new UserRegisteredEvent(user.email, user.name || 'User'),
    );

    return { message: 'User registered successfully' };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        authProvider: user.authProvider,
      },
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('Email not registered');
    }

    if (user.authProvider !== 'local') {
      throw new BadRequestException(`Account entered via ${user.authProvider} auth, so try logging in that way`);
    }

    const resetToken = randomBytes(32).toString('hex');
    const resetTokenHash = await bcrypt.hash(resetToken, 10);
    
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour expiration
    await this.userRepository.save(user);

    this.eventEmitter.emit(
      'user.forgotPassword',
      new UserForgotPasswordEvent(user.email, user.name || 'User', resetToken),
    );

    return { message: 'Password reset link sent to email' };
  }

  async resetPassword(token: string, newPassword: string) {
    const users = await this.userRepository.find({
      where: { authProvider: 'local' },
    });

    let targetUser: User | null = null;
    for (const user of users) {
      if (
        user.resetPasswordToken &&
        user.resetPasswordExpires &&
        user.resetPasswordExpires > new Date()
      ) {
        const isValid = await bcrypt.compare(token, user.resetPasswordToken);
        if (isValid) {
          targetUser = user;
          break;
        }
      }
    }

    if (!targetUser) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    targetUser.password = hashedPassword;
    targetUser.resetPasswordToken = undefined;
    targetUser.resetPasswordExpires = undefined;
    
    await this.userRepository.save(targetUser);

    return { message: 'Password has been successfully reset' };
  }

  async validateUser(userId: string) {
    return this.userRepository.findOne({
      where: { id: userId },
      select: [
        'id',
        'email',
        'subscriptionType',
        'dailyResumeScans',
        'authProvider',
      ],
    });
  }

  async simulateOAuth(provider: 'google' | 'github' | 'microsoft') {
    const email = `${provider}_user@oauth.com`;
    let user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      // Create random password since they won't use it
      const hashedPassword = await bcrypt.hash(Math.random().toString(36), 10);
      user = this.userRepository.create({
        email,
        password: hashedPassword,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        authProvider: provider,
      });
      await this.userRepository.save(user);
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        authProvider: user.authProvider,
      },
    };
  }

  async findOrCreateOAuthUser(
    profile: { email: string; name?: string },
    provider: 'google' | 'github' | 'microsoft',
  ) {
    const { email, name } = profile;
    let user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      // Create user if they don't exist
      // Since it's OAuth, we don't need a real password, but our entity has it non-nullable (likely)
      // We'll use a random high-entropy string
      const hashedPassword = await bcrypt.hash(
        Math.random().toString(36).slice(-10),
        10,
      );
      user = this.userRepository.create({
        email,
        name: name || 'User',
        password: hashedPassword,
        authProvider: provider,
        role: 'user',
      });
      await this.userRepository.save(user);

      // Emit welcome event for newly created OAuth users
      this.eventEmitter.emit(
        'user.registered',
        new UserRegisteredEvent(user.email, user.name || 'User'),
      );
    } else if (user.authProvider === 'local') {
      // If user exists but is local, we might want to link them or just update their provider
      // For simplicity, we'll just allow them to login if the email matches
      user.authProvider = provider;
      await this.userRepository.save(user);
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        authProvider: user.authProvider,
      },
    };
  }
}
