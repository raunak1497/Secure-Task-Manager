import {
  Controller,
  Get,
  Query,
  UseGuards,
  Req
} from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('audit-log')
@UseGuards(JwtAuthGuard)
export class AuditLogController {
  constructor(private auditService: AuditLogService) {}

  @Get()
  async getAll(
    @Query("filter") filter: string,
    @Req() req
  ) {
    return this.auditService.getAll(filter);
  }
}