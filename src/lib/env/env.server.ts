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
  })
  .parse(process.env)
