import { Injectable } from '@nestjs/common';
import { MoviesListService } from 'src/movies-list/movies-list.service';
import { MoviesService } from 'src/movies/movies.service';
import { MlpyService } from 'src/providers/mlpy/mlpy.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RecomendationService {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly usersService: UsersService,
    private readonly moviesListService: MoviesListService,
    private readonly mlpyService: MlpyService,
  ) {}

  async getRecomendation(userId: string) {
    const user = await this.usersService.findOne(userId);
    const movies = await this.moviesService.getListOfMovies();
    const userHistory = await this.moviesListService.getMovieList(userId);
    const recomendationPayload = {
      genres: user.genre,
      movies: movies,
      userHistory: userHistory,
    };

    return await this.mlpyService.sendMoviesToGetRecomendation(
      recomendationPayload,
    );
  }
}
