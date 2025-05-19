import { z } from 'zod';

export const RequestRollbackDepositSchema = z.object({
    id: z.number({
        coerce: true
    }).min(1)
});

export type RequestRollbackDepositDTO = z.infer<typeof RequestRollbackDepositSchema>