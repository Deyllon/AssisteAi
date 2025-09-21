import { Test, TestingModule } from '@nestjs/testing';
import { MoviesListService } from './movies-list.service';

describe('MoviesListService', () => {
  let service: MoviesListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesListService],
    }).compile();

    service = module.get<MoviesListService>(MoviesListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
