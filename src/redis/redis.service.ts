import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get(key) {
    return await this.cacheManager.get(key);
  }

  async set(key, value) {
    // console.log(key, value);
    return await this.cacheManager.set(key, value, { ttl: 86400 });
  }

  async reset() {
    await this.cacheManager.reset();
  }

  async del(key) {
    await this.cacheManager.del(key);
  }
}
