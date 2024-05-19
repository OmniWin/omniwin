import Redis from 'ioredis';

class RedisService {
  private static instance: RedisService;
  private redis: Redis;

  private constructor() {
    this.redis = new Redis({
      host: 'localhost',
      port: 6380
    });
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  public async updateRedis(uniqueID: string): Promise<void> {
    try {
      await this.redis.set(uniqueID, uniqueID);
      console.log(`Event data saved to Redis with key: ${uniqueID}`);
    } catch (error) {
      console.error('Failed to save event data to Redis:', error);
    }
    console.log("Updating Redis with new raffle and blockchain event data.");
  }

  async getEventFromRedis(uniqueID: string) {
    try {
      const data = await this.redis.get(uniqueID);
      if (!data) {
        return false;
      }
      return true;
    } catch (error) {
      console.error('Failed to retrieve event data from Redis:', error);
      return false;
    }
  }
}

export default RedisService.getInstance();
  
 