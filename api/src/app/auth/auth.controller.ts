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
import { Role } from "../entities/user.entity"; // ensure correct import

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

  // REGISTER
  @Post('register')
  async register(@Body() body: RegisterDto) {
    const { name, email, password } = body;

    const existing = await this.authService.findByEmail(email);
    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    return this.authService.register(name, email, password);
  }

  // LOGIN
  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    return this.authService.login(user);
  }

  // GET PROFILE
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req) {
    // req.user already HAS name, email, role from JwtStrategy
    return {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    };
  }

  @Post('promote')
  async promote(@Body() body: { email: string; role: Role }) {
    const { email, role } = body;

    // Validate role
    if (!Object.values(Role).includes(role)) {
      throw new BadRequestException("Invalid role");
    }

    // Update user
    const user = await this.authService.findByEmail(email);
    if (!user) {
      throw new BadRequestException("User not found");
    }

    user.role = role;
    await this.authService.saveUser(user);

    return { message: `User role updated to ${role}` };
  }
}