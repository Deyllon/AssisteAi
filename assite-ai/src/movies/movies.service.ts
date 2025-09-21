import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TmdbMovieTransformerDto } from 'src/providers/tmdb/dto/tmdb-api.dto';

import { TmdbService } from 'src/providers/tmdb/tmdb.service';

@Injectable()
export class MoviesService {
  private readonly discoveryMoviesCacheKey = 'discovery_movies_list';
  private readonly minPage = 1;
  private readonly maxPage = 10;
  private readonly pagesToFetch = 2;

  constructor(
    private readonly tmdbService: TmdbService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getListOfMovies() {
    const cachedMovies = await this.cacheManager.get<TmdbMovieTransformerDto[]>(
      this.discoveryMoviesCacheKey,
    );

    if (cachedMovies) {
      console.log('chache');
      return cachedMovies;
    }

    const randomPages = new Set<number>();
    while (randomPages.size < this.pagesToFetch) {
      const randomPage =
        Math.floor(Math.random() * this.maxPage) + this.minPage;
      randomPages.add(randomPage);
    }

    const pagesToFetch = Array.from(randomPages);

    const promisesRatedMovies = pagesToFetch.map((page) =>
      this.tmdbService.getTopRatedMovies(page),
    );

    const prommisesPopularMovies = pagesToFetch.map((page) =>
      this.tmdbService.getPopularMovies(page),
    );

    const prommisesActualMovies = pagesToFetch.map((page) =>
      this.tmdbService.getActualMovies(page),
    );

    const [ratedResponses, popularResponses, actualResponses] =
      await Promise.all([
        Promise.all(promisesRatedMovies),
        Promise.all(prommisesPopularMovies),
        Promise.all(prommisesActualMovies),
      ]);
    const allRatedMovies = ratedResponses.flatMap(
      (response) => response.results,
    );
    const allPopularMovies = popularResponses.flatMap(
      (response) => response.results,
    );
    const allActualMovies = actualResponses.flatMap(
      (response) => response.results,
    );

    const combinedMovies = [
      ...allRatedMovies,
      ...allPopularMovies,
      ...allActualMovies,
    ];

    const uniqueMoviesMap = new Map<number, TmdbMovieTransformerDto>();
    combinedMovies.forEach((movie) => {
      uniqueMoviesMap.set(movie.id, movie);
    });
    const finalUniqueMovies = Array.from(uniqueMoviesMap.values());

    if (!finalUniqueMovies || finalUniqueMovies.length === 0) {
      throw new NotFoundException(
        'Não foi possível encontrar filmes nas páginas selecionadas.',
      );
    }

    await this.cacheManager.set(
      this.discoveryMoviesCacheKey,
      finalUniqueMovies,
      1200 * 1000,
    );

    return finalUniqueMovies;
  }

  findOne(id: number) {
    return `This action returns a #${id} movie`;
  }
}
