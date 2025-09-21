import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { TmdbModule } from 'src/providers/tmdb/tmdb.module';

@Module({
  imports: [TmdbModule],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
