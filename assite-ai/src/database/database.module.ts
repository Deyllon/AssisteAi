import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongodbConfig from '../config/mongodb.config';

@Module({
  imports: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [mongodbConfig.KEY],
      useFactory: (mongoConfig: ConfigType<typeof mongodbConfig>) => ({
        uri: mongoConfig.mongodbUri,
      }),
    }),
  ],
})
export class DatabaseModule {}
