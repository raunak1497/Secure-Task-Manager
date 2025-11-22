import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { TaskService } from './task.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

// 👉 IMPORTANT: adjust this import to your real npmScope
import { Roles, Role } from '../../../../auth/src/index.js';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @Roles(Role.Owner, Role.Admin) // only Owner/Admin can create
  create(@Body() dto: CreateTaskDto, @Req() req: any) {
    return this.taskService.create(dto, req.user);
  }

  @Get()
  getAll(@Req() req: any) {
    return this.taskService.findAll(req.user);
  }

  @Get(':id')
  getOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    return this.taskService.findOne(id, req.user);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
    @Req() req: any,
  ) {
    return this.taskService.update(id, dto, req.user);
  }

  @Delete(':id')
  @Roles(Role.Owner, Role.Admin) // only Owner/Admin can delete
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    return this.taskService.remove(id, req.user);
  }
}