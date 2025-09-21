import { Test, TestingModule } from '@nestjs/testing';
import { MlpyService } from './mlpy.service';

describe('MlpyService', () => {
  let service: MlpyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MlpyService],
    }).compile();

    service = module.get<MlpyService>(MlpyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
