import { z } from 'zod'

export const serverEnv = z
  .object({
    APP_NAME: z.string().min(1),
    DATABASE_URL: z.url(),
    BETTER_AUTH_BASE_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(64),
  })
  .parse(process.env)
