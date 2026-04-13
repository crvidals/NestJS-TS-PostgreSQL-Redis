import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  // Crear tarea
  async create(userId: string, dto: CreateTaskDto) {
    this.logger.log(`Creating task for user ${userId}`);

    const task = await this.prisma.task.create({
      data: {
        ...dto,
        userId,
      },
    });

    // invalidar cache
    await this.redis.del(`tasks:${userId}:all`);
    this.logger.log(`Cache invalidated for user ${userId}`);

    return task;
  }

  // Listar tareas (cache + paginación)
  async findAll(
    userId: string,
    status?: TaskStatus,
    page = 1,
    limit = 10,
  ) {
    // Validaciones
    page = Math.max(1, page);
    limit = Math.min(Math.max(1, limit), 50);

    this.logger.log(
      `Fetching tasks for user ${userId} | status=${status || 'all'} | page=${page} | limit=${limit}`,
    );

    const cacheKey = `tasks:${userId}:${status || 'all'}:${page}:${limit}`;

    // 1. intentar cache
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      this.logger.log(`Cache HIT: ${cacheKey}`);
      return cached;
    }

    this.logger.log(`Cache MISS: ${cacheKey}`);

    const skip = (page - 1) * limit;

    // 2. consultar DB
    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where: {
          userId,
          ...(status && { status }),
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.task.count({
        where: {
          userId,
          ...(status && { status }),
        },
      }),
    ]);

    const result = {
      data: tasks,
      meta: {
        total,
        page,
        lastPage: limit ? Math.ceil(total / limit) : 1,
      },
    };

    // 3. guardar en cache
    await this.redis.set(cacheKey, result, 60);
    this.logger.log(`Cache SET: ${cacheKey}`);

    return result;
  }

  // Actualizar tarea
  async update(userId: string, taskId: string, dto: UpdateTaskDto) {
    this.logger.log(`Updating task ${taskId} for user ${userId}`);

    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task || task.userId !== userId) {
      this.logger.warn(
        `Unauthorized update attempt | user=${userId} | task=${taskId}`,
      );
      throw new ForbiddenException('Access denied');
    }

    const updated = await this.prisma.task.update({
      where: { id: taskId },
      data: dto,
    });

    // invalidar cache
    await this.redis.del(`tasks:${userId}:all`);
    this.logger.log(`Cache invalidated for user ${userId}`);

    return updated;
  }

  // Eliminar tarea
  async remove(userId: string, taskId: string) {
    this.logger.log(`Deleting task ${taskId} for user ${userId}`);

    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task || task.userId !== userId) {
      this.logger.warn(
        `Unauthorized delete attempt | user=${userId} | task=${taskId}`,
      );
      throw new ForbiddenException('Access denied');
    }

    const deleted = await this.prisma.task.delete({
      where: { id: taskId },
    });

    // invalidar cache
    await this.redis.del(`tasks:${userId}:all`);
    this.logger.log(`Cache invalidated for user ${userId}`);

    return deleted;
  }
}