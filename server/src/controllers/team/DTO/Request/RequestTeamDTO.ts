import { z } from 'zod';

export const RequestTeamSchema = z.object({
    title: z.string().min(1),
});

export type RequestTeamDTO = z.infer<typeof RequestTeamSchema>;
