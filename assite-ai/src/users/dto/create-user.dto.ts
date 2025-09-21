import { movieGenresMap } from 'src/utils/genre.map';
import { z } from 'zod';

export const CreateUser = z.object({
  name: z
    .string({
      error: 'O nome é obrigatório.',
    })
    .nonempty()
    .min(3, { message: 'O nome deve ter no mínimo 3 caracteres.' })
    .trim(),

  email: z
    .email({
      error: 'Você deve inserir um email valido',
    })
    .toLowerCase()
    .trim(),

  password: z
    .string({
      error: 'A senha é obrigatória.',
    })
    .min(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
    .superRefine((password, ctx) => {
      if (!/[A-Z]/.test(password)) {
        ctx.addIssue({
          code: 'custom',
          message: 'A senha deve conter pelo menos uma letra maiúscula.',
        });
      }
      if (!/[a-z]/.test(password)) {
        ctx.addIssue({
          code: 'custom',
          message: 'A senha deve conter pelo menos uma letra minúscula.',
        });
      }
      if (!/[0-9]/.test(password)) {
        ctx.addIssue({
          code: 'custom',
          message: 'A senha deve conter pelo menos um número.',
        });
      }
      if (!/[^A-Za-z0-9]/.test(password)) {
        ctx.addIssue({
          code: 'custom',
          message: 'A senha deve conter pelo menos um caractere especial.',
        });
      }
    }),
  genre: z.array(z.enum(Array.from(movieGenresMap.values()))).default([]),
});

export type CreateUserDto = z.infer<typeof CreateUser>;
