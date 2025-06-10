import z from 'zod';

const cellSchema = z.string().base64();

export const parseTlbBodySchema = z
    .object({
        schema: z.string(),
        cell: cellSchema,
    })
    .strip();

export const tryParseTlbBodySchema = z
    .object({
        cell: cellSchema,
    })
    .strip();

export type ParseTlbBody = z.infer<typeof parseTlbBodySchema>;
export type TryParseTlbBody = z.infer<typeof tryParseTlbBodySchema>;
