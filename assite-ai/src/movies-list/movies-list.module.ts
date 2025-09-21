/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { MoviesListService } from './movies-list.service';
import { MoviesListController } from './movies-list.controller';
import { MoviesModule } from 'src/movies/movies.module';
import { MovieListRepository } from './movie-list.repository';
import { TmdbModule } from 'src/providers/tmdb/tmdb.module';
import { MovieList, MovieListSchema } from './schemas/movie-list.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MoviesModule,
    TmdbModule,
    MongooseModule.forFeature([
      { name: MovieList.name, schema: MovieListSchema },
    ]),
  ],
  providers: [MoviesListService, MovieListRepository],
  controllers: [MoviesListController],
  exports: [MoviesListService],
})
export class MoviesListModule {}
