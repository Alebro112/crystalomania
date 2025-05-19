import { z } from "zod";

export const DUserSchema = z.object({
    id: z.number({ coerce: true }),
    login: z.string(),
    name: z.string(),
    admin: z.boolean(),
});

export const DUserArraySchema = z.array(DUserSchema);

export type DUserDTO = z.infer<typeof DUserSchema>;