import { z } from "zod";

export const DTeamSchema = z.object({
    id: z.number({ coerce: true }),
    title: z.string(),
    balance: z.number({ coerce: true }),
    color: z.string(),
});

export const DTeamArraySchema = z.array(DTeamSchema);

export type DTeamDTO = z.infer<typeof DTeamSchema>;