/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { MoviesListService } from './movies-list.service';
import { MovieList } from './schemas/movie-list.schema';
import {
  CreateMovieList,
  CreateMovieListDto,
} from './dto/create-moviel-list.dto';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('movies-list')
export class MoviesListController {
  constructor(private readonly moviesListService: MoviesListService) {}

  @Post(':id')
  async ceateMovieById(
    @Body(new ZodValidationPipe(CreateMovieList)) payload: CreateMovieListDto,
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ): Promise<MovieList> {
    return this.moviesListService.ceateMovieById(
      id,
      req.user.userId,
      payload.liked,
    );
  }

  @Get()
  async getMovieList(@Req() req): Promise<MovieList[]> {
    return this.moviesListService.getMovieList(req.user.userId);
  }
}
