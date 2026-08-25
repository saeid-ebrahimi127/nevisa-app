import { z } from 'zod'

export const serverEnv = z
  .object({
    APP_ENV: z.literal(['development', 'production', 'test']),
    APP_NAME: z.string().min(1),
    APP_URL: z.url(),
    APP_SESSION_PASSWORD: z.string().min(64),
    DATABASE_URL: z.url(),
    BETTER_AUTH_BASE_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(64),
    REDIS_URL: z.url(),
    SMTP_HOST: z.string().min(1),
    SMTP_PORT: z.coerce.number().int().positive(),
    SMTP_SECURE: z
      .literal(['true', 'false'])
      .optional()
      .default('false')
      .transform((value) => value === 'true'),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    SMTP_FROM_ADDRESS: z.string().min(1),
  })
  .parse(process.env)
