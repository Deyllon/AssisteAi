import { Module } from '@nestjs/common';
import { TmdbService } from './tmdb.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigType } from '@nestjs/config';
import httpConfig from '../../config/http.config';

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [httpConfig.KEY],
      useFactory: (http: ConfigType<typeof httpConfig>) => ({
        timeout: parseInt(http.httpTimeout as string),
        maxRedirects: parseInt(http.httpRedirect as string),
        baseURL: http.tmdbBaseURL,
        headers: {
          Authorization: `Bearer ${http.tmdbApiToken}`,
        },
      }),
    }),
  ],
  providers: [TmdbService],
  exports: [TmdbService],
})
export class TmdbModule {}
