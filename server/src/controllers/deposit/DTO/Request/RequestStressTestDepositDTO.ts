import { z } from 'zod';


//   durationMs: number;               // Длительность теста в миллисекундах
//   maxConcurrent: number;           // Максимум параллельных запросов за один "пакет"
//   enableDelay?: boolean;           // Включать ли задержку между "пакетами"
//   minDelayMs?: number;             // Минимальная задержка (если включена)
//   maxDelayMs?: number;             // Максимальная задержка (если включена)
//   maxTotalRequests?: number;       // Ограничение на общее количество запросов (опционально)
//   logSlowResponses?: boolean;      // Показывать ли предупреждения о медленных ответах
//   slowThresholdMs?: number;        // Порог для "медленного ответа"
//   logProgress?: boolean;           // Показывать ли прогресс выполнения

export const RequestStressTestDepositSchema = z.object({
    durationMs: z
        .number({ required_error: 'durationMs is required' })
        .int()
        .positive(),

    maxConcurrent: z
        .number({ required_error: 'maxConcurrent is required' })
        .int()
        .positive(),

    enableDelay: z.boolean().optional().default(true),

    minDelayMs: z.number().int().nonnegative().optional().default(0),

    maxDelayMs: z.number().int().nonnegative().optional().default(5000),

    maxTotalRequests: z.number().int().optional().default(-1),

    logSlowResponses: z.boolean().optional().default(true),

    slowThresholdMs: z.number().int().positive().optional().default(100),
});

export type RequestStressTestDepositDTO = z.infer<
    typeof RequestStressTestDepositSchema
>;
