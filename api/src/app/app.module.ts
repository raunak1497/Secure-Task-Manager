import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { User, Role } from './entities/user.entity.js';
import { Organization } from './entities/organization.entity.js';
import { Task } from './entities/task.entity.js';
import { AuditLog } from './entities/audit-log.entities.js'; // ✅ FIXED FILE NAME

import { AuthModule } from './auth/auth.module.js';
import { TaskModule } from './task/task.module.js';
import { AuditLogModule } from './audit-log/audit-log.module.js'; // ✅ NEW

import * as bcrypt from 'bcrypt';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DB_PATH ?? './database.sqlite',
      entities: [User, Organization, Task, AuditLog], // ✅ INCLUDE AUDIT LOG ENTITY
      synchronize: true,
    }),

    AuthModule,
    TaskModule,
    AuditLogModule, // ✅ NEW
  ],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap() {
    const userRepo = this.dataSource.getRepository(User);
    const orgRepo = this.dataSource.getRepository(Organization);

    const users = await userRepo.find();
    if (users.length > 0) return;

    const org = orgRepo.create({ name: 'TurboVets HQ' });
    await orgRepo.save(org);

    const hash = await bcrypt.hash('password123', 10);

    await userRepo.save([
      {
        email: 'owner@demo.com',
        password: hash,
        role: Role.Owner,
        organization: org,
      },
      {
        email: 'admin@demo.com',
        password: hash,
        role: Role.Admin,
        organization: org,
      },
      {
        email: 'viewer@demo.com',
        password: hash,
        role: Role.Viewer,
        organization: org,
      },
    ]);

    console.log('🔥 Seeded Owner/Admin/Viewer users!');
  }
}