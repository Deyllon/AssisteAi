import { registerAs } from '@nestjs/config';

export default registerAs('mongo', () => ({
  mongodbUri: process.env.MONGODB_URI,
  mongodbUser: process.env.MONGO_USER,
  mongodbPassword: process.env.MONGO_PASS,
}));
