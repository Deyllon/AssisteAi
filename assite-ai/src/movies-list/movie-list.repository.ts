/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MovieList, MovieListDocument } from './schemas/movie-list.schema';
import { TmdbMovieTransformerDto } from 'src/providers/tmdb/dto/tmdb-api.dto';

@Injectable()
export class MovieListRepository {
  constructor(
    @InjectModel(MovieList.name)
    private readonly movieListModel: Model<MovieListDocument>,
  ) {}

  async create(
    tmdMovieDto: TmdbMovieTransformerDto,
    userId: string,
    liked: boolean,
  ): Promise<MovieListDocument> {
    try {
      const movieList = new this.movieListModel({
        userId: userId,
        movieGenre: tmdMovieDto.genres,
        movieId: tmdMovieDto.id,
        liked: liked,
        movieDescription: tmdMovieDto.overview,
      });
      return await movieList.save();
    } catch (error) {
      console.error('Error creating movie list in repository:', error);
      throw new InternalServerErrorException('Erro ao criar liste de filmes.');
    }
  }

  async findAll(userId: string): Promise<MovieListDocument[]> {
    try {
      return await this.movieListModel.find({ userId: userId }).exec();
    } catch (error) {
      console.error('Error finding all movie list in repository:', error);
      throw new InternalServerErrorException('Erro ao buscar lista de filmes.');
    }
  }
}
