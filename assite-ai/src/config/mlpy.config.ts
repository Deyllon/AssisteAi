import { registerAs } from '@nestjs/config';

export default registerAs('mlpy', () => ({
  mlpyBaseUrl: process.env.MLPY_BASE_UR,
}));
