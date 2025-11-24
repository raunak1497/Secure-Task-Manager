import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User, Role } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Organization)
    private orgRepo: Repository<Organization>,

    private jwtService: JwtService,
  ) {}

  async findByEmail(email: string) {
    return this.userRepo.findOne({
      where: { email },
      relations: ['organization'],
    });
  }

  async register(name: string, email: string, password: string) {
  const hashed = await bcrypt.hash(password, 10);

  // Load first org safely
  let org = (await this.orgRepo.find())[0];

  // If no org exists, create a default org
  if (!org) {
    org = this.orgRepo.create({ name: "Default Org" });
    await this.orgRepo.save(org);
  }

  const user = this.userRepo.create({
    name,
    email,
    password: hashed,
    role: Role.Viewer,
    organization: org,
  });

  await this.userRepo.save(user);

  return { message: "Registered successfully" };
}

  async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const valid = await bcrypt.compare(password, user.password);
    return valid ? user : null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      orgId: user.organization?.id ?? null,
    };

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        orgId: user.organization?.id ?? null,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async saveUser(user: User) {
    return this.userRepo.save(user);
  }
}