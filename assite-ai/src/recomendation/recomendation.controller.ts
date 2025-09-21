/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Get, Req } from '@nestjs/common';
import { RecomendationService } from './recomendation.service';

@Controller('recomendation')
export class RecomendationController {
  constructor(private readonly recomendationService: RecomendationService) {}
  @Get()
  async getRecomendation(@Req() req) {
    return this.recomendationService.getRecomendation(req.user.userId);
  }
}
