/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import httpConfig from 'src/config/http.config';
import { movieGenresMap } from 'src/utils/genre.map';
import {
  TmdbMovieDto,
  TmdbMovieTransformerDto,
  TmdbPageResponseDto,
} from './dto/tmdb-api.dto';

@Injectable()
export class TmdbService implements OnModuleInit {
  private readonly genreMap: Map<number, string> = movieGenresMap;
  constructor(
    private readonly httpService: HttpService,
    @Inject(httpConfig.KEY)
    private readonly config: ConfigType<typeof httpConfig>,
  ) {}

  onModuleInit() {
    const axiosInstance = this.httpService.axiosRef;

    const maxRetries = parseInt(this.config.httpRetries as string);
    const initialDelay = parseInt(this.config.httpDelay as string);

    axiosInstance.interceptors.response.use(
      (response) => response,

      async (error: AxiosError) => {
        const config = error.config;
        if (!config) {
          return Promise.reject(error);
        }

        if (!config['retries']) {
          config['retries'] = 0;
        }
        config['retries'] += 1;

        const status = error.response?.status;
        const isRetryable = !status || status === 429 || status >= 500;

        if (isRetryable && config['retries'] < maxRetries) {
          const delay = initialDelay * Math.pow(2, config['retries'] - 1);
          console.log(
            `[Retry] Request to ${config.url} failed. Retrying in ${delay}ms (attempt ${config['retries']})`,
          );

          await new Promise((resolve) => setTimeout(resolve, delay));

          return this.httpService.axiosRef(config);
        }

        // Se o erro não for "retryable" ou se o número de tentativas foi excedido,
        // rejeita a promessa para que o erro seja tratado no código que fez a chamada.
        return Promise.reject(error);
      },
    );
  }

  async getTopRatedMovies(page: number) {
    try {
      const response: AxiosResponse<TmdbPageResponseDto<TmdbMovieDto>> =
        await firstValueFrom(
          this.httpService.get(
            `movie/top_rated?language=en-US&page=${page}&region=BR`,
          ),
        );

      const transformedMovies = response.data.results.map((movie) =>
        this.transformMovie(movie),
      );
      return {
        ...response.data,
        results: transformedMovies,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData: {
          status: number | undefined;
          message: string;
          url: string | undefined;
          method: string | undefined;
        } = {
          status: error.response?.status,
          message: error.message,
          url: error.config?.url,
          method: error.config?.method,
        };
        console.error(
          `[Service] Failed to fetch top rated movies. API Error:`,
          JSON.stringify(errorData, null, 2),
        );
        throw new HttpException(
          errorData.message ||
            'An error occurred while fetching from external API.',
          errorData.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        console.error(`[Service] An unexpected error occurred:`, error.message);
      }
      throw error;
    }
  }

  async getPopularMovies(page: number) {
    try {
      const response: AxiosResponse<TmdbPageResponseDto<TmdbMovieDto>> =
        await firstValueFrom(
          this.httpService.get(
            `movie/popular?language=en-US&page=${page}&region=BR`,
          ),
        );
      const transformedMovies = response.data.results.map((movie) =>
        this.transformMovie(movie),
      );
      return {
        ...response.data,
        results: transformedMovies,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData: {
          status: number | undefined;
          message: string;
          url: string | undefined;
          method: string | undefined;
        } = {
          status: error.response?.status,
          message: error.message,
          url: error.config?.url,
          method: error.config?.method,
        };
        console.error(
          `[Service] Failed to fetch popular movies. API Error:`,
          JSON.stringify(errorData, null, 2),
        );
        throw new HttpException(
          errorData.message ||
            'An error occurred while fetching from external API.',
          errorData.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        console.error(`[Service] An unexpected error occurred:`, error.message);
      }
      throw error;
    }
  }

  async getActualMovies(page: number) {
    try {
      const response: AxiosResponse<TmdbPageResponseDto<TmdbMovieDto>> =
        await firstValueFrom(
          this.httpService.get(
            `movie/now_playing?language=en-US&page=${page}&region=BR`,
          ),
        );
      const transformedMovies = response.data.results.map((movie) =>
        this.transformMovie(movie),
      );
      return {
        ...response.data,
        results: transformedMovies,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData: {
          status: number | undefined;
          message: string;
          url: string | undefined;
          method: string | undefined;
        } = {
          status: error.response?.status,
          message: error.message,
          url: error.config?.url,
          method: error.config?.method,
        };
        console.error(
          `[Service] Failed to fetch actual movies. API Error:`,
          JSON.stringify(errorData, null, 2),
        );
        throw new HttpException(
          errorData.message ||
            'An error occurred while fetching from external API.',
          errorData.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        console.error(`[Service] An unexpected error occurred:`, error.message);
      }
      throw error;
    }
  }

  async getMovieById(movieId: number) {
    try {
      const response: AxiosResponse<TmdbMovieDto> = await firstValueFrom(
        this.httpService.get(`movie/${movieId}?language=en-US`),
      );

      const transformedMovie = this.transformDetailedMovie(response.data);

      return transformedMovie;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData: {
          status: number | undefined;
          message: string;
          url: string | undefined;
          method: string | undefined;
        } = {
          status: error.response?.status,
          message: error.message,
          url: error.config?.url,
          method: error.config?.method,
        };
        console.error(
          `[Service] Failed to fetch movie by id. API Error:`,
          JSON.stringify(errorData, null, 2),
        );
        throw new HttpException(
          errorData.message ||
            'An error occurred while fetching from external API.',
          errorData.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        console.error(`[Service] An unexpected error occurred:`, error.message);
      }
      throw error;
    }
  }

  private transformMovie(movie: TmdbMovieDto): TmdbMovieTransformerDto {
    const genreNames = movie.genre_ids.map(
      (id: number) => this.genreMap.get(id) || 'Desconhecido',
    );

    const { genre_ids, ...restOfMovie } = movie;

    return {
      ...restOfMovie,
      genres: genreNames,
    };
  }

  private transformDetailedMovie(movie: any): TmdbMovieTransformerDto {
    const genreNames = movie.genres.map(
      (x: any) => this.genreMap.get(x.id) || 'Desconhecido',
    );

    const { genre_ids, ...restOfMovie } = movie;

    return {
      ...restOfMovie,
      genres: genreNames,
    };
  }
}
