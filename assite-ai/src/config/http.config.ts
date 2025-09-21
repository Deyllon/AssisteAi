import { registerAs } from '@nestjs/config';

export default registerAs('http', () => ({
  httpTimeout: process.env.HTTP_TIMEOUT,
  httpRedirect: process.env.HTTP_MAX_REDIRECTS,
  httpRetries: process.env.MAX_RETRIES,
  httpDelay: process.env.INITIAL_DELAY,
  tmdbBaseURL: process.env.TMDB_BASE_URL,
  tmdbApiToken: process.env.TMDB_API_TOKEN,
}));
