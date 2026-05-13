import { z } from 'zod'

const envSchema = z.object({
    PORT: z.coerce.number().default(3333),
    BASE_URL: z.string().url(),
    DATABASE_URL: z.string(),
    SECRET: z.string(),
    NODE_ENV: z.enum(['development', 'production', 'test']),
    CLIENT_BASE_URL: z.string().url(),
    CLOUDINARY_CLOUD_NAME: z.string(),
    CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),
})

export const env = envSchema.parse(process.env)