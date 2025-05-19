import { z } from 'zod';

export const RequestLoginSchema = z.object({
    login: z.string({
        required_error: 'Логин обязателен',
    }).min(5, 'Логин должен быть не менее 5 символов'),
    password: z.string({
        required_error: 'Пароль обязателен',
    }).min(8, 'Пароль должен быть не менее 8 символов'),
});

export type RequestLoginDTO = z.infer<typeof RequestLoginSchema>;