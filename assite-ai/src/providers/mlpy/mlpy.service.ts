/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import mlpyConfig from 'src/config/mlpy.config';
import {
  RecomendationPayload,
  RecommendationResponse,
} from './dto/mlpy-api.dto';

@Injectable()
export class MlpyService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(mlpyConfig.KEY)
    private readonly config: ConfigType<typeof mlpyConfig>,
  ) {}

  async sendMoviesToGetRecomendation(
    recomendationPayload: RecomendationPayload,
  ) {
    try {
      const response: AxiosResponse<RecommendationResponse> =
        await firstValueFrom(
          this.httpService.post(`recommend`, recomendationPayload),
        );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData: {
          status: number | undefined;
          message: string;
          url: string | undefined;
          method: string | undefined;
        } = {
          status: error.response?.status,
          message: error.message,
          url: error.config?.url,
          method: error.config?.method,
        };
        console.error(
          `[Service] Failed to fetch actual movies. API Error:`,
          JSON.stringify(errorData, null, 2),
        );
        throw new HttpException(
          errorData.message ||
            'An error occurred while fetching from external API.',
          errorData.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        console.error(`[Service] An unexpected error occurred:`, error.message);
      }
      throw error;
    }
  }
}
