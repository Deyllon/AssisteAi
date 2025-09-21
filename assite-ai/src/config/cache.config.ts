import { registerAs } from '@nestjs/config';

export default registerAs('cache', () => ({
  redisPassword: process.env.REDIS_PASSWORD,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
}));
