import { z } from 'zod';

import ApiError from '#middlewares/exceptions/api.error';

export function parseZod<T extends z.ZodObject<any>>(
    schema: T,
    data: unknown,
): z.infer<T> {
    const result = schema.safeParse(data);
    if (!result.success) {
        throw ApiError.BadRequest('Validation error', result.error);
    }
    return result.data;
}
