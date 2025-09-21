import { z } from 'zod';
import { CreateUser } from './create-user.dto';

export const UpdateUserSchema = CreateUser.partial();

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
