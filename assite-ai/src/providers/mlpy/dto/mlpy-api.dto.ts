import { MovieListDocument } from 'src/movies-list/schemas/movie-list.schema';
import { TmdbMovieTransformerDto } from 'src/providers/tmdb/dto/tmdb-api.dto';

export interface RecommendationResponse {
  recommendations: Recommendation[];
}

export interface Recommendation {
  adult: boolean;
  backdrop_path: string | null;
  desc_score: number;
  final_score: number;
  genre_score: number;
  genres: string[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface RecomendationPayload {
  genres: string[];
  movies: TmdbMovieTransformerDto[];
  userHistory: MovieListDocument[];
}
