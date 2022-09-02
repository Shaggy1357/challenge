import { Module, CacheModule } from '@nestjs/common';
import { RedisService } from './redis.service';
import * as redisStore from 'cache-manager-redis-store';
require('dotenv').config();

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ttl: 60,
      max: 1000,
      isGlobal: true,
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
