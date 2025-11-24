import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from '../entities/task.entity.js';
import { User } from '../entities/user.entity.js';
import { Organization } from '../entities/organization.entity.js';

import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { AuditLogService } from '../audit-log/audit-log.service.js';

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
    private auditLog: AuditLogService,
  ) {}

  // -------------------------------------------------------------------------
  // CREATE — Owner/Admin only (Controller-level guard handles role checking)
  // -------------------------------------------------------------------------
  async create(dto: CreateTaskDto, authUser: AuthUser) {
    const user = await this.users.findOne({
      where: { id: authUser.id },
      relations: ['organization'],
    });

    if (!user) throw new ForbiddenException('User not found');

    const task = this.tasks.create({
      title: dto.title,
      description: dto.description,
      category: dto.category,
      status: 'Pending',
      createdBy: user,
      organization: user.organization,
    });

    const saved = await this.tasks.save(task);
    this.auditLog.log(`Created task #${saved.id}`, authUser);

    return saved;
  }

  // -------------------------------------------------------------------------
  // FIND ALL — Viewer sees all tasks in their org
  // -------------------------------------------------------------------------
  async findAll(authUser: AuthUser) {
    if (authUser.role === 'OWNER') {
      return this.tasks.find({
        relations: ['organization', 'createdBy'],
        order: { id: 'DESC' },
      });
    }

    // ADMIN + VIEWER both see all tasks from their org
    return this.tasks.find({
      where: { organization: { id: authUser.orgId } },
      relations: ['organization', 'createdBy'],
      order: { id: 'DESC' },
    });
  }

  // -------------------------------------------------------------------------
  // FIND ONE — Viewer can view all tasks in org
  // -------------------------------------------------------------------------
  async findOne(id: number, authUser: AuthUser) {
    const task = await this.tasks.findOne({
      where: { id },
      relations: ['organization', 'createdBy'],
    });

    if (!task) throw new NotFoundException('Task not found');

    // ---- AUTO-FIX missing organization ----
    if (!task.organization) {
      const org = await this.orgs.findOne({ where: { id: authUser.orgId } });
      task.organization = org;
      await this.tasks.save(task);
    }

    // ---- AUTO-FIX missing creator ----
    if (!task.createdBy) {
      const creator = await this.users.findOne({ where: { id: authUser.id } });
      task.createdBy = creator;
      await this.tasks.save(task);
    }

    // ---- ORG ACCESS CHECK (Admin + Viewer) ----
    if (authUser.role !== 'OWNER' && task.organization.id !== authUser.orgId) {
      throw new ForbiddenException('Not allowed to access this task');
    }

    // Viewer CAN view any task in their org
    return task;
  }

  // -------------------------------------------------------------------------
  // UPDATE — Owner/Admin OR Creator (Viewer can ONLY edit their own tasks)
  // -------------------------------------------------------------------------
  async update(id: number, dto: UpdateTaskDto, authUser: AuthUser) {
    const task = await this.findOne(id, authUser);

    const isOwnerOrAdmin =
      authUser.role === 'OWNER' || authUser.role === 'ADMIN';
    const isCreator = task.createdBy.id === authUser.id;

    if (!isOwnerOrAdmin && !isCreator) {
      throw new ForbiddenException('Not allowed to edit this task');
    }

    Object.assign(task, dto);
    const saved = await this.tasks.save(task);

    this.auditLog.log(`Updated task #${saved.id}`, authUser);
    return saved;
  }

  // -------------------------------------------------------------------------
  // DELETE — Only Owner/Admin
  // -------------------------------------------------------------------------
  async remove(id: number, authUser: AuthUser) {
    const task = await this.findOne(id, authUser);

    if (authUser.role !== 'OWNER' && authUser.role !== 'ADMIN') {
      throw new ForbiddenException('Not allowed to delete this task');
    }

    await this.tasks.remove(task);
    this.auditLog.log(`Deleted task #${id}`, authUser);

    return { success: true };
  }
}