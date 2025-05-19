import { z } from 'zod'

const deposit = z.record(z.string(), z.number({ coerce: true }).min(1))

export const RequestDepositSchema = z.object({
    teamId: z.number({ coerce: true }).min(1),
    details: deposit
})

export type RequestDepositDTO = z.infer<typeof RequestDepositSchema>
export type RequestDepositDTODetails = z.infer<typeof deposit>