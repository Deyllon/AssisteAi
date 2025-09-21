import { Module } from '@nestjs/common';
import { RecomendationController } from './recomendation.controller';
import { RecomendationService } from './recomendation.service';
import { UsersModule } from 'src/users/users.module';
import { MoviesModule } from 'src/movies/movies.module';
import { MoviesListModule } from 'src/movies-list/movies-list.module';
import { MlpyModule } from 'src/providers/mlpy/mlpy.module';

@Module({
  imports: [UsersModule, MoviesModule, MoviesListModule, MlpyModule],
  controllers: [RecomendationController],
  providers: [RecomendationService],
})
export class RecomendationModule {}
