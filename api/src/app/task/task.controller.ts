import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';

import { TaskService } from './task.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() dto: CreateTaskDto, @Req() req) {
    return this.taskService.create(dto, req.user);
  }

  @Get()
  findAll(@Req() req) {
    return this.taskService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.taskService.findOne(Number(id), req.user);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @Req() req,
  ) {
    return this.taskService.update(Number(id), dto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.taskService.remove(Number(id), req.user);
  }
}