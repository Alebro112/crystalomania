import { z } from 'zod';

export const RequestLoginSchema = z.object({
    login: z.string().min(5),
    password: z.string().min(8),
});

export type RequestLoginDTO = z.infer<typeof RequestLoginSchema>;