import { z } from 'zod';

export const zodFieldErrorSchema = z.object({
    path: z.array(z.string()),
    message: z.string(),
});

export const zodErrorsObjectSchema = z.object({
    issues: z.array(zodFieldErrorSchema),
    name: z.string(),
});

export const zodBackendErrorSchema = z.object({
    errors: zodErrorsObjectSchema,
});

export type ZodFieldError = z.infer<typeof zodFieldErrorSchema>;
export type ZodErrorsObject = z.infer<typeof zodErrorsObjectSchema>;
export type ZodBackendError = z.infer<typeof zodBackendErrorSchema>;
