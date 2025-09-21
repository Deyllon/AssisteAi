import { z } from 'zod';

export const CreateMovieList = z.object({
  liked: z.boolean().nonoptional(),
});

export type CreateMovieListDto = z.infer<typeof CreateMovieList>;
