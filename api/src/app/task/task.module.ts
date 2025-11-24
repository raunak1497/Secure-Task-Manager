import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Task } from '../entities/task.entity';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';

import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User, Organization]),
    AuditLogModule,
  ],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}