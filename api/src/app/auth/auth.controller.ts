import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

export class RegisterDto {
  name!: string;
  email!: string;
  password!: string;
}

export class LoginDto {
  email!: string;
  password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const { name, email, password } = body;

    const existing = await this.authService.findByEmail(email);
    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    return this.authService.register(name, email, password);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req) {
    return {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      orgId: req.user.orgId,
    };
  }
}