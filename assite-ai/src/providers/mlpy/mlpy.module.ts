import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MlpyService } from './mlpy.service';
import mlpyConfig from 'src/config/mlpy.config';

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [mlpyConfig.KEY],
      useFactory: (mlp: ConfigType<typeof mlpyConfig>) => ({
        baseURL: mlp.mlpyBaseUrl,
      }),
    }),
  ],
  providers: [MlpyService],
  exports: [MlpyService],
})
export class MlpyModule {}
