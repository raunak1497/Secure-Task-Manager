import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Organization]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}