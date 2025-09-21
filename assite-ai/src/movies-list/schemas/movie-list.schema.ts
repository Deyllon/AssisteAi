/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { movieGenresMap } from 'src/utils/genre.map';

export type MovieListDocument = HydratedDocument<MovieList>;

@Schema({ timestamps: true })
export class MovieList {
  @Prop({ required: true })
  movieId: string;

  @Prop({ required: true })
  liked: boolean;

  @Prop({ required: true, index: true })
  userId: string;

  @Prop({
    type: [String],
    enum: Array.from(movieGenresMap.values()),
    default: [],
  })
  movieGenre: string[];

  @Prop({ required: true })
  movieDescription: string;
}

export const MovieListSchema = SchemaFactory.createForClass(MovieList);
