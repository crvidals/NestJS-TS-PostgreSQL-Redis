import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: 'localhost',
      port: 6379,
    });
  }

  async get(key: string) {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: any, ttl = 60) {
    await this.client.set(key, JSON.stringify(value), 'EX', ttl);
  }

  async del(key: string) {
    await this.client.del(key);
  }

  onModuleDestroy() {
    this.client.disconnect();
  }
}