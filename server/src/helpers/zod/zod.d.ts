import { z } from 'zod';

export type FieldSource = 'body' | 'params' | 'query';

export type FieldWithSource = {
    source: FieldSource;
    type: z.ZodTypeAny;
};

export type FieldDefinition = z.ZodTypeAny | FieldWithSource;

export type ZodFieldMap = {
    [key: string]: FieldDefinition;
};

export interface ZodConfig {
    fields: ZodFieldMap;
    schema?: z.ZodObject<any>;
}