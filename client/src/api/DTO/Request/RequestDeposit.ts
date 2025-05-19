import { z } from 'zod';

const details = z
    .record(
        z.string(),
        z.string().refine(
            (value) => {
                const parsedValue = parseInt(value);
                return (!isNaN(parsedValue) && parsedValue > 0) || value === '';
            },
            { message: 'Количество кристалов должно быть больше 0' }, //short messasge
        ),
    )
    .transform((value) => {
        const cleaned: Record<string, string> = {};
        for (const key in value) {
            if (value[key] !== '') {
                cleaned[key] = value[key];
            }
        }
        return cleaned;
    })
    .refine((value) => Object.keys(value).some((key) => value[key] !== ''), {
        message: 'Необходимо добавить хотя бы один кристал',
    });

export const RequestDepositSchema = z.object({
    teamId: z
        .number({
            coerce: true,
            invalid_type_error: 'Пожалуйста, выберите команду',
        })
        .min(1, 'Пожалуйста, выберите команду'),
    details: details,
});

export type RequestDepositDTO = z.infer<typeof RequestDepositSchema>;
export type RequestDepositDTODetails = z.infer<typeof details>;
