import { z } from 'zod';

export const RequestUserSchema = z.object({
    login: z.string().min(5),
    password: z
        .string()
        .min(8)
        .regex(
            /(?=.*[A-Za-z])(?=.*\d)/, // regex chek at least one letter and one number
            'Password must contain at least one letter and one number',
        ),
    name: z.string().min(2),
    admin: z.boolean().optional().default(false),
});


export type RequestUserDTO = z.infer<typeof RequestUserSchema>;