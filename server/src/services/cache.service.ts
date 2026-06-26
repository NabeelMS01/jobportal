import Redis from 'ioredis';

// Ensure the REDIS_URL is provided in production, otherwise fallback to localhost
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = new Redis(redisUrl, {
  // Retry strategy just in case Redis is not immediately available
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('error', (err) => {
  console.error('Redis Client Error', err);
});

export class CacheService {
  /**
   * Get a cached value
   * @param key Cache key
   * @returns The parsed JSON value or null if not found
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`Cache GET error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set a cached value with optional expiration
   * @param key Cache key
   * @param value Value to cache
   * @param ttlSeconds Time to live in seconds (default 300 = 5 minutes)
   */
  static async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      await redis.set(key, stringValue, 'EX', ttlSeconds);
    } catch (error) {
      console.error(`Cache SET error for key ${key}:`, error);
    }
  }

  /**
   * Delete a specific cache key
   * @param key Cache key
   */
  static async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.error(`Cache DEL error for key ${key}:`, error);
    }
  }

  /**
   * Delete all cache keys matching a pattern (e.g., "jobs:*")
   * @param pattern Match pattern
   */
  static async delPattern(pattern: string): Promise<void> {
    try {
      // Use scan to avoid blocking Redis with keys command
      let cursor = '0';
      do {
        const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', '100');
        cursor = nextCursor;
        if (keys.length > 0) {
          await redis.del(...keys);
        }
      } while (cursor !== '0');
    } catch (error) {
      console.error(`Cache DEL pattern error for pattern ${pattern}:`, error);
    }
  }

  /**
   * Clear the entire cache
   */
  static async flush(): Promise<void> {
    try {
      await redis.flushdb();
    } catch (error) {
      console.error('Cache FLUSH error:', error);
    }
  }
}
