import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // Crear tarea
  @ApiOperation({ summary: 'Crear una tarea' })
  @Post()
  create(@Req() req, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(req.user.sub, dto);
  }

  @ApiOperation({ summary: 'Listar tareas del usuario' })
  @Get()
  findAll(
    @Req() req,
    @Query('status') status?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const parsedStatus = status as TaskStatus | undefined;
  
    return this.tasksService.findAll(
      req.user.sub,
      parsedStatus,
      Number(page),
      Number(limit),
    );
  }

  // Actualizar tarea
  @ApiOperation({ summary: 'Actualizar una tarea' })
  @Patch(':id')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(req.user.sub, id, dto);
  }

  // Eliminar tarea
  @ApiOperation({ summary: 'Eliminar una tarea' })
  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.tasksService.remove(req.user.sub, id);
  }
}