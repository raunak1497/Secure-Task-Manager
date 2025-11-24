import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User, Role } from './entities/user.entity';
import { Organization } from './entities/organization.entity';
import { Task } from './entities/task.entity';
import { AuditLog } from './entities/audit-log.entities';

import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { AuditLogModule } from './audit-log/audit-log.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DB_PATH || 'dev.sqlite',
      entities: [User, Organization, Task, AuditLog],
      synchronize: true,
    }),
    AuthModule,
    TaskModule,
    AuditLogModule,
  ],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap() {
    const userRepo = this.dataSource.getRepository(User);
    const orgRepo = this.dataSource.getRepository(Organization);

    const existingUsers = await userRepo.count();
    if (existingUsers > 0) return;

    const org = orgRepo.create({ name: 'TurboVets HQ' });
    await orgRepo.save(org);

    const hashOwner = await bcrypt.hash('owner123', 10);
    const hashAdmin = await bcrypt.hash('admin123', 10);
    const hashViewer = await bcrypt.hash('viewer123', 10);

    await userRepo.save([
      {
        name: 'Owner User',
        email: 'owner@example.com',
        password: hashOwner,
        role: Role.Owner,
        organization: org,
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashAdmin,
        role: Role.Admin,
        organization: org,
      },
      {
        name: 'Viewer User',
        email: 'viewer@example.com',
        password: hashViewer,
        role: Role.Viewer,
        organization: org,
      },
    ]);

    console.log('🔥 Seeded owner/admin/viewer demo users');
  }
}