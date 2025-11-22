import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Role } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService
  ) {}

  // Find by email for register validation
  async findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  // ⭐ REGISTER USER
  async register(name: string, email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      name,
      email,
      password: hashed,
      role: Role.Viewer, // default
    });

    await this.userRepo.save(user);

    return { message: 'Registered successfully' };
  }

  // ⭐ VALIDATE USER FOR LOGIN
  async validateUser(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) return null;

    const valid = await bcrypt.compare(password, user.password);
    return valid ? user : null;
  }

  // ⭐ JWT LOGIN
  async login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async saveUser(user: User) {
    return this.userRepo.save(user);
  }
}