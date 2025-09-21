import { Injectable, NotFoundException } from '@nestjs/common';
import { TmdbService } from 'src/providers/tmdb/tmdb.service';
import { MovieListRepository } from './movie-list.repository';
import { MovieListDocument } from './schemas/movie-list.schema';

@Injectable()
export class MoviesListService {
  constructor(
    private readonly movieListRespository: MovieListRepository,
    private readonly tmdbService: TmdbService,
  ) {}

  async ceateMovieById(
    movieId: number,
    userId: string,
    liked: boolean,
  ): Promise<MovieListDocument> {
    const tmdbMovie = await this.tmdbService.getMovieById(movieId);
    if (!tmdbMovie) {
      throw new NotFoundException(`Movie with id ${movieId} not found`);
    }
    const movie = await this.movieListRespository.create(
      tmdbMovie,
      userId,
      liked,
    );

    return movie;
  }

  async getMovieList(userId: string): Promise<MovieListDocument[]> {
    const movieList = await this.movieListRespository.findAll(userId);
    return movieList;
  }
}
