import { Injectable, BadRequestException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SignupInput } from './dto/signup.input';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from './email/email.service';
import { LoginInput } from './dto/login.input';
import { AuthResponse } from './dto/auth-response.type';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwt: JwtService,
    private emailService: EmailService,
  ) {}

  async signup(data: SignupInput): Promise<void> {
    const existingUser = await this.userService.findByEmail(data.email);
    if (existingUser) {
      if (existingUser.emailConfirmed) {
        throw new BadRequestException('User already exists');
      } else {
        const token = this.jwt.sign(
          { email: existingUser.email },
          { secret: process.env.EMAIL_CONFIRM_SECRET, expiresIn: '1h' },
        );
        const confirmLink = `${process.env.FRONTEND_LINK}/confirm-email?token=${token}`;
        await this.userService.update(existingUser.id, {
          emailConfirmToken: token,
        });

        await this.emailService.sendConfirmationEmail(
          existingUser.email,
          confirmLink,
        );
        return;
      }
    }

    const hash = await bcrypt.hash(data.password, 10);

    const token = this.jwt.sign(
      { email: data.email },
      { secret: process.env.EMAIL_CONFIRM_SECRET, expiresIn: '1h' },
    );

    const user = await this.userService.create({
      email: data.email,
      password: hash,
      emailConfirmToken: token,
    });

    const confirmLink = `${process.env.FRONTEND_LINK}/confirm-email?token=${token}`;

    await this.emailService.sendConfirmationEmail(user.email, confirmLink);
  }

  async confirmEmail(token: string): Promise<boolean> {
    try {
      const payload = this.jwt.verify(token, {
        secret: process.env.EMAIL_CONFIRM_SECRET,
      });
      const user = await this.userService.findByEmail(payload.email);
      if (!user) throw new BadRequestException('User not found');

      if (user.emailConfirmToken !== token) {
        throw new BadRequestException('Invalid or outdated token');
      }

      await this.userService.update(user.id, {
        emailConfirmed: true,
        emailConfirmToken: null,
      });
      return true;
    } catch {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    const user = await this.userService.findByEmail(data.email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    if (!user.emailConfirmed) {
      throw new BadRequestException('Email is not confirmed');
    }

    const accessToken = this.jwt.sign(
      { sub: user.id, email: user.email },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      },
    );

    const refreshToken = this.jwt.sign(
      { sub: user.id, email: user.email },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      },
    );
    await this.userService.update(user.id, {
      refreshToken,
    });
    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const payload = this.jwt.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userService.findByEmail(payload.email);

      if (!user) throw new BadRequestException('User not found');

      const newAccessToken = this.jwt.sign(
        { sub: user.id, email: user.email },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '15m',
        },
      );

      if (user.refreshToken !== refreshToken) {
        throw new BadRequestException('Refresh token does not match');
      }

      const newRefreshToken = this.jwt.sign(
        { sub: user.id, email: user.email },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      );

      await this.userService.update(user.id, {
        refreshToken: newRefreshToken,
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user,
      };
    } catch {
      throw new BadRequestException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string): Promise<boolean> {
    await this.userService.update(userId, { refreshToken: null });
    return true;
  }
}
