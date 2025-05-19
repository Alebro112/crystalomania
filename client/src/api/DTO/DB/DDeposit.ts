import { z } from "zod";
import { DTeamSchema } from "./DTeam";

export const DDepositStatusSchema = z.object({
    id: z.number({ coerce: true }),
    name: z.string(),
});

export const DDepositSchema = z.object({
    id: z.number({ coerce: true }),
    teamId: z.number({ coerce: true }),
    statusId: z.number({ coerce: true }),
    amount: z.number({ coerce: true }),
    details: z.record(z.string(), z.number({ coerce: true })),
    team: DTeamSchema.optional(),
    status: DDepositStatusSchema.optional(),
    createdAt: z.string().datetime()
});

export const DDepositArraySchema = z.array(DDepositSchema);

export type DDepositDTO = z.infer<typeof DDepositSchema>;