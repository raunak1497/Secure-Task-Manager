import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Task } from '../entities/task.entity.js';
import { User } from '../entities/user.entity.js';
import { Organization } from '../entities/organization.entity.js';

import { TaskService } from './task.service.js';
import { TaskController } from './task.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User, Organization])],
  providers: [TaskService],
  controllers: [TaskController],
  exports: [TaskService],
})
export class TaskModule {}