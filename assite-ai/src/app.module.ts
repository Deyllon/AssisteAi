import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TmdbModule } from './providers/tmdb/tmdb.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { MoviesModule } from './movies/movies.module';
import { CacheModule } from './cache/cache.module';
import { AuthModule } from './auth/auth.module';
import mongodbConfig from './config/mongodb.config';
import httpConfig from './config/http.config';
import cacheConfig from './config/cache.config';
import * as Joi from 'joi';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core/constants';
import { MoviesListModule } from './movies-list/movies-list.module';
import { RecomendationModule } from './recomendation/recomendation.module';
import mlpyConfig from './config/mlpy.config';

@Module({
  imports: [
    UsersModule,
    TmdbModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        HTTP_TIMEOUT: Joi.number().default(5000),
        HTTP_MAX_REDIRECTS: Joi.number().default(3),
        TMDB_BASE_URL: Joi.string().required(),
        TMDB_API_TOKEN: Joi.string().required(),
        MAX_RETRIES: Joi.number().default(3),
        INITIAL_DELAY: Joi.number().default(500),
        MONGO_USER: Joi.string().required(),
        MONGO_PASS: Joi.string().required(),
        MONGODB_URI: Joi.string().required(),
        REDIS_PASSWORD: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().default(6379),
        JWT_SECRET: Joi.string().required(),
        MLPY_BASE_UR: Joi.string().required(),
      }),
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
        stripUnknown: true,
      },
      isGlobal: true,
      load: [mongodbConfig, httpConfig, cacheConfig, mlpyConfig],
    }),
    DatabaseModule,
    MoviesModule,
    CacheModule,
    AuthModule,
    MoviesListModule,
    RecomendationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
