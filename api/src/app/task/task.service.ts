import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from '../entities/task.entity.js';
import { User } from '../entities/user.entity.js';
import { Organization } from '../entities/organization.entity.js';

import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

// Shape of req.user (from JwtStrategy)
interface AuthUser {
  id: number;
  email: string;
  role: string;
  orgId: number;
}

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private tasks: Repository<Task>,
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(Organization) private orgs: Repository<Organization>,
  ) {}

  async create(dto: CreateTaskDto, authUser: AuthUser) {
    // Only Owner/Admin should reach here (enforced in controller with @Roles)
    const user = await this.users.findOne({
      where: { id: authUser.id },
      relations: ['organization'],
    });
    if (!user) throw new ForbiddenException('User not found');

    const task = this.tasks.create({
      title: dto.title,
      description: dto.description,
      category: dto.category,
      createdBy: user,
      organization: user.organization,
    });

    const saved = await this.tasks.save(task);

    // basic audit log
    console.log(
      `[AUDIT] ${authUser.email} (${authUser.role}) created task #${saved.id} in org ${authUser.orgId}`,
    );

    return saved;
  }

  async findAll(authUser: AuthUser) {
    // RBAC visibility
    if (authUser.role === 'OWNER') {
      // Owner → all tasks
      return this.tasks.find({
        relations: ['organization'],
        order: { id: 'DESC' },
      });
    }

    if (authUser.role === 'ADMIN') {
      // Admin → tasks in same org
      return this.tasks.find({
        where: { organization: { id: authUser.orgId } },
        relations: ['organization'],
        order: { id: 'DESC' },
      });
    }

    // Viewer → tasks in same org created by them (you can tweak if needed)
    return this.tasks.find({
      where: {
        organization: { id: authUser.orgId },
        createdBy: { id: authUser.id },
      },
      relations: ['organization'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number, authUser: AuthUser) {
    const task = await this.tasks.findOne({
      where: { id },
      relations: ['organization', 'createdBy'],
    });
    if (!task) throw new NotFoundException('Task not found');

    // org-level check
    if (authUser.role !== 'OWNER' && task.organization.id !== authUser.orgId) {
      throw new ForbiddenException('Not allowed to access this task');
    }

    // viewer: must also be creator
    if (
      authUser.role === 'VIEWER' &&
      task.createdBy.id !== authUser.id
    ) {
      throw new ForbiddenException('Not allowed to access this task');
    }

    return task;
  }

  async update(id: number, dto: UpdateTaskDto, authUser: AuthUser) {
    const task = await this.findOne(id, authUser); // includes access checks

    // Only Owner/Admin, or Viewer who created it
    const isOwnerOrAdmin = authUser.role === 'OWNER' || authUser.role === 'ADMIN';
    const isCreator = task.createdBy.id === authUser.id;

    if (!isOwnerOrAdmin && !isCreator) {
      throw new ForbiddenException('Not allowed to edit this task');
    }

    Object.assign(task, dto);
    const saved = await this.tasks.save(task);

    console.log(
      `[AUDIT] ${authUser.email} (${authUser.role}) updated task #${saved.id}`,
    );

    return saved;
  }

  async remove(id: number, authUser: AuthUser) {
    const task = await this.findOne(id, authUser);

    // Only Owner/Admin can delete
    if (authUser.role !== 'OWNER' && authUser.role !== 'ADMIN') {
      throw new ForbiddenException('Not allowed to delete this task');
    }

    await this.tasks.remove(task);

    console.log(
      `[AUDIT] ${authUser.email} (${authUser.role}) deleted task #${id}`,
    );

    return { success: true };
  }
}