import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entities';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepo: Repository<AuditLog>,
  ) {}

  log(action: string, user: any) {
    const entry = this.auditRepo.create({
      action,
      userEmail: user.email,
      role: user.role,
      organizationId: user.orgId,
    });

    return this.auditRepo.save(entry);
  }

  async getAll(filter: string) {
    const qb = this.auditRepo
      .createQueryBuilder("log")
      .orderBy("log.createdAt", "DESC");

    const now = new Date();
    let since: Date | null = null;

    if (filter === "day")
      since = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    if (filter === "week")
      since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    if (filter === "month")
      since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    if (since) {
      qb.andWhere("log.createdAt >= :since", { since });
    }

    return qb.getMany();
  }
}