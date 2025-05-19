import { z  } from "zod";

export const DCurrencySchema = z.object({
    id: z.number({ coerce: true }),
    name: z.string(),
    title: z.string(),
    baseValue: z.number({ coerce: true }),
    rate: z.number({ coerce: true }),
    total: z.number({ coerce: true }),
});

export const DCurrencyArraySchema = z.array(DCurrencySchema);

export type DCurrencyDTO = z.infer<typeof DCurrencySchema>;