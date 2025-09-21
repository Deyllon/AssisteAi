/* eslint-disable @typescript-eslint/require-await */
import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { ConfigModule, ConfigType } from '@nestjs/config';
import cacheConfig from '../config/cache.config';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [cacheConfig.KEY],
      useFactory: async (cache: ConfigType<typeof cacheConfig>) => {
        return {
          stores: [
            new KeyvRedis(
              `redis://:${cache.redisPassword}@${cache.redisHost}:${cache.redisPort}`,
            ),
          ],
        };
      },
      isGlobal: true,
    }),
  ],
})
export class CacheModule {}
